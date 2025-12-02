import React, { useState } from "react";
import "./Register.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = ({ url }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  
  // Force correct URL
  const apiUrl = "http://localhost:4000";

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onRegister = async (event) => {
    event.preventDefault();
    
    // Validation
    if (!data.name || !data.email || !data.password) {
      toast.error("All fields are required");
      return;
    }
    
    if (data.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    try {
      console.log("Registering admin with:", { ...data, password: "[HIDDEN]" });
      console.log("API URL:", url + "/api/user/register-admin");
      
      const response = await axios.post(apiUrl + "/api/user/register-admin", data);
      
      console.log("Registration response:", response.data);
      
      if (response.data.success) {
        toast.success("Admin registered successfully! Please login.");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response) {
        toast.error(err.response.data.message || "Registration failed");
      } else {
        toast.error("Network error. Please check if backend is running.");
      }
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onRegister} className="login-popup-container">
        <div className="login-popup-title">
          <h2>Admin Registration</h2>
        </div>
        <div className="login-popup-inputs">
          <input
            name="name"
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            placeholder="Your name"
            required
          />
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
        <button type="submit">Register as Admin</button>
        <div className="admin-register">
          <p>Already have an account? <button type="button" onClick={() => navigate("/")}>Login</button></p>
        </div>
      </form>
    </div>
  );
};

export default Register;