import React, { useState } from 'react';
import './AdminLogin.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/frontend_assets/assets';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ setShowAdminLogin, url }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post(`${url}/api/admin/login`, data);
      
      if (response.data.success && response.data.isAdmin) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("admin", "true");
        toast.success("Admin login successful!");
        setShowAdminLogin(false);
        navigate('/admin');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className='admin-login-popup'>
      <form onSubmit={onLogin} className="admin-login-popup-container">
        <div className="admin-login-popup-title">
          <h2>Admin Login</h2>
          <img onClick={() => setShowAdminLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="admin-login-popup-inputs">
          <input 
            name='email' 
            onChange={onChangeHandler} 
            value={data.email} 
            type="email" 
            placeholder='Admin Email' 
            required 
          />
          <input 
            name='password' 
            onChange={onChangeHandler} 
            value={data.password} 
            type="password" 
            placeholder='Password' 
            required 
          />
        </div>
        <button type="submit">Login as Admin</button>
        

        

      </form>
    </div>
  );
};

export default AdminLogin;