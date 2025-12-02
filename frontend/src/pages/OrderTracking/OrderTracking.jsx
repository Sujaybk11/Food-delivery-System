import React, { useState, useEffect, useContext } from 'react';
import './OrderTracking.css';
import { StoreContext } from '../../context/StoreContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderTracking = () => {
  const { orderId } = useParams();
  const { url } = useContext(StoreContext);
  const { token, ensureAuth, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [currentStatus, setCurrentStatus] = useState(2);
  const [deliveredAt, setDeliveredAt] = useState(null);
  const [orderPlacedAt, setOrderPlacedAt] = useState(null);
  const [expectedDeliveryTime, setExpectedDeliveryTime] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [showSupport, setShowSupport] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const navigate = useNavigate();

  const getStatusSteps = () => {
    const now = new Date();
    const placedTime = orderPlacedAt || now;
    
    return [
      { id: 0, title: 'Order Placed', desc: 'Your order has been received', time: placedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { id: 1, title: 'Restaurant Accepted', desc: 'Spice Garden confirmed your order', time: new Date(placedTime.getTime() + 2*60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { id: 2, title: 'Food is Being Prepared', desc: 'Your biryani is sizzling on the pan', time: new Date(placedTime.getTime() + 5*60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { id: 3, title: 'Packed & Ready', desc: 'Order packed and ready for pickup', time: '' },
      { id: 4, title: 'Rider Assigned', desc: 'Manoj is coming to pick up your order', time: '' },
      { id: 5, title: 'Out for Delivery', desc: 'On the way to your location', time: '' },
      { id: 6, title: 'Delivered', desc: 'Enjoy your meal!', time: currentStatus === 6 && deliveredAt ? deliveredAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '' }
    ];
  };

  useEffect(() => {
    if (authLoading) return;
    
    if (!ensureAuth()) {
      toast.error("Please login to view order details");
      return;
    }
    
    fetchOrderDetails();
    
    // Faster refresh for order status - every 3 seconds for active orders
    const refreshInterval = currentStatus === 6 ? 30000 : 3000; // 3s for active, 30s for delivered
    const statusRefresh = setInterval(() => {
      if (ensureAuth()) {
        fetchOrderDetails();
      }
    }, refreshInterval);
    
    let timer;
    // Only start timer if order is not delivered
    if (currentStatus < 6) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
      clearInterval(statusRefresh);
    };
  }, [currentStatus, authLoading, ensureAuth]);

  const fetchOrderDetails = async () => {
    try {
      // Get order from localStorage for demo
      const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      const foundOrder = savedOrders.find(order => order.orderId === orderId);
      
      if (!foundOrder) {
        toast.error("Order not found");
        return;
      }
      
      setOrder(foundOrder);
      
      // Set order placed time
      const placedTime = new Date(foundOrder.date);
      setOrderPlacedAt(placedTime);
      
      // Set expected delivery time (15 minutes from order placed)
      const expectedTime = new Date(placedTime.getTime() + 15*60000);
      setExpectedDeliveryTime(expectedTime);
      
      // Calculate remaining time
      const now = new Date();
      const remainingMs = expectedTime.getTime() - now.getTime();
      const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));
      setTimeLeft(remainingSeconds);
      
      // Simulate real-time status progression based on elapsed time
      const minutesElapsed = (now - placedTime) / (1000 * 60);
      
      if (minutesElapsed >= 15) {
        setCurrentStatus(6); // Delivered
        setTimeLeft(0);
        if (!deliveredAt) {
          setDeliveredAt(new Date(placedTime.getTime() + 15*60000));
        }
      } else if (minutesElapsed >= 12) {
        setCurrentStatus(5); // Out for delivery
      } else if (minutesElapsed >= 8) {
        setCurrentStatus(4); // Rider assigned
      } else if (minutesElapsed >= 5) {
        setCurrentStatus(3); // Packed & ready
      } else if (minutesElapsed >= 2) {
        setCurrentStatus(2); // Food being prepared
      } else if (minutesElapsed >= 1) {
        setCurrentStatus(1); // Restaurant accepted
      } else {
        setCurrentStatus(0); // Order placed
      }
    } catch (error) {
      console.error("Fetch order error:", error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getExpectedTime = () => {
    if (expectedDeliveryTime) {
      return expectedDeliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    const now = new Date();
    const expected = new Date(now.getTime() + timeLeft * 1000);
    return expected.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (authLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner">🔄</div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="loading">
        <div className="loading-spinner">❌</div>
        <p style={{color: 'red'}}>Please login to view order details</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="loading">
        <div className="loading-spinner">🔄</div>
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="order-tracking">
      <div className="order-header">
        <div className="order-info">
          <h2>Order #{order.orderId}</h2>
          <p className="restaurant-name">🍽️ Spice Garden</p>
          <p className="placed-time">Placed at: {orderPlacedAt ? orderPlacedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</p>
          <p className="placed-date">{orderPlacedAt ? orderPlacedAt.toLocaleDateString() : new Date().toLocaleDateString()}</p>
        </div>
        <div className="eta-info">
          {currentStatus === 6 ? (
            <div className="delivered-info">
              <h3>✅ Order Delivered!</h3>
              <p>Delivered on: {deliveredAt ? deliveredAt.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Today'}</p>
              <p>Time: {deliveredAt ? deliveredAt.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              }) : 'Just now'}</p>
            </div>
          ) : (
            <div className="arrival-time">
              <h3>Expected in ~{Math.ceil(timeLeft/60)} mins</h3>
              <p>By {getExpectedTime()}</p>
              <div className="countdown">
                <span className="timer">{timeLeft > 0 ? formatTime(timeLeft) + ' left' : 'Should arrive soon!'}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="status-timeline">
        <h3>Order Status</h3>
        <div className="timeline">
          {getStatusSteps().map((step) => (
            <div key={step.id} className={`timeline-step ${step.id <= currentStatus ? 'completed' : ''} ${step.id === currentStatus ? 'current' : ''}`}>
              <div className="step-icon">
                {step.id <= currentStatus ? '✅' : '⭕'}
              </div>
              <div className="step-content">
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
                {step.time && <span className="step-time">{step.time}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="payment-section">
        <h3>Payment (COD)</h3>
        <div className="amount-due">
          <p>Amount Due: ₹{parseFloat(order.amount).toFixed(2)}</p>
        </div>
        <div className="payment-options">
          <h4>Choose Payment Method:</h4>
          <label className={currentStatus >= 5 ? 'disabled' : ''}>
            <input 
              type="radio" 
              value="cash" 
              checked={paymentMethod === 'cash'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={currentStatus >= 5}
            />
            💵 Cash
          </label>
          <label className={currentStatus >= 5 ? 'disabled' : ''}>
            <input 
              type="radio" 
              value="upi" 
              checked={paymentMethod === 'upi'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={currentStatus >= 5}
            />
            📱 UPI (on delivery)
          </label>
          {paymentMethod === 'upi' && (
            <p className="upi-note">💡 You can pay via any UPI app when the rider arrives.</p>
          )}
        </div>
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="items-list">
          {order.items.map((item, index) => (
            <div key={index} className="order-item">
              <span className="item-name">{item.name}</span>
              <span className="item-qty">x{item.quantity}</span>
              <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="price-breakdown">
          <div className="price-row">
            <span>Subtotal:</span>
            <span>₹{(order.amount - 2).toFixed(2)}</span>
          </div>
          <div className="price-row">
            <span>Delivery:</span>
            <span>₹2.00</span>
          </div>
          <div className="price-row total">
            <span>Total:</span>
            <span>₹{parseFloat(order.amount).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="restaurant-details">
        <h3>Restaurant Details</h3>
        <div className="restaurant-info">
          <div className="restaurant-logo">🍽️</div>
          <div className="restaurant-data">
            <h4>Spice Garden</h4>
            <p>📍 123 Food Street, Bangalore</p>
            <button className="call-btn">📞 Call Restaurant</button>
          </div>
        </div>
      </div>

      {currentStatus >= 4 && (
        <div className="rider-details">
          <h3>Delivery Partner</h3>
          <div className="rider-info">
            <div className="rider-avatar">🏍️</div>
            <div className="rider-data">
              <h4>Manoj Kumar</h4>
              <p>🚗 KA-04-MH-1234</p>
              <button className="call-btn">📞 Call Rider</button>
            </div>
          </div>
        </div>
      )}

      <div className="order-actions">
        <button 
          className="action-btn cancel" 
          disabled={currentStatus > 2}
          onClick={() => {
            if (currentStatus <= 2) {
              if (window.confirm('Are you sure you want to cancel this order?')) {
                // Update order status in localStorage
                const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
                const updatedOrders = savedOrders.map(o => 
                  o.orderId === orderId ? { ...o, status: 'Cancelled' } : o
                );
                localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
                toast.success('Order cancelled successfully');
                navigate('/myorders');
              }
            }
          }}
        >
          {currentStatus <= 2 ? 'Cancel Order' : 'Cannot Cancel'}
        </button>
        <button 
          className="action-btn modify" 
          disabled={currentStatus >= 5}
          onClick={() => setShowInstructions(!showInstructions)}
        >
          Change Instructions
        </button>
        <button 
          className="action-btn support"
          onClick={() => setShowSupport(!showSupport)}
        >
          Contact Support
        </button>
        <button 
          className="action-btn report"
          onClick={() => setShowReport(!showReport)}
        >
          Report Issue
        </button>
      </div>

      {showInstructions && currentStatus < 5 && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Change Delivery Instructions</h3>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter special delivery instructions..."
              rows="4"
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
            <div className="modal-actions">
              <button 
                onClick={() => {
                  toast.success('Instructions updated successfully!');
                  setShowInstructions(false);
                }}
                style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', marginRight: '10px' }}
              >
                Save
              </button>
              <button 
                onClick={() => setShowInstructions(false)}
                style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showSupport && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Contact Support</h3>
            <div style={{ padding: '20px' }}>
              <p><strong>📞 Call:</strong> 1800-123-4567 (24/7)</p>
              <p><strong>💬 Chat:</strong> Available 9 AM - 11 PM</p>
              <p><strong>📧 Email:</strong> support@fooddelivery.com</p>
              <p><strong>Order ID:</strong> {orderId}</p>
              <div style={{ marginTop: '20px' }}>
                <button 
                  onClick={() => {
                    toast.success('Connecting to support chat...');
                    setShowSupport(false);
                  }}
                  style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', marginRight: '10px' }}
                >
                  Start Chat
                </button>
                <button 
                  onClick={() => {
                    window.open('tel:18001234567');
                    setShowSupport(false);
                  }}
                  style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', marginRight: '10px' }}
                >
                  Call Now
                </button>
              </div>
            </div>
            <button 
              onClick={() => setShowSupport(false)}
              style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', marginTop: '10px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showReport && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Report Issue</h3>
            <div style={{ padding: '20px' }}>
              <p>What issue are you facing?</p>
              <div style={{ marginBottom: '15px' }}>
                {['Wrong items delivered', 'Food quality issue', 'Delivery delay', 'Missing items', 'Payment issue', 'Other'].map(issue => (
                  <button
                    key={issue}
                    onClick={() => {
                      toast.success(`Issue reported: ${issue}. Support will contact you soon.`);
                      setShowReport(false);
                    }}
                    style={{ 
                      display: 'block', 
                      width: '100%', 
                      padding: '10px', 
                      margin: '5px 0', 
                      backgroundColor: '#f8f9fa', 
                      border: '1px solid #ddd', 
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {issue}
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setShowReport(false)}
              style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {currentStatus === 6 && (
        <div className="delivery-complete">
          <div className="completion-banner">
            <h2>🎉 Order Delivered!</h2>
            <p>Paid via {paymentMethod === 'cash' ? 'Cash' : 'UPI'}</p>
          </div>
          <div className="post-delivery-actions">
            <button className="action-btn">📄 Download Invoice</button>
            <button className="action-btn">⭐ Rate Order</button>
            <button className="action-btn">⭐ Rate Delivery Partner</button>
            <button className="action-btn reorder">🔄 Reorder</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;