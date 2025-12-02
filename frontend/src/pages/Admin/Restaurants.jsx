import React, { useState } from "react";
import { toast } from "react-toastify";

const Restaurants = () => {
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [restaurants, setRestaurants] = useState([
    {
      _id: '1',
      name: 'Dragon Palace',
      email: 'dragon@example.com',
      phone: '+91 9876543210',
      address: 'MG Road, Bangalore',
      cuisine: ['Chinese'],
      status: 'Active',
      rating: 4.2,
      totalOrders: 150,
      revenue: 45000
    },
    {
      _id: '2',
      name: 'Golden Wok',
      email: 'golden@example.com',
      phone: '+91 9876543211',
      address: 'Brigade Road, Bangalore',
      cuisine: ['Thai'],
      status: 'Active',
      rating: 4.5,
      totalOrders: 200,
      revenue: 60000
    },
    {
      _id: '3',
      name: 'Spice Garden',
      email: 'spice@example.com',
      phone: '+91 9876543212',
      address: 'Koramangala, Bangalore',
      cuisine: ['Indian'],
      status: 'Active',
      rating: 4.3,
      totalOrders: 180,
      revenue: 52000
    },
    {
      _id: '4',
      name: 'Pizza Corner',
      email: 'pizza@example.com',
      phone: '+91 9876543213',
      address: 'Indiranagar, Bangalore',
      cuisine: ['Italian'],
      status: 'Active',
      rating: 4.1,
      totalOrders: 120,
      revenue: 38000
    }
  ]);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Restaurant Management</h2>
        <button style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}>
          Add Restaurant
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Restaurant</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Contact</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Performance</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map(restaurant => (
              <tr key={restaurant._id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <div>
                    {editingId === restaurant._id ? (
                      <input
                        value={restaurant.name}
                        onChange={(e) => {
                          setRestaurants(prev => prev.map(r => 
                            r._id === restaurant._id ? { ...r, name: e.target.value } : r
                          ));
                        }}
                        style={{ width: '100%', padding: '4px', marginBottom: '4px' }}
                      />
                    ) : (
                      <strong>{restaurant.name}</strong>
                    )}
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {editingId === restaurant._id ? (
                        <input
                          value={restaurant.address}
                          onChange={(e) => {
                            setRestaurants(prev => prev.map(r => 
                              r._id === restaurant._id ? { ...r, address: e.target.value } : r
                            ));
                          }}
                          style={{ width: '100%', padding: '2px' }}
                        />
                      ) : (
                        restaurant.address
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{restaurant.cuisine.join(', ')}</div>
                  </div>
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <div style={{ fontSize: '14px' }}>
                    <div>
                      {editingId === restaurant._id ? (
                        <input
                          value={restaurant.email}
                          onChange={(e) => {
                            setRestaurants(prev => prev.map(r => 
                              r._id === restaurant._id ? { ...r, email: e.target.value } : r
                            ));
                          }}
                          style={{ width: '100%', padding: '2px', marginBottom: '4px' }}
                        />
                      ) : (
                        restaurant.email
                      )}
                    </div>
                    <div>
                      {editingId === restaurant._id ? (
                        <input
                          value={restaurant.phone}
                          onChange={(e) => {
                            setRestaurants(prev => prev.map(r => 
                              r._id === restaurant._id ? { ...r, phone: e.target.value } : r
                            ));
                          }}
                          style={{ width: '100%', padding: '2px' }}
                        />
                      ) : (
                        restaurant.phone
                      )}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <div style={{ fontSize: '12px' }}>
                    <div>Rating: ⭐ {restaurant.rating}</div>
                    <div>Orders: {restaurant.totalOrders}</div>
                    <div>Revenue: ₹{restaurant.revenue.toLocaleString()}</div>
                  </div>
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <button
                    onClick={() => {
                      const newStatus = restaurant.status === 'Active' ? 'Inactive' : 'Active';
                      setRestaurants(prev => prev.map(r => 
                        r._id === restaurant._id 
                          ? { ...r, status: newStatus }
                          : r
                      ));
                      toast.success(`Restaurant ${newStatus.toLowerCase()}!`);
                    }}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: restaurant.status === 'Active' ? '#28a745' : '#dc3545',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {restaurant.status}
                  </button>
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => setViewingId(viewingId === restaurant._id ? null : restaurant._id)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {viewingId === restaurant._id ? 'Hide' : 'View'}
                    </button>
                    <button 
                      onClick={() => {
                        if (editingId === restaurant._id) {
                          toast.success('Restaurant updated successfully!');
                        }
                        setEditingId(editingId === restaurant._id ? null : restaurant._id);
                      }}
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        backgroundColor: '#ffc107',
                        color: 'black',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {editingId === restaurant._id ? 'Save' : 'Edit'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewingId && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3>Restaurant Details</h3>
          {(() => {
            const restaurant = restaurants.find(r => r._id === viewingId);
            return restaurant ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <h4>{restaurant.name}</h4>
                  <p><strong>Address:</strong> {restaurant.address}</p>
                  <p><strong>Cuisine:</strong> {restaurant.cuisine.join(', ')}</p>
                  <p><strong>Status:</strong> {restaurant.status}</p>
                </div>
                <div>
                  <p><strong>Email:</strong> {restaurant.email}</p>
                  <p><strong>Phone:</strong> {restaurant.phone}</p>
                  <p><strong>Rating:</strong> ⭐ {restaurant.rating}</p>
                  <p><strong>Total Orders:</strong> {restaurant.totalOrders}</p>
                  <p><strong>Revenue:</strong> ₹{restaurant.revenue.toLocaleString()}</p>
                </div>
              </div>
            ) : null;
          })()} 
        </div>
      )}
    </div>
  );
};

export default Restaurants;