import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { images } from "../assets/images.js";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  // Environment-aware URL configuration
  const url = import.meta.env.VITE_API_URL || 
              (window.location.hostname === 'localhost' 
                ? "http://localhost:4000" 
                : "https://food-delivery-backend-5b6g.onrender.com");
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [loading, setLoading] = useState(false);

  const addToCart = async (itemId) => {
    try {
      if (!cartItems[itemId]) {
        setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
      } else {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }
      
      // Save to localStorage immediately
      const newCartItems = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 };
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
      
      toast.success("Item added to cart!");
      
      if (token) {
        try {
          await axios.post(
            url + "/api/cart/add",
            { itemId },
            { headers: { token } }
          );
        } catch (error) {
          console.error('Server cart sync error:', error);
        }
      }
    } catch (error) {
      console.error('Cart update error:', error);
      toast.error("Failed to add item to cart");
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const newQuantity = Math.max(0, (cartItems[itemId] || 0) - 1);
      setCartItems((prev) => ({ ...prev, [itemId]: newQuantity }));
      
      // Update localStorage
      const newCartItems = { ...cartItems, [itemId]: newQuantity };
      if (newQuantity === 0) {
        delete newCartItems[itemId];
      }
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
      
      toast.success("Item removed from cart!");
      
      if (token) {
        try {
          await axios.post(
            url + "/api/cart/remove",
            { itemId },
            { headers: { token } }
          );
        } catch (error) {
          console.error('Server cart sync error:', error);
        }
      }
    } catch (error) {
      console.error('Cart remove error:', error);
      toast.error("Failed to remove item from cart");
    }
  };

  const getTotalCartAmount = () => {
    try {
      let totalAmount = 0;
      for (const item in cartItems) {
        if (cartItems[item] > 0) {
          let itemInfo = food_list.find((product) => product._id === item);
          if (itemInfo) {
            totalAmount += itemInfo.price * cartItems[item];
          }
        }
      }
      return totalAmount;
    } catch (error) {
      console.error('Calculate total error:', error);
      return 0;
    }
  };

  const mockFoodData = [
    // Dragon Palace - Chinese Cuisine
    { _id: '1', name: 'Kung Pao Chicken', category: 'Chicken', price: 16.99, image: images.food_1, description: 'Spicy chicken with peanuts and vegetables', quantity: 50, isAvailable: true, outOfStock: false, restaurant: "Dragon Palace" },
    { _id: '2', name: 'Sweet & Sour Pork', category: 'Pork', price: 18.99, image: images.food_2, description: 'Crispy pork in tangy sweet and sour sauce', quantity: 30, isAvailable: true, outOfStock: false, restaurant: "Dragon Palace" },
    { _id: '3', name: 'Beef Black Bean', category: 'Beef', price: 19.99, image: images.food_3, description: 'Tender beef in savory black bean sauce', quantity: 25, isAvailable: true, outOfStock: false, restaurant: "Dragon Palace" },
    { _id: '4', name: 'Vegetable Spring Rolls', category: 'Veg', price: 8.99, image: images.food_4, description: 'Crispy vegetable spring rolls with dipping sauce', quantity: 40, isAvailable: true, outOfStock: false, restaurant: "Dragon Palace" },
    { _id: '5', name: 'Hot & Sour Soup', category: 'Soup', price: 7.99, image: images.food_5, description: 'Traditional spicy and tangy soup', quantity: 35, isAvailable: true, outOfStock: false, restaurant: "Dragon Palace" },
    
    // Golden Wok - Thai Cuisine
    { _id: '6', name: 'Pad Thai Noodles', category: 'Noodles', price: 14.99, image: images.food_6, description: 'Thai stir-fried noodles with tamarind sauce', quantity: 35, isAvailable: true, outOfStock: false, restaurant: "Golden Wok" },
    { _id: '7', name: 'Green Curry Chicken', category: 'Chicken', price: 17.99, image: images.food_7, description: 'Thai green curry with coconut milk', quantity: 30, isAvailable: true, outOfStock: false, restaurant: "Golden Wok" },
    { _id: '8', name: 'Tom Yum Soup', category: 'Soup', price: 9.99, image: images.food_8, description: 'Spicy Thai soup with lemongrass', quantity: 40, isAvailable: true, outOfStock: false, restaurant: "Golden Wok" },
    { _id: '9', name: 'Vegetable Pad See Ew', category: 'Veg', price: 13.99, image: images.food_9, description: 'Wide rice noodles with vegetables', quantity: 25, isAvailable: true, outOfStock: false, restaurant: "Golden Wok" },
    { _id: '10', name: 'Mango Sticky Rice', category: 'Dessert', price: 8.99, image: images.food_10, description: 'Sweet sticky rice with fresh mango', quantity: 20, isAvailable: true, outOfStock: false, restaurant: "Golden Wok" },
    
    // Spice Garden - Indian Cuisine
    { _id: '11', name: 'Butter Chicken', category: 'Chicken', price: 18.99, image: images.food_11, description: 'Creamy tomato curry with tender chicken', quantity: 45, isAvailable: true, outOfStock: false, restaurant: "Spice Garden" },
    { _id: '12', name: 'Palak Paneer', category: 'Veg', price: 15.99, image: images.food_12, description: 'Cottage cheese in creamy spinach curry', quantity: 30, isAvailable: true, outOfStock: false, restaurant: "Spice Garden" },
    { _id: '13', name: 'Lamb Biryani', category: 'Lamb', price: 22.99, image: images.food_13, description: 'Aromatic basmati rice with spiced lamb', quantity: 15, isAvailable: true, outOfStock: false, restaurant: "Spice Garden" },
    { _id: '14', name: 'Tandoori Chicken', category: 'Chicken', price: 19.99, image: images.food_14, description: 'Clay oven roasted chicken with spices', quantity: 25, isAvailable: true, outOfStock: false, restaurant: "Spice Garden" },
    { _id: '15', name: 'Gulab Jamun', category: 'Dessert', price: 6.99, image: images.food_15, description: 'Sweet milk dumplings in rose syrup', quantity: 50, isAvailable: true, outOfStock: false, restaurant: "Spice Garden" },
    
    // Pizza Corner - Italian Cuisine
    { _id: '16', name: 'Margherita Pizza', category: 'Veg', price: 16.99, image: images.food_16, description: 'Fresh tomatoes, mozzarella, and basil', quantity: 25, isAvailable: true, outOfStock: false, restaurant: "Pizza Corner" },
    { _id: '17', name: 'Pepperoni Pizza', category: 'Meat', price: 19.99, image: images.food_17, description: 'Classic pepperoni with mozzarella cheese', quantity: 30, isAvailable: true, outOfStock: false, restaurant: "Pizza Corner" },
    { _id: '18', name: 'Chicken Alfredo Pasta', category: 'Chicken', price: 17.99, image: images.food_18, description: 'Creamy alfredo sauce with grilled chicken', quantity: 20, isAvailable: true, outOfStock: false, restaurant: "Pizza Corner" },
    { _id: '19', name: 'Caesar Salad', category: 'Veg', price: 12.99, image: images.food_19, description: 'Crisp romaine with parmesan and croutons', quantity: 35, isAvailable: true, outOfStock: false, restaurant: "Pizza Corner" },
    { _id: '20', name: 'Tiramisu', category: 'Dessert', price: 7.99, image: images.food_20, description: 'Classic Italian coffee-flavored dessert', quantity: 15, isAvailable: true, outOfStock: false, restaurant: "Pizza Corner" }
  ];

  const fetchFoodList = async () => {
    try {
      setFoodList(mockFoodData);
    } catch (error) {
      console.error('Fetch food list error:', error);
    }
  };

  const loadCardData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData || {});
      } else {
        // If server cart fails, try to load from localStorage
        const savedCart = localStorage.getItem("cartItems");
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch (e) {
            setCartItems({});
          }
        }
      }
    } catch (error) {
      console.error('Load cart data error:', error);
      // Fallback to localStorage
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          setCartItems({});
        }
      } else {
        setCartItems({});
      }
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedCart = localStorage.getItem("cartItems");
    
    if (savedToken) {
      setToken(savedToken);
    }
    
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        setCartItems({});
      }
    }
    
    fetchFoodList();
  }, []);

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (token && token.trim() !== "") {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("cartItems");
    }
  }, [token]);

  // Save cart data to localStorage whenever it changes
  useEffect(() => {
    if (token && Object.keys(cartItems).length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, token]);

  const logout = () => {
    try {
      setToken("");
      setCartItems({});
      localStorage.removeItem("token");
      localStorage.removeItem("cartItems");
      // Clear any other cached data
      localStorage.removeItem("userProfile");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  // Function to refresh authentication state
  const refreshAuth = () => {
    const savedToken = localStorage.getItem("token");
    if (savedToken && savedToken !== token) {
      setToken(savedToken);
      loadCardData(savedToken);
      return true;
    }
    return false;
  };

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,

    fetchFoodList,
    loadCardData,
    logout,
    refreshAuth,
    refreshFoodList: fetchFoodList
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
