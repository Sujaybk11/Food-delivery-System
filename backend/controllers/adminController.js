import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import foodModel from "../models/foodModel.js";

// Admin credentials from environment variables
const ADMIN_CREDENTIALS = {
    email: process.env.ADMIN_EMAIL || "admin@fooddelivery.com",
    password: process.env.DEFAULT_ADMIN_PASSWORD || "admin123",
    name: "Admin",
    role: "admin"
};

// Admin login
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required" });
        }
        
        // Check email
        if (email !== ADMIN_CREDENTIALS.email) {
            return res.json({ success: false, message: "Invalid admin credentials" });
        }
        
        // Check password (simple comparison for development)
        const isValidPassword = password === ADMIN_CREDENTIALS.password;
        
        if (!isValidPassword) {
            return res.json({ success: false, message: "Invalid admin credentials" });
        }
        
        // Create token with admin flag and expiration
        const token = jwt.sign(
            { 
                email: ADMIN_CREDENTIALS.email, 
                isAdmin: true,
                name: ADMIN_CREDENTIALS.name,
                role: ADMIN_CREDENTIALS.role
            }, 
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({ 
            success: true, 
            token, 
            isAdmin: true,
            admin: {
                name: ADMIN_CREDENTIALS.name,
                email: ADMIN_CREDENTIALS.email,
                role: ADMIN_CREDENTIALS.role
            },
            message: "Admin login successful" 
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.json({ success: false, message: "Admin login failed" });
    }
};

// Verify admin token
const verifyAdmin = async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.json({ success: false, message: "No token provided" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.isAdmin) {
            res.json({ 
                success: true, 
                isAdmin: true,
                admin: { name: decoded.name, email: decoded.email }
            });
        } else {
            res.json({ success: false, message: "Not an admin" });
        }
    } catch (error) {
        res.json({ success: false, message: "Invalid token" });
    }
};

// Get analytics data
const getAnalytics = async (req, res) => {
    try {
        const totalOrders = await orderModel.countDocuments();
        const totalUsers = await userModel.countDocuments();
        const totalFoodItems = await foodModel.countDocuments();
        
        const revenueData = await orderModel.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueData[0]?.total || 0;
        
        res.json({
            success: true,
            stats: {
                totalOrders,
                totalUsers,
                totalFoodItems,
                totalRevenue
            }
        });
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch analytics" });
    }
};

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, '-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch users" });
    }
};

export { loginAdmin, verifyAdmin, getAnalytics, getUsers };