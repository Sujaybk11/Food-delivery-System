import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const LiveTracking = () => {
  const { orderId } = useParams();
  const [orderStatus, setOrderStatus] = useState({
    status: 'Preparing',
    estimatedTime: 30,
    deliveryBoy: { name: 'John Doe', phone: '+91 9876543210', vehicleNumber: 'MH01AB1234' }
  });

  const statusSteps = [
    { key: 'Preparing', label: 'Order Confirmed', icon: '✅' },
    { key: 'Cooking', label: 'Preparing Food', icon: '👨🍳' },
    { key: 'Ready', label: 'Food Ready', icon: '🍽️' },
    { key: 'Picked up', label: 'Picked Up', icon: '🏍️' },
    { key: 'On the way', label: 'On the Way', icon: '🚚' },
    { key: 'Delivered', label: 'Delivered', icon: '🎉' }
  ];

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === orderStatus.status);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', minHeight: '70vh' }}>
      <h2>Track Your Order</h2>
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <p><strong>Order ID:</strong> #{orderId?.slice(-6)}</p>
        <p><strong>Estimated Time:</strong> {orderStatus.estimatedTime} minutes</p>
        <p><strong>Delivery Partner:</strong> {orderStatus.deliveryBoy.name}</p>
      </div>

      <div style={{ position: 'relative' }}>
        {statusSteps.map((step, index) => {
          const currentIndex = getCurrentStepIndex();
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step.key} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '20px',
              position: 'relative'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: isCompleted ? '#28a745' : '#e9ecef',
                color: isCompleted ? 'white' : '#6c757d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                marginRight: '15px',
                border: isCurrent ? '3px solid #007bff' : 'none'
              }}>
                {isCompleted ? '✓' : step.icon}
              </div>
              
              <div>
                <h4 style={{ 
                  margin: '0 0 5px 0', 
                  color: isCompleted ? '#28a745' : '#6c757d' 
                }}>
                  {step.label}
                </h4>
                {isCurrent && (
                  <p style={{ margin: 0, fontSize: '14px', color: '#007bff' }}>
                    In Progress...
                  </p>
                )}
              </div>
              
              {index < statusSteps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '19px',
                  top: '40px',
                  width: '2px',
                  height: '20px',
                  backgroundColor: index < currentIndex ? '#28a745' : '#e9ecef'
                }} />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ 
        backgroundColor: '#e3f2fd', 
        padding: '15px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h4>Delivery Partner Details</h4>
        <p><strong>Name:</strong> {orderStatus.deliveryBoy.name}</p>
        <p><strong>Phone:</strong> {orderStatus.deliveryBoy.phone}</p>
        <p><strong>Vehicle:</strong> {orderStatus.deliveryBoy.vehicleNumber}</p>
        <button style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Call Delivery Partner
        </button>
      </div>
    </div>
  );
};

export default LiveTracking;