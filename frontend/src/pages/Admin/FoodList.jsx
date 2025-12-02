import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState('all');
  const token = localStorage.getItem('token');

  const mockFoods = [
    { _id: '1', name: 'Kung Pao Chicken', category: 'Chicken', price: 16.99, originalPrice: 16.99, discount: 0, quantity: 50, lowStockThreshold: 10, isAvailable: true, outOfStock: false, image: 'food_1.png', description: 'Spicy chicken with peanuts and vegetables', restaurant: "Dragon Palace" },
    { _id: '2', name: 'Sweet & Sour Pork', category: 'Pork', price: 18.99, originalPrice: 18.99, discount: 0, quantity: 30, lowStockThreshold: 10, isAvailable: true, outOfStock: false, image: 'food_2.png', description: 'Crispy pork in tangy sweet and sour sauce', restaurant: "Dragon Palace" },
    { _id: '3', name: 'Beef Black Bean', category: 'Beef', price: 19.99, originalPrice: 19.99, discount: 0, quantity: 25, lowStockThreshold: 10, isAvailable: true, outOfStock: false, image: 'food_3.png', description: 'Tender beef in savory black bean sauce', restaurant: "Dragon Palace" },
    { _id: '4', name: 'Vegetable Spring Rolls', category: 'Veg', price: 8.99, originalPrice: 8.99, discount: 0, quantity: 40, lowStockThreshold: 10, isAvailable: true, outOfStock: false, image: 'food_4.png', description: 'Crispy vegetable spring rolls with dipping sauce', restaurant: "Dragon Palace" },
    { _id: '5', name: 'Hot & Sour Soup', category: 'Soup', price: 7.99, originalPrice: 7.99, discount: 0, quantity: 35, lowStockThreshold: 10, isAvailable: true, outOfStock: false, image: 'food_5.png', description: 'Traditional spicy and tangy soup', restaurant: "Dragon Palace" },
    { _id: '6', name: 'Pad Thai Noodles', category: 'Noodles', price: 14.99, originalPrice: 14.99, discount: 0, quantity: 35, lowStockThreshold: 10, isAvailable: true, outOfStock: false, image: 'food_6.png', description: 'Thai stir-fried noodles with tamarind sauce', restaurant: "Golden Wok" },
    { _id: '7', name: 'Green Curry Chicken', category: 'Chicken', price: 17.99, originalPrice: 17.99, discount: 0, quantity: 30, lowStockThreshold: 10, isAvailable: true, outOfStock: false, image: 'food_7.png', description: 'Thai green curry with coconut milk', restaurant: "Golden Wok" },
    { _id: '8', name: 'Tom Yum Soup', category: 'Soup', price: 9.99, originalPrice: 9.99, discount: 0, quantity: 40, lowStockThreshold: 10, isAvailable: true, outOfStock: false, image: 'food_8.png', description: 'Spicy Thai soup with lemongrass', restaurant: "Golden Wok" },
    { _id: '9', name: 'Vegetable Pad See Ew', category: 'Veg', price: 13.99, originalPrice: 13.99, discount: 0, quantity: 25, lowStockThreshold: 10, isAvailable: true, outOfStock: false, image: 'food_9.png', description: 'Wide rice noodles with vegetables', restaurant: "Golden Wok" },
    { _id: '10', name: 'Mango Sticky Rice', category: 'Dessert', price: 8.99, originalPrice: 8.99, discount: 0, quantity: 20, lowStockThreshold: 10, isAvailable: true, outOfStock: false, image: 'food_10.png', description: 'Sweet sticky rice with fresh mango', restaurant: "Golden Wok" },
    { _id: '11', name: 'Butter Chicken', category: 'Chicken', price: 18.99, originalPrice: 18.99, discount: 0, quantity: 45, lowStockThreshold: 10, isAvailable: true, outOfStock: false, image: 'food_11.png', description: 'Creamy tomato curry with tender chicken', restaurant: "Spice Garden" },
    { _id: '12', name: 'Palak Paneer', category: 'Veg', price: 15.99, originalPrice: 15.99, discount: 0, quantity: 30, lowStockThreshold: 10, isAvailable: true, outOfStock: false, image: 'food_12.png', description: 'Cottage cheese in creamy spinach curry', restaurant: "Spice Garden" },
    { _id: '13', name: 'Lamb Biryani', category: 'Lamb', price: 22.99, originalPrice: 22.99, discount: 0, quantity: 15, lowStockThreshold: 10, isAvailable: true, outOfStock: false, image: 'food_13.png', description: 'Aromatic basmati rice with spiced lamb', restaurant: "Spice Garden" },
    { _id: '14', name: 'Tandoori Chicken', category: 'Chicken', price: 19.99, originalPrice: 19.99, discount: 0, quantity: 25, lowStockThreshold: 10, isAvailable: true, outOfStock: false, image: 'food_14.png', description: 'Clay oven roasted chicken with spices', restaurant: "Spice Garden" },
    { _id: '15', name: 'Gulab Jamun', category: 'Dessert', price: 6.99, originalPrice: 6.99, discount: 0, quantity: 50, lowStockThreshold: 10, isAvailable: true, outOfStock: false, image: 'food_15.png', description: 'Sweet milk dumplings in rose syrup', restaurant: "Spice Garden" },
    { _id: '16', name: 'Margherita Pizza', category: 'Veg', price: 16.99, originalPrice: 16.99, discount: 0, quantity: 25, lowStockThreshold: 10, isAvailable: true, outOfStock: false, image: 'food_16.png', description: 'Fresh tomatoes, mozzarella, and basil', restaurant: "Pizza Corner" },
    { _id: '17', name: 'Pepperoni Pizza', category: 'Meat', price: 19.99, originalPrice: 19.99, discount: 0, quantity: 30, lowStockThreshold: 10, isAvailable: true, outOfStock: false, image: 'food_17.png', description: 'Classic pepperoni with mozzarella cheese', restaurant: "Pizza Corner" },
    { _id: '18', name: 'Chicken Alfredo Pasta', category: 'Chicken', price: 17.99, originalPrice: 17.99, discount: 0, quantity: 20, lowStockThreshold: 10, isAvailable: true, outOfStock: false, image: 'food_18.png', description: 'Creamy alfredo sauce with grilled chicken', restaurant: "Pizza Corner" },
    { _id: '19', name: 'Caesar Salad', category: 'Veg', price: 12.99, originalPrice: 12.99, discount: 0, quantity: 35, lowStockThreshold: 10, isAvailable: true, outOfStock: false, image: 'food_19.png', description: 'Crisp romaine with parmesan and croutons', restaurant: "Pizza Corner" },
    { _id: '20', name: 'Tiramisu', category: 'Dessert', price: 7.99, originalPrice: 7.99, discount: 0, quantity: 15, lowStockThreshold: 10, isAvailable: true, outOfStock: false, image: 'food_20.png', description: 'Classic Italian coffee-flavored dessert', restaurant: "Pizza Corner" }
  ];

  const fetchFoods = async () => {
    setLoading(true);
    try {
      // Using mock data instead of API call
      console.log('Loading foods:', mockFoods.length, 'items');
      console.log('Restaurants:', [...new Set(mockFoods.map(f => f.restaurant))]);
      setFoods([...mockFoods]);
    } catch (error) {
      toast.error("Failed to fetch food items");
    }
    setLoading(false);
  };

  const removeFood = async (id) => {
    try {
      const response = await axios.post('http://localhost:4000/api/food/remove', { id }, {
        headers: { token }
      });
      if (response.data.success) {
        toast.success("Food item removed");
        fetchFoods();
      }
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      const response = await axios.post('http://localhost:4000/api/food/toggle-availability', {
        id,
        isAvailable: !currentStatus
      }, {
        headers: { token }
      });
      if (response.data.success) {
        toast.success(`Item ${!currentStatus ? 'enabled' : 'disabled'}`);
        fetchFoods();
      }
    } catch (error) {
      toast.error("Failed to update availability");
    }
  };

  const updateStock = async (id, quantity, outOfStock) => {
    try {
      const response = await axios.post('http://localhost:4000/api/food/update-stock', {
        id,
        quantity,
        outOfStock
      }, {
        headers: { token }
      });
      if (response.data.success) {
        toast.success("Stock updated");
        fetchFoods();
      }
    } catch (error) {
      toast.error("Failed to update stock");
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const getRestaurantStats = () => {
    const stats = {};
    foods.forEach(food => {
      if (!stats[food.restaurant]) {
        stats[food.restaurant] = { total: 0, available: 0, outOfStock: 0 };
      }
      stats[food.restaurant].total++;
      if (food.isAvailable) stats[food.restaurant].available++;
      if (food.outOfStock) stats[food.restaurant].outOfStock++;
    });
    return stats;
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Food Items Management</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select 
            value={selectedRestaurant} 
            onChange={(e) => setSelectedRestaurant(e.target.value)}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="all">All Restaurants</option>
            <option value="Dragon Palace">Dragon Palace</option>
            <option value="Golden Wok">Golden Wok</option>
            <option value="Spice Garden">Spice Garden</option>
            <option value="Pizza Corner">Pizza Corner</option>
          </select>
          <button onClick={fetchFoods} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            Refresh
          </button>
        </div>
      </div>

      {/* Restaurant Summary */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '10px' }}>Restaurant Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {Object.entries(getRestaurantStats()).map(([restaurant, stats]) => (
            <div key={restaurant} style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ddd' }}>
              <strong>{restaurant}</strong>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Total: {stats.total} | Available: {stats.available} | Out of Stock: {stats.outOfStock}
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
      ) : (
        <div>
          <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
            Showing {foods.length} items from {Object.keys(getRestaurantStats()).length} restaurants
          </div>
          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Image</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Restaurant</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Price & Discount</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Stock</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.filter(food => selectedRestaurant === 'all' || food.restaurant === selectedRestaurant).map(food => (
                <tr key={food._id}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={food.image.startsWith('data:') ? food.image : `http://localhost:4000/images/${food.image}`} 
                        alt={food.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setFoods(prev => prev.map(f => 
                                f._id === food._id 
                                  ? { ...f, image: event.target.result }
                                  : f
                              ));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '50px',
                          height: '50px',
                          opacity: 0,
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    <div>
                      <strong>{food.name}</strong>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        {food.description?.substring(0, 50)}...
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{food.restaurant}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{food.category}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '12px' }}>₹</span>
                        <input
                          type="number"
                          value={food.originalPrice || food.price}
                          onChange={(e) => {
                            const newOriginalPrice = parseFloat(e.target.value) || 0;
                            const discountedPrice = newOriginalPrice * (1 - (food.discount || 0) / 100);
                            setFoods(prev => prev.map(f => 
                              f._id === food._id 
                                ? { ...f, originalPrice: newOriginalPrice, price: discountedPrice }
                                : f
                            ));
                          }}
                          style={{ width: '60px', padding: '2px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '12px' }}
                          min="0"
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                          type="number"
                          value={food.discount || 0}
                          onChange={(e) => {
                            const newDiscount = parseFloat(e.target.value) || 0;
                            const discountedPrice = (food.originalPrice || food.price) * (1 - newDiscount / 100);
                            setFoods(prev => prev.map(f => 
                              f._id === food._id 
                                ? { ...f, discount: newDiscount, price: discountedPrice }
                                : f
                            ));
                          }}
                          style={{ width: '40px', padding: '2px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '12px' }}
                          min="0"
                          max="100"
                        />
                        <span style={{ fontSize: '12px' }}>%</span>
                      </div>
                      {food.discount > 0 && (
                        <div style={{ fontSize: '11px', color: '#28a745' }}>
                          Final: ₹{Math.round(food.price)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="number"
                        value={food.quantity || 0}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 0;
                          setFoods(prev => prev.map(f => 
                            f._id === food._id 
                              ? { ...f, quantity: newQuantity, outOfStock: newQuantity === 0 }
                              : f
                          ));
                        }}
                        style={{ width: '60px', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                        min="0"
                      />
                      <span style={{ 
                        fontSize: '12px', 
                        color: food.quantity <= (food.lowStockThreshold || 10) ? '#dc3545' : '#28a745' 
                      }}>
                        {food.quantity <= (food.lowStockThreshold || 10) ? 'Low' : 'OK'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        fontSize: '12px',
                        backgroundColor: food.isAvailable ? '#28a745' : '#dc3545',
                        color: 'white'
                      }}>
                        {food.isAvailable ? 'Available' : 'Disabled'}
                      </span>
                      {food.outOfStock && (
                        <span style={{ 
                          padding: '2px 6px', 
                          borderRadius: '4px', 
                          fontSize: '12px',
                          backgroundColor: '#ffc107',
                          color: 'black'
                        }}>
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <button
                        onClick={() => {
                          setFoods(prev => prev.map(f => 
                            f._id === food._id 
                              ? { ...f, isAvailable: !f.isAvailable }
                              : f
                          ));
                        }}
                        style={{
                          padding: '4px 8px',
                          fontSize: '12px',
                          backgroundColor: food.isAvailable ? '#ffc107' : '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {food.isAvailable ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => {
                          setFoods(prev => prev.map(f => 
                            f._id === food._id 
                              ? { ...f, outOfStock: !f.outOfStock }
                              : f
                          ));
                        }}
                        style={{
                          padding: '4px 8px',
                          fontSize: '12px',
                          backgroundColor: food.outOfStock ? '#28a745' : '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {food.outOfStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                      <button
                        onClick={() => {
                          setFoods(prev => prev.filter(f => f._id !== food._id));
                        }}
                        style={{
                          padding: '4px 8px',
                          fontSize: '12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {foods.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          No food items found. Add some items to get started.
        </div>
      )}
    </div>
  );
};

export default FoodList;