import React, { useState } from 'react';

const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders] = useState([
    { id: '001', customer: 'John Doe', items: 'Pasta, Salad', total: 350, status: 'New', time: '2 mins ago' },
    { id: '002', customer: 'Jane Smith', items: 'Pizza, Coke', total: 450, status: 'Preparing', time: '5 mins ago' }
  ]);

  return (
    <div style={{ padding: '20px', minHeight: '80vh' }}>
      <h2>Restaurant Dashboard</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ width: '200px' }}>
          {['orders', 'menu', 'analytics', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '8px',
                backgroundColor: activeTab === tab ? '#007bff' : 'white',
                color: activeTab === tab ? 'white' : 'black',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          {activeTab === 'orders' && (
            <div>
              <h3>Live Orders</h3>
              {orders.map(order => (
                <div key={order.id} style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4>Order #{order.id}</h4>
                      <p>Customer: {order.customer}</p>
                      <p>Items: {order.items}</p>
                      <p>Total: ₹{order.total}</p>
                      <small>{order.time}</small>
                    </div>
                    <select style={{ padding: '8px', borderRadius: '4px' }}>
                      <option value="New">New</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h3>Analytics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div style={{ padding: '20px', backgroundColor: '#007bff', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
                  <h4>Today's Orders</h4>
                  <h2>24</h2>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#28a745', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
                  <h4>Revenue</h4>
                  <h2>₹8,450</h2>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;