import Fluvio from '@fluvio/client';
import type { ConsumerConfig, TopicProducer } from '@fluvio/client';

interface ConstructionUpdate {
  tokenId: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  progress: number;
  estimatedCompletion: Date;
  resources: {
    materials: number;
    labor: number;
    energy: number;
  };
}

interface ResourceUpdate {
  type: 'materials' | 'labor' | 'energy';
  amount: number;
  source: string;
  timestamp: Date;
}

class FluvioService {
  private static instance: FluvioService;
  private fluvio!: Fluvio;
  private constructionConsumer: any;
  private resourceConsumer: any;
  private constructionProducer: TopicProducer | null = null;
  private resourceProducer: TopicProducer | null = null;

  private constructor() {
    this.initialize();
  }

  private async initialize() {
    const endpoint = process.env.REACT_APP_FLUVIO_ENDPOINT;
    if (!endpoint) {
      throw new Error('Fluvio endpoint is not defined');
    }
    
    try {
      this.fluvio = await Fluvio.connect();

      // Set up consumers with default configuration
      this.constructionConsumer = await this.fluvio.partitionConsumer('construction-updates', 0);
      this.resourceConsumer = await this.fluvio.partitionConsumer('resource-updates', 0);

      // Set up producers
      this.constructionProducer = await this.fluvio.topicProducer('construction-updates');
      this.resourceProducer = await this.fluvio.topicProducer('resource-updates');
    } catch (error) {
      console.error('Failed to initialize Fluvio:', error);
    }
  }

  public static getInstance(): FluvioService {
    if (!FluvioService.instance) {
      FluvioService.instance = new FluvioService();
    }
    return FluvioService.instance;
  }

  // Construction progress streaming
  public async streamConstructionUpdates(callback: (update: ConstructionUpdate) => void) {
    if (!this.constructionConsumer) return;
    
    const offset = { index: 0 };
    await this.constructionConsumer.stream(offset, (record: any) => {
      const update: ConstructionUpdate = JSON.parse(record.value_string());
      callback(update);
    });
  }

  public async publishConstructionUpdate(update: ConstructionUpdate) {
    if (!this.constructionProducer) return;
    await this.constructionProducer.send('', JSON.stringify(update));
  }

  // Resource updates streaming
  public async streamResourceUpdates(callback: (update: ResourceUpdate) => void) {
    if (!this.resourceConsumer) return;
    
    const offset = { index: 0 };
    await this.resourceConsumer.stream(offset, (record: any) => {
      const update: ResourceUpdate = JSON.parse(record.value_string());
      callback(update);
    });
  }

  public async publishResourceUpdate(update: ResourceUpdate) {
    if (!this.resourceProducer) return;
    await this.resourceProducer.send('', JSON.stringify(update));
  }

  // Cleanup
  public async disconnect() {
    try {
      if (this.constructionConsumer) {
        await this.constructionConsumer.stream_end();
      }
      if (this.resourceConsumer) {
        await this.resourceConsumer.stream_end();
      }
      this.constructionProducer = null;
      this.resourceProducer = null;
    } catch (error) {
      console.error('Error during disconnect:', error);
    }
  }
}

export default FluvioService;