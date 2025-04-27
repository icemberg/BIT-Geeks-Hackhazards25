import React from 'react';
import { useNavigate } from 'react-router-dom';
import TownhallChat from './TownhallChat';
import CommunityDiscussionBoard from './CommunityDiscussionBoard';
import NotificationCenter from './NotificationCenter';
import '../styles/communication-dashboard.css';

const CommunicationDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="comm-grid-bg comm-orbitron" style={{ minHeight: '100vh', padding: '2rem', background: 'rgba(0,0,0,0.85)' }}>
      <div className="comm-glitch-header" data-text="Communication & Collaboration Dashboard">
        Communication & Collaboration Dashboard
      </div>
      <div className="comm-main-layout" style={{ gridTemplateColumns: '1.5fr 1fr', width: '100vw', maxWidth: '100vw', margin: 0, gap: '1rem' }}>
        {/* Left: Townhall Chat */}
        <div className="comm-chat-col" style={{ maxWidth: '650px', minWidth: '350px', width: '100%' }}>
          <div className="comm-cyber-card comm-scrollbar" style={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 0 24px #00ffff55', animation: 'fadeIn 1.2s', minWidth: 0 }}>
            <TownhallChat noBrackets orbitronFont />
          </div>
        </div>
        {/* Right: Community Board & Notifications */}
        <div className="comm-side-col" style={{ minWidth: 0, width: '100%' }}>
          <div className="comm-cyber-card comm-scrollbar" style={{ animation: 'slideUp 1.2s', boxShadow: '0 0 18px #00ffff33', minWidth: 0 }}>
            <CommunityDiscussionBoard />
          </div>
          <div className="comm-cyber-card comm-scrollbar" style={{ animation: 'slideUp 1.5s', boxShadow: '0 0 18px #00ffff33', minWidth: 0 }}>
            <NotificationCenter />
          </div>
        </div>
      </div>
      <div className="dashboard-header">
        <h1>Communication & Collaboration Hub</h1>
        <div className="header-actions">
          <button 
            className="rewards-button"
            onClick={() => navigate('/rewards')}
          >
            View Rewards
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunicationDashboard; 