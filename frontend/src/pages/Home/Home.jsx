import React from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import RestaurantDisplay from '../../components/RestaurantDisplay/RestaurantDisplay'

const Home = () => {
  return (
    <div>
      <Header/>
      <RestaurantDisplay/>
    </div>
  )
}

export default Home
