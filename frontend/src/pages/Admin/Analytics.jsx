import React, { useState, useEffect } from "react";
import axios from "axios";

const Analytics = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalFoodItems: 0
  });
  const token = localStorage.getItem('token');

  const fetchStats = async () => {
    try {
      // Get real data from localStorage
      const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Calculate stats from real data
      const totalOrders = savedOrders.length;
      const totalRevenue = savedOrders.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0);
      const totalUsers = savedUsers.length + 1; // +1 for current user
      const totalFoodItems = 20; // From mock food data
      
      setStats({
        totalOrders,
        totalRevenue,
        totalUsers,
        totalFoodItems
      });
    } catch (error) {
      console.error("Failed to fetch analytics");
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Analytics Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div style={{ 
          backgroundColor: '#007bff', 
          color: 'white', 
          padding: '30px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <h3>{stats.totalOrders}</h3>
          <p>Total Orders</p>
        </div>
        <div style={{ 
          backgroundColor: '#28a745', 
          color: 'white', 
          padding: '30px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <h3>₹{stats.totalRevenue.toFixed(2)}</h3>
          <p>Total Revenue</p>
        </div>
        <div style={{ 
          backgroundColor: '#ffc107', 
          color: 'white', 
          padding: '30px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <h3>{stats.totalUsers}</h3>
          <p>Total Users</p>
        </div>
        <div style={{ 
          backgroundColor: '#dc3545', 
          color: 'white', 
          padding: '30px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <h3>{stats.totalFoodItems}</h3>
          <p>Food Items</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;