import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Environment-aware URL
  const url = import.meta.env.VITE_API_URL || 
              (window.location.hostname === 'localhost' 
                ? "http://localhost:4000" 
                : "https://food-delivery-backend-5b6g.onrender.com");

  const verifyToken = async (token) => {
    try {
      const response = await axios.post(`${url}/api/admin/verify`, { token });
      if (response.data.success) {
        setAdmin(response.data.admin);
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
    }
    return false;
  };

  const logout = () => {
    setToken("");
    setAdmin(false);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
  };

  useEffect(() => {
    async function loadData() {
      const savedToken = localStorage.getItem("token");
      const savedAdmin = localStorage.getItem("admin");
      
      if (savedToken && savedAdmin === "true") {
        setToken(savedToken);
        setAdmin(true);
        setIsAuthenticated(true);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Save admin state to localStorage
  useEffect(() => {
    if (token && admin) {
      localStorage.setItem("token", token);
      localStorage.setItem("admin", "true");
    }
  }, [token, admin]);

  const contextValue = {
    token,
    setToken,
    admin,
    setAdmin,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    url,
    verifyToken,
    logout
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
