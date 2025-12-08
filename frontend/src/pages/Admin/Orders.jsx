import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/order/list', {
        headers: { token }
      });
      
      if (response.data.success) {
        setOrders(response.data.data);
        toast.success(`Loaded ${response.data.data.length} orders`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error("Failed to fetch orders");
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.post('http://localhost:4000/api/order/status', 
        { orderId, status },
        { headers: { token } }
      );
      
      if (response.data.success) {
        setOrders(prev => prev.map(order => 
          (order._id || order.id) === orderId ? { ...order, status } : order
        ));
        toast.success(`Order status updated to ${status}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>All Orders ({orders.length})</h2>
        <button 
          onClick={fetchOrders} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Refresh Orders'}
        </button>
      </div>
      
      {loading && orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          No orders found
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {orders.map((order, index) => {
            const orderId = order._id || order.id;
            return (
              <div key={orderId} style={{ 
                border: '2px solid #ddd', 
                padding: '20px', 
                borderRadius: '10px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                      Order #{index + 1} - ID: {orderId.slice(-8)}
                    </h3>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                      <strong>Date:</strong> {new Date(order.createdAt || order.date).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <select 
                      value={order.status || 'Food Processing'} 
                      onChange={(e) => updateOrderStatus(orderId, e.target.value)}
                      style={{ 
                        padding: '8px 12px', 
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Food Processing">Food Processing</option>
                      <option value="Out for delivery">Out for delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                    <strong style={{ color: '#007bff' }}>Customer Details</strong>
                    <p style={{ margin: '5px 0' }}>{order.address?.firstName} {order.address?.lastName}</p>
                    <p style={{ margin: '5px 0', fontSize: '13px' }}>{order.address?.email}</p>
                    <p style={{ margin: '5px 0', fontSize: '13px' }}>{order.address?.phone}</p>
                  </div>

                  <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                    <strong style={{ color: '#007bff' }}>Delivery Address</strong>
                    <p style={{ margin: '5px 0', fontSize: '13px' }}>{order.address?.street}</p>
                    <p style={{ margin: '5px 0', fontSize: '13px' }}>
                      {order.address?.city}, {order.address?.state} {order.address?.zipcode}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '13px' }}>{order.address?.country}</p>
                  </div>

                  <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                    <strong style={{ color: '#007bff' }}>Payment Info</strong>
                    <p style={{ margin: '5px 0' }}>
                      <strong>Amount:</strong> ₹{order.amount}
                    </p>
                    <p style={{ margin: '5px 0' }}>
                      <strong>Method:</strong> {order.paymentMethod || 'COD'}
                    </p>
                    <p style={{ margin: '5px 0' }}>
                      <strong>Status:</strong> {order.payment ? '✅ Paid' : '⏳ Pending'}
                    </p>
                  </div>
                </div>

                <div style={{ 
                  padding: '15px', 
                  backgroundColor: '#fff3cd', 
                  borderRadius: '5px',
                  border: '1px solid #ffc107'
                }}>
                  <strong style={{ color: '#856404' }}>Order Items ({order.items?.length || 0})</strong>
                  <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} style={{ 
                        padding: '8px 12px', 
                        backgroundColor: 'white', 
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        fontSize: '13px'
                      }}>
                        <strong>{item.name}</strong> x {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
