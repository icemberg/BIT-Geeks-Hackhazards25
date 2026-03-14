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
  private isMock: boolean = false;

  private constructor() {
    this.initialize();
  }

  private async initialize() {
    const endpoint = process.env.REACT_APP_FLUVIO_ENDPOINT;
    if (!endpoint) {
      console.warn('Fluvio endpoint is not defined. Using mock mode.');
      this.isMock = true;
      return;
    }
    
    try {
      this.fluvio = await Fluvio.connect();

      // Set up consumers with default configuration
      this.constructionConsumer = await this.fluvio.partitionConsumer('construction-updates', 0);
      this.resourceConsumer = await this.fluvio.partitionConsumer('resource-updates', 0);

      // Set up producers
      this.constructionProducer = await this.fluvio.topicProducer('construction-updates');
      this.resourceProducer = await this.fluvio.topicProducer('resource-updates');
      this.isMock = false;
    } catch (error) {
      console.warn('Failed to initialize real Fluvio Client. Falling back to mock implementation:', error);
      this.isMock = true;
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
    if (this.isMock) {
      console.log('[MOCK FluvioService] Listening to construction updates...');
      return;
    }
    if (!this.constructionConsumer) return;
    
    const offset = { index: 0 };
    await this.constructionConsumer.stream(offset, (record: any) => {
      try {
        const update: ConstructionUpdate = JSON.parse(record.value_string());
        callback(update);
      } catch (e) {
        console.error('Failed to parse construction update', e);
      }
    });
  }

  public async publishConstructionUpdate(update: ConstructionUpdate) {
    if (this.isMock) {
      console.log('[MOCK FluvioService] Publishing construction update:', update);
      return;
    }
    if (!this.constructionProducer) return;
    await this.constructionProducer.send('', JSON.stringify(update));
  }

  // Resource updates streaming
  public async streamResourceUpdates(callback: (update: ResourceUpdate) => void) {
    if (this.isMock) {
      console.log('[MOCK FluvioService] Listening to resource updates...');
      return;
    }
    if (!this.resourceConsumer) return;
    
    const offset = { index: 0 };
    await this.resourceConsumer.stream(offset, (record: any) => {
      try {
        const update: ResourceUpdate = JSON.parse(record.value_string());
        callback(update);
      } catch (e) {
        console.error('Failed to parse resource update', e);
      }
    });
  }

  public async publishResourceUpdate(update: ResourceUpdate) {
    if (this.isMock) {
      console.log('[MOCK FluvioService] Publishing resource update:', update);
      return;
    }
    if (!this.resourceProducer) return;
    await this.resourceProducer.send('', JSON.stringify(update));
  }

  // Cleanup
  public async disconnect() {
    if (this.isMock) return;
    try {
      if (this.constructionConsumer && this.constructionConsumer.stream_end) {
        await this.constructionConsumer.stream_end();
      }
      if (this.resourceConsumer && this.resourceConsumer.stream_end) {
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