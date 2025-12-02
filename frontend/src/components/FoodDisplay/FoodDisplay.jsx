import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list, refreshFoodList } = useContext(StoreContext);
  
  // Manual refresh button for testing
  const handleRefresh = () => {
    refreshFoodList();
  };
  
  return (
    <div className="food-display" id="food-display">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h2>Popular Dishes Near You</h2>
        <button onClick={handleRefresh} style={{padding: '8px 16px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
          Refresh Menu
        </button>
      </div>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          if ((category === "All" || category === item.category)) {
            return (
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
            );
          }
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
