import { useState, useEffect } from 'react';
import Fluvio from '@fluvio/client';

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

export const useFluvioChat = (cityId: number) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [fluvio, setFluvio] = useState<Fluvio | null>(null);

  useEffect(() => {
    const initializeFluvio = async () => {
      try {
        const fluvioClient = await Fluvio.connect();
        setFluvio(fluvioClient);
        
        const topic = `city-${cityId}-chat`;
        const consumer = await fluvioClient.partitionConsumer(topic, 0);
        
        // Use beginning offset
        const offset = { index: 0 };
        consumer.stream(offset, (record: any) => {
          const message = JSON.parse(record.value_string());
          setMessages(prev => [...prev, message]);
        });
      } catch (error) {
        console.error('Failed to initialize Fluvio:', error);
        // Fallback to mock implementation
        const mockClient = new Fluvio();
        setFluvio(mockClient);
      }
    };

    initializeFluvio();

    return () => {
      if (fluvio) {
        // Cleanup if needed
      }
    };
  }, [cityId]);

  const sendMessage = async (content: string) => {
    if (!fluvio) return;

    try {
      const topic = `city-${cityId}-chat`;
      const producer = await fluvio.topicProducer(topic);
      
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: 'Player',
        content,
        timestamp: new Date()
      };

      await producer.send('', JSON.stringify(message));
      setMessages(prev => [...prev, message]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return {
    messages,
    sendMessage
  };
};