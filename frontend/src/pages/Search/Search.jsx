import React, { useState, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../../components/FoodItem/FoodItem';

const Search = () => {
  const { food_list } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Salad', 'Rolls', 'Deserts', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta', 'Noodles'];

  const filteredItems = food_list.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: '20px', minHeight: '70vh' }}>
      <h2>Search Food Items</h2>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search for food items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '16px',
            minWidth: '300px',
            flex: 1
          }}
        />
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '16px'
          }}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p>Found {filteredItems.length} items</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px'
      }}>
        {filteredItems.map(item => (
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

      {filteredItems.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>No items found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Search;