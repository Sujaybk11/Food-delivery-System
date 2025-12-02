import React, { useState } from 'react';

const OrderCustomization = () => {
  const [customizations, setCustomizations] = useState({
    size: 'medium',
    spiceLevel: 'medium',
    extras: [],
    instructions: ''
  });

  const item = { name: 'Chicken Pasta', basePrice: 220 };
  const options = {
    size: [
      { name: 'Small', price: 0 },
      { name: 'Medium', price: 50 },
      { name: 'Large', price: 100 }
    ],
    extras: [
      { name: 'Extra Cheese', price: 30 },
      { name: 'Extra Chicken', price: 80 }
    ]
  };

  const calculateTotal = () => {
    let total = item.basePrice;
    const sizePrice = options.size.find(s => s.name.toLowerCase() === customizations.size)?.price || 0;
    const extrasPrice = customizations.extras.reduce((sum, extra) => {
      const extraItem = options.extras.find(e => e.name === extra);
      return sum + (extraItem?.price || 0);
    }, 0);
    return total + sizePrice + extrasPrice;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Customize Your Order</h2>
      
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
        <h3>{item.name}</h3>
        <p>Base Price: ₹{item.basePrice}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Size</h4>
        {options.size.map(size => (
          <label key={size.name} style={{ display: 'block', marginBottom: '8px' }}>
            <input
              type="radio"
              name="size"
              value={size.name.toLowerCase()}
              checked={customizations.size === size.name.toLowerCase()}
              onChange={(e) => setCustomizations(prev => ({ ...prev, size: e.target.value }))}
              style={{ marginRight: '8px' }}
            />
            {size.name} {size.price > 0 && `(+₹${size.price})`}
          </label>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Add Extras</h4>
        {options.extras.map(extra => (
          <label key={extra.name} style={{ display: 'block', marginBottom: '8px' }}>
            <input
              type="checkbox"
              checked={customizations.extras.includes(extra.name)}
              onChange={() => {
                setCustomizations(prev => ({
                  ...prev,
                  extras: prev.extras.includes(extra.name)
                    ? prev.extras.filter(e => e !== extra.name)
                    : [...prev.extras, extra.name]
                }));
              }}
              style={{ marginRight: '8px' }}
            />
            {extra.name} (+₹{extra.price})
          </label>
        ))}
      </div>

      <div style={{
        position: 'sticky',
        bottom: '20px',
        backgroundColor: 'white',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h4>Total: ₹{calculateTotal()}</h4>
        <button style={{
          padding: '12px 24px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default OrderCustomization;