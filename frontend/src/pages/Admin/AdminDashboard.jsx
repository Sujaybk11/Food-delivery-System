import React, { useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import Add from "./Add";
import Orders from "./Orders";
import Users from "./Users";
import Analytics from "./Analytics";
import Coupons from "./Coupons";
import FoodList from "./FoodList";
import DeliveryBoys from "./DeliveryBoys";
import Restaurants from "./Restaurants";

const AdminDashboard = () => {
  const { token } = useContext(StoreContext);
  const [activeTab, setActiveTab] = useState("analytics");
  const isAdmin = localStorage.getItem('admin') === 'true';
  const storedToken = localStorage.getItem('token');

  if (!token && !storedToken) {
    return <div>Please login as admin first</div>;
  }

  if (!isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '80vh' }}>
      <div style={{ width: '200px', backgroundColor: '#f8f9fa', padding: '20px' }}>
        <h3>Admin Panel</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            onClick={() => setActiveTab("analytics")}
            style={{ 
              padding: '10px', 
              backgroundColor: activeTab === "analytics" ? '#007bff' : 'white',
              color: activeTab === "analytics" ? 'white' : 'black',
              border: '1px solid #ddd',
              cursor: 'pointer'
            }}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            style={{ 
              padding: '10px', 
              backgroundColor: activeTab === "orders" ? '#007bff' : 'white',
              color: activeTab === "orders" ? 'white' : 'black',
              border: '1px solid #ddd',
              cursor: 'pointer'
            }}
          >
            Orders
          </button>
          <button 
            onClick={() => setActiveTab("add")}
            style={{ 
              padding: '10px', 
              backgroundColor: activeTab === "add" ? '#007bff' : 'white',
              color: activeTab === "add" ? 'white' : 'black',
              border: '1px solid #ddd',
              cursor: 'pointer'
            }}
          >
            Add Food
          </button>
          <button 
            onClick={() => setActiveTab("foodlist")}
            style={{ 
              padding: '10px', 
              backgroundColor: activeTab === "foodlist" ? '#007bff' : 'white',
              color: activeTab === "foodlist" ? 'white' : 'black',
              border: '1px solid #ddd',
              cursor: 'pointer'
            }}
          >
            Manage Items
          </button>
          <button 
            onClick={() => setActiveTab("users")}
            style={{ 
              padding: '10px', 
              backgroundColor: activeTab === "users" ? '#007bff' : 'white',
              color: activeTab === "users" ? 'white' : 'black',
              border: '1px solid #ddd',
              cursor: 'pointer'
            }}
          >
            Users
          </button>
          <button 
            onClick={() => setActiveTab("coupons")}
            style={{ 
              padding: '10px', 
              backgroundColor: activeTab === "coupons" ? '#007bff' : 'white',
              color: activeTab === "coupons" ? 'white' : 'black',
              border: '1px solid #ddd',
              cursor: 'pointer'
            }}
          >
            Coupons
          </button>
          <button 
            onClick={() => setActiveTab("delivery")}
            style={{ 
              padding: '10px', 
              backgroundColor: activeTab === "delivery" ? '#007bff' : 'white',
              color: activeTab === "delivery" ? 'white' : 'black',
              border: '1px solid #ddd',
              cursor: 'pointer'
            }}
          >
            Delivery Boys
          </button>
          <button 
            onClick={() => setActiveTab("restaurants")}
            style={{ 
              padding: '10px', 
              backgroundColor: activeTab === "restaurants" ? '#007bff' : 'white',
              color: activeTab === "restaurants" ? 'white' : 'black',
              border: '1px solid #ddd',
              cursor: 'pointer'
            }}
          >
            Restaurants
          </button>
        </div>
      </div>
      
      <div style={{ flex: 1, padding: '20px' }}>
        {activeTab === "analytics" && <Analytics />}
        {activeTab === "orders" && <Orders />}
        {activeTab === "add" && <Add />}
        {activeTab === "users" && <Users />}
        {activeTab === "coupons" && <Coupons />}
        {activeTab === "foodlist" && <FoodList />}
        {activeTab === "delivery" && <DeliveryBoys />}
        {activeTab === "restaurants" && <Restaurants />}
      </div>
    </div>
  );
};

export default AdminDashboard;