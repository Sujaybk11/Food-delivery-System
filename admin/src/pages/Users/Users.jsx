import React, { useState, useEffect, useContext } from 'react';
import './Users.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';

const Users = ({ url }) => {
  const { token } = useContext(StoreContext);
  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: ''
  });
  const apiUrl = "http://localhost:4000";

  const fetchUsers = async () => {
    try {
      const response = await axios.get(apiUrl + "/api/user/list", {
        headers: { token }
      });
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiUrl + "/api/user/create", newUser, {
        headers: { token }
      });
      if (response.data.success) {
        toast.success("User created successfully");
        setNewUser({ name: '', email: '', password: '' });
        setShowCreateForm(false);
        fetchUsers();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to create user");
    }
  };

  const fetchUserOrders = async (targetUserId) => {
    try {
      const response = await axios.post(apiUrl + "/api/order/user-orders", 
        { targetUserId: targetUserId }, 
        { headers: { token } }
      );
      if (response.data.success) {
        const orders = response.data.data;
        setUserOrders(orders);
        
        // Calculate pending orders count (not delivered) - check exact status values
        const pendingCount = orders.filter(order => {
          const status = order.status?.toLowerCase() || '';
          return status !== 'delivered';
        }).length;
        setPendingOrdersCount(pendingCount);
        
        console.log('All orders for user:', orders.map(o => ({id: o._id.slice(-6), status: o.status})));
        console.log('Pending orders count:', pendingCount, 'Total orders:', orders.length);
      } else {
        console.error("API Error:", response.data.message);
        setUserOrders([]);
        setPendingOrdersCount(0);
      }
    } catch (error) {
      console.error("Fetch user orders error:", error);
      toast.error("Failed to fetch user orders");
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchUserOrders(user._id);
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  useEffect(() => {
    if (selectedUser) {
      fetchUserOrders(selectedUser._id);
      
      // Auto-refresh every 5 seconds to update order counts dynamically
      const interval = setInterval(() => {
        fetchUserOrders(selectedUser._id);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  return (
    <div className="users-management">
      <div className="users-header">
        <h2>User Management</h2>
        <button 
          className="create-user-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create User'}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-user-form">
          <h3>Create New User</h3>
          <form onSubmit={createUser}>
            <input
              type="text"
              placeholder="Full Name"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              required
            />
            <button type="submit">Create User</button>
          </form>
        </div>
      )}

      <div className="users-content">
        <div className="users-list">
          <h3>All Users ({users.length})</h3>
          {users.map((user) => (
            <div 
              key={user._id} 
              className={`user-item ${selectedUser?._id === user._id ? 'selected' : ''}`}
              onClick={() => handleUserSelect(user)}
            >
              <div className="user-info">
                <h4>{user.name}</h4>
                <p>{user.email}</p>
                <span className="user-role">{user.role}</span>
              </div>
            </div>
          ))}
        </div>

        {selectedUser && (
          <div className="user-orders">
            <div className="orders-header">
              <h3>{selectedUser.name}'s Orders</h3>
              <div className="order-stats">
                <span className="total-orders">Total: {userOrders.length}</span>
                <span className="pending-orders">Pending: {pendingOrdersCount}</span>
                <span className="delivered-orders">Delivered: {userOrders.length - pendingOrdersCount}</span>
              </div>
            </div>
            {userOrders.length > 0 ? (
              userOrders.map((order) => (
                <div key={order._id} className="order-item">
                  <div className="order-header">
                    <span className="order-id">#{order._id.slice(-6)}</span>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="order-details">
                    <p className="order-items">
                      {order.items.map((item, index) => 
                        `${item.name} x${item.quantity}`
                      ).join(', ')}
                    </p>
                    <div className="order-meta">
                      <span className="order-amount">₹{order.amount}</span>
                      <span className={`order-status ${order.status.toLowerCase() === 'delivered' ? 'delivered' : 'pending'}`}>
                        {order.status.toLowerCase() === 'delivered' ? '✅ Delivered' : order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-orders">No orders found for this user</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;