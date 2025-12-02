import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../../components/FoodItem/FoodItem';

const Favorites = () => {
  const { food_list } = useContext(StoreContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  const favoriteItems = food_list.filter(item => favorites.includes(item._id));

  return (
    <div style={{ padding: '20px', minHeight: '70vh' }}>
      <h2>My Favorites</h2>
      {favoriteItems.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>No favorite items yet. Start adding some!</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px',
          marginTop: '20px'
        }}>
          {favoriteItems.map(item => (
            <FoodItem 
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;