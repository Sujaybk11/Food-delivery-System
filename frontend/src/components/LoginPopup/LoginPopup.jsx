import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginPopup = ({ setShowLogin }) => {
  const {url, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    
    try {
      // Demo login - simulate successful authentication
      const demoToken = 'demo_token_' + Date.now();
      
      // Check for admin credentials
      if (data.email === 'admin@fooddelivery.com' && data.password === 'admin123') {
        localStorage.setItem("admin", "true");
        localStorage.setItem("token", demoToken);
        setToken(demoToken);
        toast.success("Admin Login Successfully");
        navigate('/admin');
      } else if (data.email && data.password) {
        // Regular user login
        localStorage.setItem("token", demoToken);
        localStorage.removeItem("admin");
        setToken(demoToken);
        toast.success("Login Successfully");
      } else {
        toast.error("Please enter valid credentials");
        return;
      }
      
      setShowLogin(false);
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };
  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currentState === "Login" ? (
            <></>
          ) : (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Your password"
            required
          />
        </div>
        <button type="submit">
          {currentState === "Sign Up" ? "Create Account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currentState === "Login" ? (
          <div>
            <p>
              Create a new account?{" "}
              <span onClick={() => setCurrentState("Sign Up")}>Click here</span>
            </p>
            <p style={{marginTop: '10px', fontSize: '12px', color: '#666'}}>
              Admin? Use your admin credentials to login above
            </p>
          </div>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrentState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
