import React, { useState } from 'react';
import './AdminQuickLogin.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminQuickLogin = ({ setShowAdminQuick }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:4000/api/admin/login', credentials);
      
      if (response.data.success && response.data.isAdmin) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('admin', 'true');
        toast.success('Admin login successful!');
        setShowAdminQuick(false);
        navigate('/admin');
      } else {
        toast.error('Invalid admin credentials');
      }
    } catch (error) {
      toast.error('Login failed');
    }
  };

  return (
    <div className="admin-quick-overlay">
      <div className="admin-quick-popup">
        <div className="admin-quick-header">
          <h3>Quick Admin Login</h3>
          <button onClick={() => setShowAdminQuick(false)} className="close-btn">×</button>
        </div>
        <form onSubmit={handleLogin}>
          <div className="admin-login-inputs">
            <input
              name="email"
              onChange={onChangeHandler}
              value={credentials.email}
              type="email"
              placeholder="Admin Email"
              required
            />
            <input
              name="password"
              onChange={onChangeHandler}
              value={credentials.password}
              type="password"
              placeholder="Admin Password"
              required
            />
          </div>

          <button type="submit" className="quick-login-btn">
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminQuickLogin;