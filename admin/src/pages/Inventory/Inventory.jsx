import React, { useState, useEffect, useContext } from 'react';
import './Inventory.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';

const Inventory = ({ url }) => {
  const { token } = useContext(StoreContext);
  const [foods, setFoods] = useState([]);
  const apiUrl = "http://localhost:4000";

  const fetchFoods = async () => {
    try {
      const response = await axios.get(apiUrl + "/api/food/list");
      if (response.data.success) {
        setFoods(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch food items");
    }
  };

  const updateInventory = async (id, quantity, lowStockThreshold, outOfStock) => {
    try {
      const response = await axios.post(apiUrl + "/api/food/update-inventory", {
        id,
        quantity: quantity !== undefined ? quantity : undefined,
        lowStockThreshold: lowStockThreshold !== undefined ? lowStockThreshold : undefined,
        outOfStock: outOfStock !== undefined ? outOfStock : undefined
      }, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success("Inventory updated successfully");
        fetchFoods();
        localStorage.removeItem('foodListCache');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error("Failed to update inventory");
    }
  };

  const updatePrice = async (id, newPrice) => {
    try {
      const response = await axios.post(apiUrl + "/api/food/update-price", {
        id,
        price: newPrice
      }, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success("Price updated successfully");
        fetchFoods();
        localStorage.removeItem('foodListCache');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Price update error:', error);
      toast.error("Failed to update price");
    }
  };

  const handleQuantityChange = (id, newQuantity) => {
    const food = foods.find(f => f._id === id);
    updateInventory(id, newQuantity, food.lowStockThreshold, newQuantity === 0);
  };

  const handlePriceChange = (id, newPrice) => {
    updatePrice(id, newPrice);
  };

  const toggleOutOfStock = (id) => {
    const food = foods.find(f => f._id === id);
    const newOutOfStock = !food.outOfStock;
    console.log(`Toggling ${food.name} from ${food.outOfStock} to ${newOutOfStock}`);
    updateInventory(id, undefined, undefined, newOutOfStock);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  return (
    <div className="inventory">
      <h2>Inventory Management</h2>
      <div className="inventory-list">
        {foods.map((food) => (
          <div key={food._id} className={`inventory-item ${food.outOfStock ? 'out-of-stock' : ''}`}>
            <img src={`${apiUrl}/images/${food.image}`} alt={food.name} />
            <div className="item-details">
              <h3>{food.name}</h3>
              <p>{food.category} - ₹{food.price}</p>
            </div>
            <div className="inventory-controls">
              <div className="price-control">
                <label>Price:</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={food.price || 0}
                  onChange={(e) => handlePriceChange(food._id, parseFloat(e.target.value))}
                />
              </div>
              <div className="quantity-control">
                <label>Qty:</label>
                <input
                  type="number"
                  min="0"
                  value={food.quantity || 0}
                  onChange={(e) => handleQuantityChange(food._id, parseInt(e.target.value))}
                  disabled={food.outOfStock}
                />
              </div>
              <button
                className={`stock-toggle ${food.outOfStock ? 'out-of-stock' : 'in-stock'}`}
                onClick={() => toggleOutOfStock(food._id)}
              >
                {food.outOfStock ? 'Out of Stock' : 'In Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;