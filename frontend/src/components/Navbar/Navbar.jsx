import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";


const Navbar = ({ setShowLogin, setShowAdminLogin }) => {
  const [menu, setMenu] = useState("home");

  const { getTotalCartAmount, token, logout } = useContext(StoreContext);
  const navigate=useNavigate();

  const handleLogout=()=>{
    logout();
    toast.success("Logout Successfully")
    navigate("/");
  }
  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          home
        </Link>



        <a
          href="#footer"
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          contact us
        </a>
        <Link
          to="/table-reservation"
          onClick={() => setMenu("reservation")}
          className={menu === "reservation" ? "active" : ""}
        >
          book table
        </Link>
        {token && (
          <Link
            to="/myorders"
            onClick={() => setMenu("my-orders")}
            className={menu === "my-orders" ? "active" : ""}
          >
            my orders
          </Link>
        )}
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <Link to="/search" onClick={() => setMenu("search")}>
          <img src={assets.search_icon} alt="" />
        </Link>

        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <div className="navbar-auth-buttons">
            <button onClick={() => setShowLogin(true)}>sign in</button>
            <button onClick={() => setShowAdminLogin(true)} className="admin-btn">admin</button>
          </div>
        ) : (
          <div className="navbar-auth-buttons">
            <button onClick={handleLogout} className="logout-btn">Logout</button>
            <button onClick={() => toast.info('Reset password feature coming soon!')} className="reset-btn">Reset Password</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
