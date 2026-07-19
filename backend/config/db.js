const { init, seed } = require('./memoryStore');

const connectDB = async () => {
  try {
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected`);
    return;
  } catch (error) {
    console.log(`MongoDB not available (${error.message}), using in-memory store`);
  }

  console.log('Initializing in-memory data store...');
  await seed();
  console.log('In-memory data store ready.');
};

module.exports = connectDB;
