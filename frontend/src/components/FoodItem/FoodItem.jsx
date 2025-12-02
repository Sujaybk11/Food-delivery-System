import React, { useContext, useState } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const FoodItem = ({ id, name, price, description, image, outOfStock, quantity }) => {
  const {cartItems,addToCart,removeFromCart,url}=useContext(StoreContext); 
  
  // Ensure proper boolean comparison and handle undefined values
  const isOutOfStock = Boolean(outOfStock) || Number(quantity || 0) === 0;
  const currentCartQuantity = cartItems[id] || 0;

  const handleAddToCart = () => {
    try {
      if (!isOutOfStock) {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to add items to cart');
          return;
        }
        console.log('Adding to cart:', id, name);
        addToCart(id);
      }
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const handleRemoveFromCart = () => {
    try {
      removeFromCart(id);
    } catch (error) {
      console.error('Remove from cart error:', error);
    }
  };

  return (
    <div className={`food-item ${isOutOfStock ? 'out-of-stock' : ''}`}>
      <div className="food-item-img-container">
        <img 
          src={assets.food_1} 
          alt={name} 
          className="food-item-image"
        />
        {isOutOfStock ? (
          <div className="out-of-stock-badge">
            <span>Out of Stock</span>
          </div>
        ) : !currentCartQuantity ? (
          <img
            className="add"
            onClick={handleAddToCart}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="food-item-counter">
            <img onClick={handleRemoveFromCart} src={assets.remove_icon_red} alt="" />
            <p>{currentCartQuantity}</p>
            <img onClick={handleAddToCart} src={assets.add_icon_green} alt="" />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">₹{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
