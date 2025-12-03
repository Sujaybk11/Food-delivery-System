import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "https://food-delivery-frontend-s2l9.onrender.com";
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// placing COD order
const placeCODOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: true,
      paymentMethod: "COD"
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const orderInfo = {
      orderId: newOrder._id,
      deliveryTime: "1 hour",
      contactNumber: "+1-800-FOOD-DEL",
      amount: req.body.amount,
      items: req.body.items,
      address: req.body.address
    };

    res.json({ success: true, message: "Order placed successfully!", orderInfo });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error placing order" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin pannel
const listOrders = async (req, res) => {
  try {
    // Check if request has admin token
    const token = req.headers.token;
    if (!token) {
      return res.json({ success: false, message: "No token provided" });
    }
    
    // Verify admin token
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.isAdmin) {
      return res.json({ success: false, message: "You are not admin" });
    }
    
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log("List orders error:", error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

// api for updating status
const updateStatus = async (req, res) => {
  try {
    // Check if request has admin token (from admin login)
    const token = req.headers.token;
    if (!token) {
      return res.json({ success: false, message: "No token provided" });
    }
    
    // Verify admin token
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.isAdmin) {
      return res.json({ success: false, message: "You are not an admin" });
    }
    
    const updateData = {
      status: req.body.status,
    };
    
    // Add delivery timestamp if marking as delivered
    if (req.body.status === "Delivered" && req.body.deliveredAt) {
      updateData.deliveredAt = req.body.deliveredAt;
    }
    
    const result = await orderModel.findByIdAndUpdate(req.body.orderId, updateData, { new: true });
    
    if (result) {
      console.log(`Order ${req.body.orderId} status updated to: ${req.body.status}`);
      res.json({ success: true, message: "Status Updated Successfully" });
    } else {
      res.json({ success: false, message: "Order not found" });
    }
  } catch (error) {
    console.log("Update status error:", error);
    res.json({ success: false, message: "Error updating status" });
  }
};

// get orders for specific user (admin only)
const getUserOrders = async (req, res) => {
  try {
    let adminData = await userModel.findById(req.body.userId);
    if (adminData && adminData.role === "admin") {
      const targetUserId = req.body.targetUserId;
      
      console.log('Admin requesting orders for user:', targetUserId);
      
      const orders = await orderModel.find({ userId: targetUserId }).sort({ createdAt: -1 });
      
      console.log('Found orders:', orders.length, 'Status breakdown:', 
        orders.map(o => ({ id: o._id.toString().slice(-6), status: o.status })));
      
      res.json({ success: true, data: orders });
    } else {
      res.json({ success: false, message: "Access denied. Admin privileges required." });
    }
  } catch (error) {
    console.log('getUserOrders error:', error);
    res.json({ success: false, message: "Error fetching user orders" });
  }
};

// cancel order (within 2 minutes)
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await orderModel.findById(orderId);
    
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }
    
    // Check if order belongs to the user
    if (order.userId.toString() !== req.body.userId.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    
    // Check if order is within 2 minutes
    const orderTime = new Date(order.createdAt);
    const now = new Date();
    const timeDiff = (now - orderTime) / 1000; // in seconds
    
    if (timeDiff > 120) { // 2 minutes = 120 seconds
      return res.json({ success: false, message: "Cannot cancel order after 2 minutes" });
    }
    
    // Check if order is already delivered or cancelled
    if (order.status === 'Delivered' || order.status === 'Cancelled') {
      return res.json({ success: false, message: "Cannot cancel this order" });
    }
    
    // Update order status to cancelled
    await orderModel.findByIdAndUpdate(orderId, { 
      status: 'Cancelled',
      cancelledAt: new Date()
    });
    
    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error cancelling order" });
  }
};

export { placeOrder, placeCODOrder, verifyOrder, userOrders, listOrders, updateStatus, getUserOrders, cancelOrder };
