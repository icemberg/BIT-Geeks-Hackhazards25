import { useState, useCallback, useEffect } from 'react';
import { pipe } from '@screenpipe/browser';

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

export const useScreenpipe = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const sendMessage = useCallback(async (content: string) => {
    try {
      // Add user message to state
      const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      content,
      timestamp: new Date()
    };

      setMessages(prev => [...prev, userMessage]);

      // Query Screenpipe for relevant context
      const results = await pipe.queryScreenpipe({
        q: content,
        contentType: "all",
        limit: 5,
        startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // Last hour
        endTime: new Date().toISOString()
      });

      if (!results?.data) {
        throw new Error('No results returned from Screenpipe');
      }

      // Process the results to generate a response
      const context = results.data.map(item => {
        if (item.type === "OCR") {
          return item.content.text;
        } else if (item.type === "Audio") {
          return item.content.transcription;
        } else if (item.type === "UI") {
          return item.content.text;
        }
        return "";
      }).filter(Boolean).join("\n");

      // Add AI response to state
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'Citizen',
        content: context ? `Based on recent activity: ${context}` : "No relevant activity found",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error querying Screenpipe:', error);
    }
  }, []);

  return {
    messages,
    sendMessage
  };
}; 