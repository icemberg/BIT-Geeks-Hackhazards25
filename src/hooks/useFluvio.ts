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
  const [fluvioClient, setFluvioClient] = useState<any>(null);
  const [producer, setProducer] = useState<any>(null);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    let active = true;
    let consumer: any = null;

    const initializeFluvio = async () => {
      try {
        const client = await Fluvio.connect();
        if (!active) return;
        setFluvioClient(client);
        
        const topic = `city-${cityId}-chat`;
        const prod = await client.topicProducer(topic);
        if (!active) return;
        setProducer(prod);

        consumer = await client.partitionConsumer(topic, 0);
        if (!active) return;
        
        // Use beginning offset
        const offset = { index: 0 };
        consumer.stream(offset, (record: any) => {
          try {
            const message = JSON.parse(record.value_string());
            setMessages(prev => [...prev, message]);
          } catch (e) {
            console.error('Error parsing Fluvio message', e);
          }
        });
        setIsMock(false);
      } catch (error) {
        console.error('Failed to initialize Fluvio. Using Mock Fallback:', error);
        if (!active) return;
        setIsMock(true);
        // Fallback mock logic for sendMessage to still update the UI
      }
    };

    initializeFluvio();

    return () => {
      active = false;
      if (consumer && consumer.stream_end) {
        consumer.stream_end().catch(console.error);
      }
    };
  }, [cityId]);

  const sendMessage = async (content: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'Player',
      content,
      timestamp: new Date()
    };

    if (isMock || !producer) {
      // Mock Implementation
      console.log('[MOCK FLUVIO] Sending message:', message);
      setMessages(prev => [...prev, message]);
      return;
    }

    try {
      await producer.send('', JSON.stringify(message));
      // In a real stream, the consumer would pick this up and append it, 
      // but we optimistically append it here as well for immediate feedback, 
      // or we can rely solely on the consumer. We'll rely on the consumer if it's not a mock.
      // Actually, since streaming happens, if we append here we get duplicates if the stream works.
      // But if we want optimistic updates, we append and ensure unique IDs in render.
      setMessages(prev => {
        if (!prev.find(m => m.id === message.id)) {
          return [...prev, message];
        }
        return prev;
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      // Fallback to updating UI anyway if send fails
      setMessages(prev => [...prev, message]);
    }
  };

  return {
    messages,
    sendMessage
  };
};