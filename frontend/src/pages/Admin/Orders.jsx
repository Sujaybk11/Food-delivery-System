import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
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
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
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
          order._id === orderId ? { ...order, status } : order
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
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Food Processing': return '#ffc107';
      case 'Out for delivery': return '#007bff';
      case 'Delivered': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Order Management ({filteredOrders.length})</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="all">All Orders</option>
            <option value="Food Processing">Food Processing</option>
            <option value="Out for delivery">Out for delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button 
            onClick={fetchOrders} 
            disabled={loading}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading orders...</div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {filteredOrders.map(order => (
            <div key={order._id} style={{ 
              border: '1px solid #ddd', 
              padding: '20px', 
              borderRadius: '8px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0 }}>Order #{order._id.slice(-6)}</h4>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '12px',
                      backgroundColor: getStatusColor(order.status),
                      color: 'white'
                    }}>
                      {order.status}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    <div>
                      <strong>Customer:</strong><br/>
                      {order.address?.firstName} {order.address?.lastName}<br/>
                      <small>{order.address?.email}</small>
                    </div>
                    <div>
                      <strong>Address:</strong><br/>
                      {order.address?.street}<br/>
                      {order.address?.city}, {order.address?.zipcode}
                    </div>
                    <div>
                      <strong>Order Details:</strong><br/>
                      Items: {order.items?.length || 0}<br/>
                      Total: ₹{parseFloat(order.amount).toFixed(2)}
                    </div>
                    <div>
                      <strong>Order Time:</strong><br/>
                      {new Date(order.date).toLocaleString()}<br/>
                      <small>ID: {order.orderId}</small>
                    </div>
                  </div>
                </div>
                <div style={{ minWidth: '150px' }}>
                  <select 
                    value={order.status} 
                    onChange={(e) => {
                      console.log('Updating order:', order._id, 'to status:', e.target.value);
                      updateOrderStatus(order._id, e.target.value);
                    }}
                    style={{ 
                      width: '100%',
                      padding: '8px', 
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  >
                    <option value="Food Processing">Food Processing</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              
              {order.items && order.items.length > 0 && (
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                  <strong>Items:</strong>
                  <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {order.items.map((item, index) => (
                      <span key={index} style={{ 
                        padding: '4px 8px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {filteredOrders.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          {filter === 'all' ? 'No orders found' : `No orders with status "${filter}"`}
        </div>
      )}
    </div>
  );
};

export default Orders;