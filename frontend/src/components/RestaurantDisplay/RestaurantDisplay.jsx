import React from 'react';
import './RestaurantDisplay.css';
import { Link } from 'react-router-dom';

const RestaurantDisplay = () => {
  const restaurants = [
    {
      id: 1,
      name: "Dragon Palace",
      image: "/api/placeholder/300/200",
      rating: 4.8,
      deliveryTime: "25-35 min",
      deliveryFee: 2.99,
      cuisine: "Chinese, Asian",
      address: "123 Main St, Downtown"
    },
    {
      id: 2,
      name: "Golden Wok",
      image: "/api/placeholder/300/200", 
      rating: 4.6,
      deliveryTime: "20-30 min",
      deliveryFee: 1.99,
      cuisine: "Chinese, Noodles",
      address: "456 Oak Ave, Midtown"
    },
    {
      id: 3,
      name: "Spice Garden",
      image: "/api/placeholder/300/200",
      rating: 4.7,
      deliveryTime: "30-40 min", 
      deliveryFee: 3.49,
      cuisine: "Indian, Curry",
      address: "789 Pine Rd, Uptown"
    },
    {
      id: 4,
      name: "Pizza Corner",
      image: "/api/placeholder/300/200",
      rating: 4.5,
      deliveryTime: "15-25 min",
      deliveryFee: 2.49,
      cuisine: "Italian, Pizza",
      address: "321 Elm St, Central"
    }
  ];

  return (
    <div className="restaurant-display">
      <h2>Nearby Restaurants</h2>
      <div className="restaurant-grid">
        {restaurants.map(restaurant => (
          <Link key={restaurant.id} to={`/restaurants/${restaurant.id}`} className="restaurant-card">
            <img src={restaurant.image} alt={restaurant.name} />
            <div className="restaurant-info">
              <h3>{restaurant.name}</h3>
              <div className="restaurant-meta">
                <span className="rating">⭐ {restaurant.rating}</span>
                <span className="delivery-time">🕒 {restaurant.deliveryTime}</span>
              </div>
              <p className="cuisine">{restaurant.cuisine}</p>
              <p className="address">{restaurant.address}</p>
              <div className="delivery-fee">🚚 ${restaurant.deliveryFee} delivery</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RestaurantDisplay;