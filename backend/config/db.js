import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      bufferCommands: false
    };
    
    await mongoose.connect(process.env.MONGO_URL, options);
    console.log("🟢 Database Connected Successfully");
    
    mongoose.connection.on('error', (err) => {
      console.error('🔴 Database connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('🟡 Database disconnected');
    });
    
  } catch (error) {
    console.error("🔴 Database connection failed:", error.message);
    throw error;
  }
};
