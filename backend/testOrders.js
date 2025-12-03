import mongoose from "mongoose";
import orderModel from "./models/orderModel.js";
import "dotenv/config";

const testOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to database");
    
    // Check existing orders
    const orders = await orderModel.find({});
    console.log(`Found ${orders.length} orders in database`);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

testOrders();