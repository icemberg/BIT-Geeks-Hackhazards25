import React, { useState, useEffect, useRef } from 'react';
import { Send } from '@mui/icons-material';
// @ts-ignore
import  Fluvio,{ PartitionConsumer } from '@fluvio/client';
import { pipe } from '@screenpipe/browser';

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

interface TownhallChatProps {
  noBrackets?: boolean;
  orbitronFont?: boolean;
  playerId?: string;
}

const GAME_KEYWORDS = [
  'game', 'quest', 'mission', 'city', 'score', 'level', 'player', 'team', 'governance', 'crisis', 'dashboard', 'vote', 'build', 'resource', 'strategy', 'move', 'turn', 'win', 'lose', 'play', 'objective', 'challenge', 'event', 'action', 'collaborate', 'ally', 'opponent', 'round', 'progress', 'upgrade', 'reward', 'achievement', 'leaderboard', 'competition', 'scenario', 'simulation', 'urban', 'district', 'civic', 'onboarding', 'proposal', 'construction', 'infrastructure', 'environment', 'policy', 'community', 'discussion', 'notification', 'townhall', 'chat'
];

const TownhallChat: React.FC<TownhallChatProps> = ({ noBrackets = false, orbitronFont = false, playerId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [warning, setWarning] = useState<string | null>(null);
  const fluvioRef = useRef<any>(null);
  const consumerRef = useRef<any>(null);
  const topic = 'townhall-chat';
  const senderId = playerId || 'Player-' + Math.random().toString(36).substr(2, 6);

  useEffect(() => {
    let isMounted = true;
    async function connectFluvio() {
      try {
        const fluvio = await Fluvio.connect();
        fluvioRef.current = fluvio;
        const consumer = await fluvio.partitionConsumer(topic, 0);
        consumerRef.current = consumer;
        // @ts-ignore
        consumer.stream("beginning", async (record: any) => {
          const msg = JSON.parse(record.valueString());
          if (isMounted) setMessages((prev) => [...prev, msg]);
        });
      } catch (err) {
        // Optionally handle Fluvio connection errors
      }
    }
    connectFluvio();
    return () => {
      isMounted = false;
      consumerRef.current?.close?.();
      fluvioRef.current?.close?.();
    };
  }, []);

  async function sendMessageToFluvio(content: string) {
    if (!fluvioRef.current) return;
    const producer = await fluvioRef.current.topicProducer(topic);
    const msg = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      sender: senderId,
      content,
      timestamp: new Date().toLocaleTimeString(),
    };
    await producer.send('', JSON.stringify(msg));
  }

  // Advanced moderation: only allow messages about the game
  function isGameRelated(content: string) {
    const lower = content.toLowerCase();
    return GAME_KEYWORDS.some(keyword => lower.includes(keyword));
  }

  async function moderateWithScreenpipe(content: string) {
    // 1. Advanced moderation: must be game-related
    if (!isGameRelated(content)) {
      setWarning('Your message must be about the game. Please stay on topic!');
      return false;
    }
    try {
      const results = await pipe.queryScreenpipe({
        q: content,
        contentType: "all",
        limit: 1,
        startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        endTime: new Date().toISOString()
      });
      // Example: If Screenpipe returns a flag or moderation failure, block the message
      if (results && results.data && results.data.length > 0) {
        // You can add more advanced moderation logic here
        return true; // Allow
      }
      // If no data, allow by default (or block if you want strict moderation)
      return true;
    } catch (error) {
      setWarning('Screenpipe moderation failed. Please try again.');
      return false;
    }
  }

  // AI Analysis/Enhancement: Use Screenpipe to analyze and show context/summary
  async function analyzeWithScreenpipe(content: string) {
    try {
      const results = await pipe.queryScreenpipe({
        q: content,
        contentType: "all",
        limit: 3,
        startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        endTime: new Date().toISOString()
      });
      if (results && results.data && results.data.length > 0) {
        const context = results.data.map((item: any) => {
          if (item.type === "OCR") return item.content.text;
          if (item.type === "Audio") return item.content.transcription;
          if (item.type === "UI") return item.content.text;
          return "";
        }).filter(Boolean).join("\n");
        if (context) {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              sender: 'AI',
              content: `AI Context: ${context}`,
              timestamp: new Date().toLocaleTimeString(),
            }
          ]);
        }
      }
    } catch (error) {
      // Optionally handle AI analysis errors
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setWarning(null);
    if (newMessage.trim()) {
      // Screenpipe moderation before sending
      const allowed = await moderateWithScreenpipe(newMessage);
      if (!allowed) return;
      await sendMessageToFluvio(newMessage);
      // AI analysis/enhancement after sending
      await analyzeWithScreenpipe(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div>
      <h2
        className={orbitronFont ? 'comm-orbitron' : 'cyber-title flex items-center'}
        style={{ fontFamily: orbitronFont ? 'Orbitron, sans-serif' : undefined, fontWeight: 700, fontSize: '1.3rem', color: '#00bfff', marginBottom: '1rem' }}
      >
        {!noBrackets && <span className="mr-2"></span>}
        Townhall Chat
        {!noBrackets && <span className="ml-2"></span>}
      </h2>

      {warning && (
        <div style={{ color: '#ff3366', fontFamily: 'Orbitron, sans-serif', marginBottom: '0.5rem', fontWeight: 600 }}>
          {warning}
        </div>
      )}

      {/* Chat Messages */}
      <div className="h-[300px] overflow-y-auto mb-4 space-y-4 p-4 cyber-border bg-cyber-darker rounded">
        {messages.map((message) => (
          <div
            key={message.id}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <span className="text-cyber-primary font-cyber text-sm">{message.sender}</span>
              <span className="text-cyber-secondary text-xs font-code">{message.timestamp}</span>
            </div>
            <div className="cyber-border p-2 rounded bg-cyber-darker">
              <p className="text-cyber-blue font-code text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-cyber-secondary font-code text-sm">No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter your message..."
          className="comm-cyber-input"
        />
        <button
          type="submit"
          className="comm-cyber-btn"
          disabled={!newMessage.trim()}
        >
          <Send />
        </button>
      </form>
    </div>
  );
};

export default TownhallChat; 