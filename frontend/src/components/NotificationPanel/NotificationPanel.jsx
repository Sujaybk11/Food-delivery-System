import React, { useState } from 'react';

const NotificationPanel = ({ isOpen, onClose }) => {
  const [notifications] = useState([
    {
      id: 1,
      title: 'Order Confirmed',
      message: 'Your order #12345 has been confirmed',
      type: 'order',
      time: '2 mins ago',
      isRead: false
    },
    {
      id: 2,
      title: 'Special Offer',
      message: 'Get 20% off on your next order',
      type: 'promotion',
      time: '1 hour ago',
      isRead: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '60px',
      right: '20px',
      width: '350px',
      maxHeight: '500px',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000
    }}>
      <div style={{
        padding: '15px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <h4 style={{ margin: 0 }}>
          Notifications {unreadCount > 0 && (
            <span style={{
              backgroundColor: '#dc3545',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '12px',
              marginLeft: '8px'
            }}>
              {unreadCount}
            </span>
          )}
        </h4>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>×</button>
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {notifications.map(notification => (
          <div key={notification.id} style={{
            padding: '15px',
            borderBottom: '1px solid #eee',
            backgroundColor: notification.isRead ? 'white' : '#f0f8ff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '16px' }}>
                {notification.type === 'order' ? '📦' : '🎉'}
              </span>
              <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
                {notification.title}
              </h5>
            </div>
            <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
              {notification.message}
            </p>
            <span style={{ fontSize: '12px', color: '#999' }}>
              {notification.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;