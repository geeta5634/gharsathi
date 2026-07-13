const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('Server will continue without database. Retrying in 30s...');
    setTimeout(() => connectDB(), 30000);
  }
};

module.exports = connectDB;
