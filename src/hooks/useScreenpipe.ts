import { useState, useCallback } from 'react';

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

// Mock implementation to replace @screenpipe/browser
const mockScreenpipe = {
  queryScreenpipe: async ({ q }: { q: string }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate mock responses based on the query
    const mockResponses = [
      "Citizens are discussing infrastructure improvements in the downtown area.",
      "Recent community feedback suggests increasing support for environmental initiatives.",
      "Economic reports indicate positive growth in the tech sector.",
      "Social surveys show strong community engagement in local governance.",
      "Environmental monitoring data reveals improving air quality metrics."
    ];
    
    // Return a random subset of responses
    const shuffled = [...mockResponses].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.floor(Math.random() * 3) + 1);
    
    return {
      data: selected.map(text => ({
        type: "UI",
        content: { 
          text,
          transcription: text // Add transcription for Audio type compatibility
        }
      }))
    };
  }
};

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

      // Query mock Screenpipe for relevant context
      const results = await mockScreenpipe.queryScreenpipe({
        q: content
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