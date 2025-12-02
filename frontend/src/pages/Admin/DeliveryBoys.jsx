import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DeliveryBoys = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', vehicleType: 'bike', vehicleNumber: ''
  });
  const token = localStorage.getItem('token');

  const mockDeliveryBoys = [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      vehicleType: 'bike',
      vehicleNumber: 'MH01AB1234',
      isOnline: true,
      isAvailable: true,
      totalDeliveries: 150,
      rating: 4.5,
      earnings: 15000
    },
    {
      _id: '2',
      name: 'Mike Smith',
      email: 'mike@example.com',
      phone: '+91 9876543211',
      vehicleType: 'bicycle',
      vehicleNumber: 'MH01CD5678',
      isOnline: false,
      isAvailable: false,
      totalDeliveries: 89,
      rating: 4.2,
      earnings: 8900
    }
  ];

  useEffect(() => {
    setDeliveryBoys(mockDeliveryBoys);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success("Delivery boy added successfully");
    setShowForm(false);
    setFormData({ name: '', email: '', phone: '', vehicleType: 'bike', vehicleNumber: '' });
  };

  const toggleStatus = (id, field) => {
    setDeliveryBoys(prev => prev.map(boy => 
      boy._id === id ? { ...boy, [field]: !boy[field] } : boy
    ));
    toast.success("Status updated");
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Delivery Partners ({deliveryBoys.length})</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {showForm ? 'Cancel' : 'Add Delivery Boy'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <select
              value={formData.vehicleType}
              onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="bike">Bike</option>
              <option value="bicycle">Bicycle</option>
              <option value="car">Car</option>
            </select>
            <input
              type="text"
              placeholder="Vehicle Number"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <button type="submit" style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
            Add Delivery Partner
          </button>
        </form>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Contact</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Vehicle</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Stats</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryBoys.map(boy => (
              <tr key={boy._id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <div>
                    <strong>{boy.name}</strong>
                    <div style={{ fontSize: '12px', color: '#666' }}>{boy.email}</div>
                  </div>
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{boy.phone}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {boy.vehicleType} - {boy.vehicleNumber}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      fontSize: '12px',
                      backgroundColor: boy.isOnline ? '#28a745' : '#dc3545',
                      color: 'white'
                    }}>
                      {boy.isOnline ? 'Online' : 'Offline'}
                    </span>
                    <span style={{ 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      fontSize: '12px',
                      backgroundColor: boy.isAvailable ? '#007bff' : '#ffc107',
                      color: 'white'
                    }}>
                      {boy.isAvailable ? 'Available' : 'Busy'}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <div style={{ fontSize: '12px' }}>
                    <div>Deliveries: {boy.totalDeliveries}</div>
                    <div>Rating: ⭐ {boy.rating}</div>
                    <div>Earnings: ₹{boy.earnings}</div>
                  </div>
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button
                      onClick={() => toggleStatus(boy._id, 'isOnline')}
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        backgroundColor: boy.isOnline ? '#dc3545' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {boy.isOnline ? 'Set Offline' : 'Set Online'}
                    </button>
                    <button
                      onClick={() => toggleStatus(boy._id, 'isAvailable')}
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        backgroundColor: boy.isAvailable ? '#ffc107' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {boy.isAvailable ? 'Set Busy' : 'Set Available'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryBoys;