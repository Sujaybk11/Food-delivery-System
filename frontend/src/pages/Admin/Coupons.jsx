import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    discountType: 'percentage',
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: '',
    expiryDate: ''
  });
  const token = localStorage.getItem('token');

  const fetchCoupons = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/coupon/list', {
        headers: { token }
      });
      if (response.data.success) {
        setCoupons(response.data.coupons);
      }
    } catch (error) {
      toast.error("Failed to fetch coupons");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/coupon/create', formData, {
        headers: { token }
      });
      if (response.data.success) {
        toast.success("Coupon created successfully");
        setShowForm(false);
        setFormData({
          code: '', discount: '', discountType: 'percentage',
          minOrderAmount: '', maxDiscount: '', usageLimit: '', expiryDate: ''
        });
        fetchCoupons();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to create coupon");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Coupon Management</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {showForm ? 'Cancel' : 'Add Coupon'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <input
              type="text"
              placeholder="Coupon Code"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <input
              type="number"
              placeholder="Discount Value"
              value={formData.discount}
              onChange={(e) => setFormData({...formData, discount: e.target.value})}
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <select
              value={formData.discountType}
              onChange={(e) => setFormData({...formData, discountType: e.target.value})}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
            <input
              type="number"
              placeholder="Min Order Amount"
              value={formData.minOrderAmount}
              onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value})}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <button type="submit" style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
            Create Coupon
          </button>
        </form>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Code</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Discount</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Type</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Min Order</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Used</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => (
              <tr key={coupon._id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{coupon.code}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {coupon.discountType === 'percentage' ? `${coupon.discount}%` : `₹${coupon.discount}`}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{coupon.discountType}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>₹{coupon.minOrderAmount}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{coupon.usedCount}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: coupon.isActive ? '#28a745' : '#dc3545',
                    color: 'white',
                    fontSize: '12px'
                  }}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Coupons;