import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  
  if (!token) {
    return res.json({ success: false, message: "Access denied. No token provided." });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set userId from decoded token
    req.body.userId = decoded.id;
    req.user = { id: decoded.id };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.json({ success: false, message: "Token expired. Please login again." });
    } else if (error.name === 'JsonWebTokenError') {
      return res.json({ success: false, message: "Invalid token. Please login again." });
    }
    res.json({ success: false, message: "Authentication failed" });
  }
};

// Admin-only middleware
const adminMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  
  if (!token) {
    return res.json({ success: false, message: "Admin access denied. No token provided." });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.isAdmin) {
      return res.json({ success: false, message: "Admin access required" });
    }
    
    req.admin = { 
      email: decoded.email, 
      name: decoded.name, 
      isAdmin: true 
    };
    
    next();
  } catch (error) {
    console.error('Admin middleware error:', error.message);
    res.json({ success: false, message: "Admin authentication failed" });
  }
};

export default authMiddleware;
export { adminMiddleware };
