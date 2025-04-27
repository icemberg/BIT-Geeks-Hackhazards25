interface Offset {
  fromStart: number;
}

interface Fluvio {
  connect(): Promise<Fluvio>;
  partitionConsumer(topic: string, partition: number): Promise<{
    stream: (offset: Offset, callback: (record: any) => void) => void;
  }>;
  topicProducer(topic: string): Promise<{
    send: (key: string, value: string) => Promise<void>;
  }>;
}

class FluvioMock implements Fluvio {
  async connect(): Promise<Fluvio> {
    return this;
  }

  async partitionConsumer(topic: string, partition: number) {
    return {
      stream: (offset: Offset, callback: (record: any) => void) => {
        // Mock stream implementation
        console.log(`Mock Fluvio consumer created for topic: ${topic}, partition: ${partition}, offset: ${offset.fromStart}`);
      }
    };
  }

  async topicProducer(topic: string) {
    return {
      send: async (key: string, value: string) => {
        // Mock send implementation
        console.log(`Mock Fluvio message sent to topic: ${topic}`, { key, value });
      }
    };
  }
}

export default FluvioMock;
export type { Fluvio, Offset }; 