import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login user

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.json({ success: false, message: "Email and password are required" });
    }
    
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    
    const token = createToken(user._id);
    res.json({ 
      success: true, 
      token, 
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.json({ success: false, message: "Login failed" });
  }
};

// Create token

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }
    
    if (name.length < 2) {
      return res.json({ success: false, message: "Name must be at least 2 characters" });
    }
    
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }
    
    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "user"
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ 
      success: true, 
      token, 
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      res.json({ success: false, message: "Email already exists" });
    } else {
      res.json({ success: false, message: "Registration failed" });
    }
  }
};

const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }
    
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Admin already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }
    
    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new userModel({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "admin"
    });

    const admin = await newAdmin.save();
    const token = createToken(admin._id);
    res.json({ 
      success: true, 
      token, 
      role: admin.role,
      user: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    if (error.code === 11000) {
      res.json({ success: false, message: "Email already exists" });
    } else {
      res.json({ success: false, message: "Admin registration failed" });
    }
  }
};

// list all users (admin only)
const listUsers = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const users = await userModel.find({}).select('-password');
      res.json({ success: true, data: users });
    } else {
      res.json({ success: false, message: "Access denied. Admin privileges required." });
    }
  } catch (error) {
    console.error('List users error:', error);
    res.json({ success: false, message: "Failed to fetch users" });
  }
};

// create user (admin only)
const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      
      if (!name || !email || !password) {
        return res.json({ success: false, message: "All fields are required" });
      }
      
      const exists = await userModel.findOne({ email });
      if (exists) {
        return res.json({ success: false, message: "User already exists" });
      }

      if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Please enter valid email" });
      }
      
      if (password.length < 8) {
        return res.json({ success: false, message: "Password must be at least 8 characters" });
      }

      const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new userModel({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: "user"
      });

      const user = await newUser.save();
      res.json({ 
        success: true, 
        message: "User created successfully",
        user: { id: user._id, name: user.name, email: user.email }
      });
    } else {
      res.json({ success: false, message: "Access denied. Admin privileges required." });
    }
  } catch (error) {
    console.error('Create user error:', error);
    if (error.code === 11000) {
      res.json({ success: false, message: "Email already exists" });
    } else {
      res.json({ success: false, message: "User creation failed" });
    }
  }
};

export { loginUser, registerUser, registerAdmin, listUsers, createUser };
