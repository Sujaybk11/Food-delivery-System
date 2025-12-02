import React, { useState } from 'react';

const TableReservation = () => {
  const [reservation, setReservation] = useState({
    restaurant: '',
    date: '',
    time: '',
    guests: 2,
    name: '',
    phone: ''
  });

  const restaurants = [
    { id: 'dragon-palace', name: 'Dragon Palace', cuisine: 'Chinese', address: 'MG Road, Bangalore' },
    { id: 'golden-wok', name: 'Golden Wok', cuisine: 'Thai', address: 'Brigade Road, Bangalore' },
    { id: 'spice-garden', name: 'Spice Garden', cuisine: 'Indian', address: 'Koramangala, Bangalore' },
    { id: 'pizza-corner', name: 'Pizza Corner', cuisine: 'Italian', address: 'Indiranagar, Bangalore' }
  ];

  const timeSlots = ['12:00 PM', '1:00 PM', '2:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedRestaurant = restaurants.find(r => r.id === reservation.restaurant);
    const reservationData = {
      ...reservation,
      restaurantName: selectedRestaurant?.name,
      id: 'RES' + Date.now(),
      status: 'Confirmed'
    };
    
    // Save to localStorage
    const existingReservations = JSON.parse(localStorage.getItem('tableReservations') || '[]');
    existingReservations.push(reservationData);
    localStorage.setItem('tableReservations', JSON.stringify(existingReservations));
    
    alert(`Table reserved at ${selectedRestaurant?.name}!\nReservation ID: ${reservationData.id}`);
    
    // Reset form
    setReservation({
      restaurant: '',
      date: '',
      time: '',
      guests: 2,
      name: '',
      phone: ''
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', minHeight: '70vh' }}>
      <h2>Table Reservation</h2>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
        <div style={{ display: 'grid', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Select Restaurant</label>
            <select
              value={reservation.restaurant}
              onChange={(e) => setReservation(prev => ({ ...prev, restaurant: e.target.value }))}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="">Choose Restaurant</option>
              {restaurants.map(restaurant => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name} - {restaurant.cuisine} ({restaurant.address})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Date</label>
            <input
              type="date"
              value={reservation.date}
              onChange={(e) => setReservation(prev => ({ ...prev, date: e.target.value }))}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Time</label>
            <select
              value={reservation.time}
              onChange={(e) => setReservation(prev => ({ ...prev, time: e.target.value }))}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="">Select Time</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Guests</label>
            <select
              value={reservation.guests}
              onChange={(e) => setReservation(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              {[1,2,3,4,5,6].map(num => (
                <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Name</label>
            <input
              type="text"
              value={reservation.name}
              onChange={(e) => setReservation(prev => ({ ...prev, name: e.target.value }))}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Phone</label>
            <input
              type="tel"
              value={reservation.phone}
              onChange={(e) => setReservation(prev => ({ ...prev, phone: e.target.value }))}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            marginTop: '30px',
            padding: '15px 30px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            width: '100%'
          }}
        >
          Reserve Table
        </button>
      </form>
    </div>
  );
};

export default TableReservation;