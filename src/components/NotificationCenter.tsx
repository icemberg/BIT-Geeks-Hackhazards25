import React from 'react';
import { AccessTime, NotificationsActive, Update } from '@mui/icons-material';

interface Notification {
  id: string;
  type: 'policy' | 'meeting' | 'update';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

const NotificationCenter: React.FC = () => {
  const [notifications] = React.useState<Notification[]>([
    {
      id: '1',
      type: 'policy',
      title: 'New Policy Approved',
      message: 'The community has approved the new environmental policy with 85% votes in favor.',
      timestamp: '2024-04-15 18:30',
      isRead: false
    },
    {
      id: '2',
      type: 'meeting',
      title: 'Upcoming Townhall Meeting',
      message: 'Join us for the monthly townhall meeting on April 20th at 2 PM.',
      timestamp: '2024-04-14 15:45',
      isRead: false
    },
    {
      id: '3',
      type: 'update',
      title: 'Project Update',
      message: 'The urban renewal project in District 3 has reached 60% completion.',
      timestamp: '2024-04-13 09:35',
      isRead: false
    }
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'policy':
        return <NotificationsActive className="text-cyber-primary" />;
      case 'meeting':
        return <AccessTime className="text-cyber-primary" />;
      case 'update':
        return <Update className="text-cyber-primary" />;
      default:
        return <NotificationsActive className="text-cyber-primary" />;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700, fontSize: '1.3rem', color: '#00bfff', marginBottom: '1rem' }}>
          Notifications
        </h2>
        <span className="text-cyber-accent text-sm">{notifications.filter(n => !n.isRead).length} unread</span>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="comm-section-card"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 600, fontSize: '1.05rem', color: '#00bfff' }}>{notification.title}</h3>
                  <button className="comm-notify-btn">
                    Mark as read
                  </button>
                </div>
                <p className="text-cyber-blue text-sm mt-1 font-code">{notification.message}</p>
                <span className="text-cyber-secondary text-xs font-code mt-2 block">
                  {notification.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter; 