import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import AdminLogin from "./components/AdminLogin/AdminLogin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import OrderTracking from "./pages/OrderTracking/OrderTracking";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Favorites from "./pages/Favorites/Favorites";
import Search from "./pages/Search/Search";
import Profile from "./pages/Profile/Profile";
import Restaurants from "./pages/Restaurants/Restaurants";
import LiveTracking from "./pages/LiveTracking/LiveTracking";
import RestaurantDashboard from "./pages/RestaurantOwner/RestaurantDashboard";
import OrderCustomization from "./pages/OrderCustomization/OrderCustomization";
import TableReservation from "./pages/TableReservation/TableReservation";
import RestaurantMenu from "./pages/RestaurantMenu/RestaurantMenu";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Environment-aware URL configuration
  const url = import.meta.env.VITE_API_URL || 
              (window.location.hostname === 'localhost' 
                ? "http://localhost:4000" 
                : "https://food-delivery-system-0nyi.onrender.com");
  
  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      {showAdminLogin ? <AdminLogin setShowAdminLogin={setShowAdminLogin} url={url} /> : <></>}
      <div className="app">
        <ToastContainer />
        <Navbar setShowLogin={setShowLogin} setShowAdminLogin={setShowAdminLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/track/:orderId" element={<OrderTracking />} />
          <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:restaurantId" element={<RestaurantMenu />} />
          <Route path="/track/:orderId" element={<LiveTracking />} />
          <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
          <Route path="/customize/:itemId" element={<OrderCustomization />} />
          <Route path="/table-reservation" element={<TableReservation />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
