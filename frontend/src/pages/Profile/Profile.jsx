import React, { useState, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';

const Profile = () => {
  const { token } = useContext(StoreContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [userInfo] = useState({ name: 'User', email: 'user@example.com' });

  return (
    <div style={{ padding: '20px', minHeight: '70vh' }}>
      <h2>My Profile</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ width: '200px' }}>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{ 
              width: '100%', padding: '10px', marginBottom: '10px',
              backgroundColor: activeTab === 'profile' ? '#007bff' : 'white',
              color: activeTab === 'profile' ? 'white' : 'black',
              border: '1px solid #ddd', borderRadius: '4px'
            }}
          >
            Profile Info
          </button>
          <button 
            onClick={() => setActiveTab('addresses')}
            style={{ 
              width: '100%', padding: '10px',
              backgroundColor: activeTab === 'addresses' ? '#007bff' : 'white',
              color: activeTab === 'addresses' ? 'white' : 'black',
              border: '1px solid #ddd', borderRadius: '4px'
            }}
          >
            Addresses
          </button>
        </div>

        <div style={{ flex: 1 }}>
          {activeTab === 'profile' && (
            <div>
              <h3>Profile Information</h3>
              <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                <p><strong>Name:</strong> {userInfo.name}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Member Since:</strong> {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <h3>Delivery Addresses</h3>
              <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                <p>Manage your delivery addresses here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;