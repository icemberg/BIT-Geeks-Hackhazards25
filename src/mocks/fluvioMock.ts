interface Offset {
  fromStart: number;
}

interface FluvioInterface {
  partitionConsumer(topic: string, partition: number): Promise<{
    stream: (offset: any, callback: (record: any) => void) => void;
    stream_end?: () => Promise<void>;
    close?: () => void;
  }>;
  topicProducer(topic: string): Promise<{
    send: (key: string, value: string) => Promise<void>;
  }>;
}

class FluvioMock implements FluvioInterface {
  /**
   * Static connect method that mirrors the real Fluvio client API.
   * This is the critical method — without it, `await Fluvio.connect()` throws
   * "Fluvio.connect is not a function" (minified as "qe is not a function").
   */
  static async connect(): Promise<FluvioMock> {
    console.log('[MOCK Fluvio] connect() called — using mock client');
    return new FluvioMock();
  }

  async partitionConsumer(topic: string, partition: number) {
    return {
      stream: (offset: any, callback: (record: any) => void) => {
        console.log(`[MOCK Fluvio] consumer created for topic: ${topic}, partition: ${partition}`);
      },
      stream_end: async () => {
        console.log(`[MOCK Fluvio] consumer stream ended for topic: ${topic}`);
      },
      close: () => {
        console.log(`[MOCK Fluvio] consumer closed for topic: ${topic}`);
      }
    };
  }

  async topicProducer(topic: string) {
    return {
      send: async (key: string, value: string) => {
        console.log(`[MOCK Fluvio] message sent to topic: ${topic}`, { key, value });
      }
    };
  }
}

export default FluvioMock;
export type { FluvioInterface, Offset };