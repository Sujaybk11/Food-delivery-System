import mongoose from 'mongoose';

const MONGO_URL = "mongodb+srv://sujaybk112005_db_user:Strepto%401969@tomato.dwkecf2.mongodb.net/tomato?retryWrites=true&w=majority&appName=tomato";

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    
    await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Connection details:');
    console.log('- Host:', mongoose.connection.host);
    console.log('- Database:', mongoose.connection.name);
    console.log('- Ready state:', mongoose.connection.readyState);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
  }
}

testConnection();