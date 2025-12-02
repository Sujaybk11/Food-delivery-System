import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurantMenu, setRestaurantMenu] = useState([]);
  const [filters, setFilters] = useState({
    cuisine: 'all',
    rating: 0,
    distance: 10
  });
  const navigate = useNavigate();
  const { addToCart } = useContext(StoreContext);

  const mockRestaurants = [
    {
      _id: '1',
      name: 'Dragon Palace',
      cuisine: ['Chinese'],
      rating: 4.2,
      preparationTime: 25,
      deliveryFee: 30,
      minimumOrder: 150,
      isOpen: true
    },
    {
      _id: '2', 
      name: 'Golden Wok',
      cuisine: ['Chinese'],
      rating: 4.5,
      preparationTime: 35,
      deliveryFee: 25,
      minimumOrder: 200,
      isOpen: true
    }
  ];

  const restaurantMenus = {
    '1': [
      { _id: 'm1', name: 'Chicken Fried Rice', price: 180, description: 'Wok-tossed rice with chicken and vegetables', image: 'food_1.png', category: 'Chinese' },
      { _id: 'm2', name: 'Veg Hakka Noodles', price: 160, description: 'Stir-fried noodles with fresh vegetables', image: 'food_2.png', category: 'Chinese' },
      { _id: 'm3', name: 'Chicken Manchurian', price: 220, description: 'Crispy chicken in tangy Manchurian sauce', image: 'food_3.png', category: 'Chinese' },
      { _id: 'm4', name: 'Sweet & Sour Pork', price: 240, description: 'Tender pork in sweet and sour sauce', image: 'food_4.png', category: 'Chinese' },
      { _id: 'm5', name: 'Veg Spring Rolls', price: 120, description: 'Crispy rolls filled with fresh vegetables', image: 'food_5.png', category: 'Chinese' },
      { _id: 'm6', name: 'Chicken Chow Mein', price: 200, description: 'Stir-fried noodles with chicken and bean sprouts', image: 'food_6.png', category: 'Chinese' },
      { _id: 'm7', name: 'Honey Chilli Potato', price: 140, description: 'Crispy potato tossed in honey chilli sauce', image: 'food_7.png', category: 'Chinese' },
      { _id: 'm8', name: 'Chicken Hot & Sour Soup', price: 100, description: 'Spicy and tangy soup with chicken', image: 'food_8.png', category: 'Chinese' },
      { _id: 'm9', name: 'Prawn Fried Rice', price: 250, description: 'Aromatic rice with fresh prawns', image: 'food_9.png', category: 'Chinese' },
      { _id: 'm10', name: 'Szechuan Chicken', price: 230, description: 'Spicy Szechuan style chicken', image: 'food_10.png', category: 'Chinese' }
    ],
    '2': [
      { _id: 'm11', name: 'Beef Black Bean', price: 280, description: 'Tender beef in black bean sauce', image: 'food_11.png', category: 'Chinese' },
      { _id: 'm12', name: 'Veg Manchow Soup', price: 80, description: 'Spicy vegetable soup with crispy noodles', image: 'food_12.png', category: 'Chinese' },
      { _id: 'm13', name: 'Fish in Chilli Garlic', price: 320, description: 'Fresh fish in spicy chilli garlic sauce', image: 'food_13.png', category: 'Chinese' },
      { _id: 'm14', name: 'Chicken Lollipop', price: 180, description: 'Crispy chicken drumettes', image: 'food_14.png', category: 'Chinese' },
      { _id: 'm15', name: 'Veg Schezwan Rice', price: 170, description: 'Spicy Schezwan flavored rice', image: 'food_15.png', category: 'Chinese' },
      { _id: 'm16', name: 'Chicken Corn Soup', price: 90, description: 'Creamy soup with chicken and corn', image: 'food_16.png', category: 'Chinese' },
      { _id: 'm17', name: 'Paneer Chilli Dry', price: 200, description: 'Spicy dry paneer with bell peppers', image: 'food_17.png', category: 'Chinese' },
      { _id: 'm18', name: 'Chicken Satay', price: 220, description: 'Grilled chicken skewers with peanut sauce', image: 'food_18.png', category: 'Chinese' },
      { _id: 'm19', name: 'Veg Burnt Garlic Rice', price: 160, description: 'Aromatic rice with burnt garlic flavor', image: 'food_19.png', category: 'Chinese' },
      { _id: 'm20', name: 'Chicken Kung Pao', price: 240, description: 'Diced chicken with peanuts and chili', image: 'food_20.png', category: 'Chinese' }
    ]
  };

  useEffect(() => {
    setRestaurants(mockRestaurants);
  }, []);

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setRestaurantMenu(restaurantMenus[restaurant._id] || []);
  };

  const handleAddToCart = (item) => {
    addToCart(item._id);
    toast.success(`${item.name} added to cart!`);
  };

  if (selectedRestaurant) {
    return (
      <div style={{ padding: '20px', minHeight: '70vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <button 
            onClick={() => setSelectedRestaurant(null)}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              marginRight: '15px',
              cursor: 'pointer'
            }}
          >
            ← Back to Restaurants
          </button>
          <div>
            <h2 style={{ margin: 0 }}>{selectedRestaurant.name}</h2>
            <p style={{ margin: '5px 0', color: '#666' }}>
              ⭐ {selectedRestaurant.rating} • {selectedRestaurant.preparationTime} mins • ₹{selectedRestaurant.deliveryFee} delivery
            </p>
          </div>
        </div>

        <h3>Menu ({restaurantMenu.length} items)</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px',
          marginTop: '20px'
        }}>
          {restaurantMenu.map(item => (
            <div key={item._id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ height: '150px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '48px' }}>🍜</span>
              </div>
              <div style={{ padding: '15px' }}>
                <h4 style={{ margin: '0 0 8px 0' }}>{item.name}</h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
                  {item.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                    ₹{item.price}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', minHeight: '70vh' }}>
      <h2>Nearby Restaurants</h2>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <select
          value={filters.cuisine}
          onChange={(e) => setFilters({...filters, cuisine: e.target.value})}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="all">All Cuisines</option>
          <option value="Indian">Indian</option>
          <option value="Italian">Italian</option>
          <option value="Fast Food">Fast Food</option>
        </select>
        
        <select
          value={filters.rating}
          onChange={(e) => setFilters({...filters, rating: parseFloat(e.target.value)})}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value={0}>Any Rating</option>
          <option value={3}>3+ Stars</option>
          <option value={4}>4+ Stars</option>
        </select>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {restaurants.map(restaurant => (
          <div key={restaurant._id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', cursor: 'pointer' }}
              onClick={() => handleRestaurantClick(restaurant)}
            >
              <h3 style={{ margin: 0 }}>{restaurant.name}</h3>
              <span style={{
                backgroundColor: restaurant.isOpen ? '#28a745' : '#dc3545',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                {restaurant.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <span style={{ 
                backgroundColor: '#28a745', 
                color: 'white', 
                padding: '2px 6px', 
                borderRadius: '4px',
                fontSize: '12px',
                marginRight: '10px'
              }}>
                ⭐ {restaurant.rating}
              </span>
              <span style={{ fontSize: '14px', color: '#666' }}>
                {restaurant.preparationTime} mins • ₹{restaurant.deliveryFee} delivery
              </span>
            </div>
            
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
              {restaurant.cuisine.join(', ')}
            </p>
            <p style={{ margin: '0', fontSize: '14px' }}>
              Min order: ₹{restaurant.minimumOrder}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRestaurantClick(restaurant);
              }}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              View Menu
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restaurants;