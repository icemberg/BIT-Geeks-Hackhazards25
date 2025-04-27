import React, { useState } from 'react';
import { CalendarMonth, ChatBubbleOutline } from '@mui/icons-material';

interface Discussion {
  id: string;
  title: string;
  date: string;
  summary: string;
  participants: number;
}

const CommunityDiscussionBoard: React.FC = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: '1',
      title: 'Urban Renewal Project Discussion',
      date: '2024-04-20 14:00',
      summary: 'Discussion about the proposed urban renewal project in District 3',
      participants: 45,
    },
    {
      id: '2',
      title: 'Environmental Policy Review',
      date: '2024-04-22 15:30',
      summary: 'Review of current environmental policies and proposed changes',
      participants: 32,
    },
  ]);

  const [newTopic, setNewTopic] = useState('');

  const handleSubmitTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTopic.trim()) {
      const discussion: Discussion = {
        id: Date.now().toString(),
        title: newTopic,
        date: new Date().toLocaleString(),
        summary: 'New discussion topic',
        participants: 0,
      };
      setDiscussions([discussion, ...discussions]);
      setNewTopic('');
    }
  };

  return (
    <div>
      <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700, fontSize: '1.3rem', color: '#00bfff', marginBottom: '1rem' }}>
        Community Discussion Board
      </h2>
      
      <form onSubmit={handleSubmitTopic} className="mb-4">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="topic" style={{ color: '#00ffff', fontFamily: 'Orbitron, sans-serif', fontSize: '0.95rem' }}>
            Submit a New Discussion Topic
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              id="topic"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Enter your discussion topic..."
              className="comm-cyber-input"
              style={{ maxWidth: '260px', minWidth: '0', flex: 1 }}
            />
            <button
              type="submit"
              className="comm-cyber-btn"
              disabled={!newTopic.trim()}
              style={{ minWidth: '110px', fontSize: '1rem', padding: '0.6rem 1.2rem' }}
            >
              Initialize
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {discussions.map((discussion) => (
          <div 
            key={discussion.id} 
            className="comm-section-card"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 600, fontSize: '1.05rem', color: '#00bfff' }}>{discussion.title}</h3>
              <div className="flex items-center space-x-2 text-xs text-cyber-secondary font-code">
                <CalendarMonth fontSize="small" />
                <span>{discussion.date}</span>
              </div>
            </div>
            <p className="text-cyber-blue text-sm mb-2 font-code">{discussion.summary}</p>
            <div className="flex items-center space-x-2 text-xs text-cyber-secondary font-code">
              <ChatBubbleOutline fontSize="small" />
              <span>{discussion.participants} participants</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityDiscussionBoard; 