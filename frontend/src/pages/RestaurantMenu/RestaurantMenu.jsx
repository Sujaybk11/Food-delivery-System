import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../../components/FoodItem/FoodItem';
import './RestaurantMenu.css';

const RestaurantMenu = () => {
  const { restaurantId } = useParams();
  const { food_list } = useContext(StoreContext);

  const restaurantNames = {
    1: "Dragon Palace",
    2: "Golden Wok", 
    3: "Spice Garden",
    4: "Pizza Corner"
  };

  const restaurantName = restaurantNames[restaurantId];
  const restaurantItems = food_list.filter(item => item.restaurant === restaurantName);

  return (
    <div className="restaurant-menu">
      <div className="restaurant-header">
        <h1>{restaurantName}</h1>
        <p>Delicious food delivered to your door</p>
      </div>
      
      <div className="menu-items">
        <h2>Menu Items</h2>
        <div className="food-display-list">
          {restaurantItems.map(item => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              outOfStock={item.outOfStock}
              quantity={item.quantity}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu;