import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyOrders = () => {
  const { url } = useContext(StoreContext);
  const { token, ensureAuth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ type: '', data: [] });
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      // Load orders from localStorage for demo
      const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      
      // Simulate order status progression
      const updatedOrders = savedOrders.map(order => {
        const orderTime = new Date(order.date);
        const now = new Date();
        const minutesElapsed = (now - orderTime) / (1000 * 60);
        
        if (minutesElapsed > 15) {
          return { ...order, status: 'Delivered' };
        } else if (minutesElapsed > 10) {
          return { ...order, status: 'Out for delivery' };
        } else if (minutesElapsed > 5) {
          return { ...order, status: 'Food Processing' };
        }
        return { ...order, status: 'Order Placed' };
      });
      
      setOrders(updatedOrders.reverse()); // Latest first
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);
  
  // Timer state for countdown
  const [timers, setTimers] = useState({});
  
  // Separate effect for timer updates
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimers(prev => {
        const newTimers = { ...prev };
        orders.forEach(order => {
          if (order.status !== 'Delivered' && order.status !== 'Cancelled' && canCancelOrder(order.date)) {
            newTimers[order._id] = getTimeLeft(order.date);
          }
        });
        return newTimers;
      });
    }, 1000);
    
    return () => clearInterval(timerInterval);
  }, [orders]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#4CAF50';
      case 'Out for delivery': return '#FF9800';
      case 'Food Processing': return '#2196F3';
      case 'Cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canCancelOrder = (orderDate) => {
    const orderTime = new Date(orderDate);
    const now = new Date();
    const timeDiff = (now - orderTime) / 1000; // in seconds
    return timeDiff <= 120; // 2 minutes = 120 seconds
  };

  const getTimeLeft = (orderDate) => {
    const orderTime = new Date(orderDate);
    const now = new Date();
    const timeDiff = (now - orderTime) / 1000;
    const timeLeft = Math.max(0, 120 - timeDiff);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = Math.floor(timeLeft % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const cancelOrder = async (orderId) => {
    try {
      setCancellingOrder(orderId);
      const response = await axios.post(
        url + "/api/order/cancel",
        { orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully");
        fetchOrders(); // Refresh orders
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to cancel order");
    } finally {
      setCancellingOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="my-orders-loading">
        <div className="loading-spinner">🔄</div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      
      {/* User Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div 
          onClick={() => {
            console.log('Total Orders clicked');
            setModalData({ type: 'All Orders', data: orders });
            setShowModal(true);
          }}
          style={{ 
            backgroundColor: '#007bff', 
            color: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            userSelect: 'none'
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', pointerEvents: 'none' }}>{orders.length}</h3>
          <p style={{ margin: '0 0 5px 0', pointerEvents: 'none' }}>My Total Orders</p>
          <small style={{ pointerEvents: 'none' }}>Click to view details</small>
        </div>
        <div 
          onClick={() => {
            console.log('Total Spent clicked');
            setModalData({ type: 'Spending Breakdown', data: orders });
            setShowModal(true);
          }}
          style={{ 
            backgroundColor: '#28a745', 
            color: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            userSelect: 'none'
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', pointerEvents: 'none' }}>₹{orders.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0).toFixed(2)}</h3>
          <p style={{ margin: '0 0 5px 0', pointerEvents: 'none' }}>My Total Spent</p>
          <small style={{ pointerEvents: 'none' }}>Click to view breakdown</small>
        </div>
        <div 
          onClick={() => {
            console.log('Delivered Orders clicked');
            const deliveredOrders = orders.filter(order => order.status === 'Delivered');
            setModalData({ type: 'Delivered Orders', data: deliveredOrders });
            setShowModal(true);
          }}
          style={{ 
            backgroundColor: '#ffc107', 
            color: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            userSelect: 'none'
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', pointerEvents: 'none' }}>{orders.filter(order => order.status === 'Delivered').length}</h3>
          <p style={{ margin: '0 0 5px 0', pointerEvents: 'none' }}>Delivered Orders</p>
          <small style={{ pointerEvents: 'none' }}>Click to view list</small>
        </div>
        <div 
          onClick={() => {
            console.log('Active Orders clicked');
            const activeOrders = orders.filter(order => order.status !== 'Delivered' && order.status !== 'Cancelled');
            setModalData({ type: 'Active Orders', data: activeOrders });
            setShowModal(true);
          }}
          style={{ 
            backgroundColor: '#dc3545', 
            color: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            userSelect: 'none'
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', pointerEvents: 'none' }}>{orders.filter(order => order.status !== 'Delivered' && order.status !== 'Cancelled').length}</h3>
          <p style={{ margin: '0 0 5px 0', pointerEvents: 'none' }}>Active Orders</p>
          <small style={{ pointerEvents: 'none' }}>Click to view details</small>
        </div>
      </div>
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>📦 No orders found</p>
          <button onClick={() => navigate('/')} className="order-now-btn">
            Order Now
          </button>
        </div>
      ) : (
        <div>
          <h3 style={{ marginBottom: '20px' }}>Order History</h3>
          <div className="orders-list">
            {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.orderId}</h3>
                  <p className="order-date">{formatDate(order.date)}</p>
                </div>
                <div className="order-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status === 'Delivered' ? '✅ Delivered' : order.status}
                  </span>
                  <p className="order-total">₹{parseFloat(order.amount).toFixed(2)}</p>
                </div>
              </div>
              
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">x{item.quantity}</span>
                    <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="order-actions">
                <button 
                  onClick={() => navigate(`/order-tracking/${order.orderId}`)}
                  className="track-btn"
                >
                  Track Order
                </button>
                {order.status !== 'Delivered' && order.status !== 'Cancelled' && canCancelOrder(order.date) && (
                  <div className="cancel-section">
                    <span className="cancel-timer">Cancel in: {timers[order._id] || getTimeLeft(order.date)}</span>
                    <button 
                      onClick={() => cancelOrder(order._id)}
                      className="cancel-btn"
                      disabled={cancellingOrder === order._id}
                    >
                      {cancellingOrder === order._id ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  </div>
                )}
                {order.status !== 'Delivered' && order.status !== 'Cancelled' && !canCancelOrder(order.date) && (
                  <button className="cancel-btn disabled" disabled>
                    Cannot Cancel
                  </button>
                )}
                {order.status === 'Delivered' && (
                  <button className="reorder-btn">
                    Reorder
                  </button>
                )}
                {order.status === 'Cancelled' && (
                  <span className="cancelled-status">❌ Cancelled</span>
                )}
              </div>
            </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for detailed information */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>{modalData.type}</h3>
              <button 
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            
            {modalData.type === 'Spending Breakdown' ? (
              <div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Total Spent: ₹{modalData.data.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0).toFixed(2)}</strong>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Average Order Value: ₹{modalData.data.length > 0 ? (modalData.data.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0) / modalData.data.length).toFixed(2) : '0.00'}</strong>
                </div>
                <h4>Order-wise Breakdown:</h4>
                {modalData.data.map((order, index) => (
                  <div key={index} style={{ 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px', 
                    marginBottom: '8px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>Order #{order.orderId}</span>
                    <span>₹{parseFloat(order.amount).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {modalData.data.length === 0 ? (
                  <p>No orders found in this category.</p>
                ) : (
                  modalData.data.map((order, index) => (
                    <div key={index} style={{ 
                      padding: '15px', 
                      border: '1px solid #ddd', 
                      borderRadius: '8px', 
                      marginBottom: '10px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <strong>Order #{order.orderId}</strong>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          backgroundColor: order.status === 'Delivered' ? '#28a745' : order.status === 'Cancelled' ? '#dc3545' : '#ffc107',
                          color: 'white'
                        }}>
                          {order.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        <div>Amount: ₹{parseFloat(order.amount).toFixed(2)}</div>
                        <div>Date: {new Date(order.date).toLocaleDateString()}</div>
                        <div>Items: {order.items?.length || 0}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;