import React from "react";
import "./Orders.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Orders = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  const fetchAllOrder = async () => {
    const apiUrl = "http://localhost:4000";
    const response = await axios.get(apiUrl + "/api/order/list", {
      headers: { token },
    });
    if (response.data.success) {
      setOrders(response.data.data);
    }
  };

  const statusHandler = async (event, orderId) => {
    const apiUrl = "http://localhost:4000";
    const newStatus = event.target.value;
    
    const requestData = {
      orderId,
      status: newStatus,
    };
    
    // Add delivery timestamp if marking as delivered
    if (newStatus === "Delivered") {
      requestData.deliveredAt = new Date().toISOString();
    }
    
    const response = await axios.post(
      apiUrl + "/api/order/status",
      requestData,
      { headers: { token } }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      await fetchAllOrder();
    } else {
      toast.error(response.data.message);
    }
  };
  useEffect(() => {
    if (!admin && !token) {
      toast.error("Please Login First");
      navigate("/");
    }
    fetchAllOrder();
    
    // Auto-refresh every 10 seconds to see cancelled orders
    const interval = setInterval(() => {
      fetchAllOrder();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className={`order-item ${order.status === 'Cancelled' ? 'cancelled-order-item' : ''}`}>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <div className="order-header">
                <p className="order-id">Order ID: #{order._id.slice(-6)}</p>
                <p className="order-time">{new Date(order.createdAt || order.date).toLocaleString()}</p>
              </div>
              <p className="order-item-food">
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p className="order-item-name">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city +
                    ", " +
                    order.address.state +
                    ", " +
                    order.address.country +
                    ", " +
                    order.address.zipcode}
                </p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>₹{order.amount}</p>
            {order.status === 'Cancelled' ? (
              <div className="cancelled-order">
                <span className="cancelled-badge">❌ Cancelled by User</span>
                <p className="cancelled-time">
                  {order.cancelledAt ? new Date(order.cancelledAt).toLocaleString() : 'Recently cancelled'}
                </p>
              </div>
            ) : (
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
