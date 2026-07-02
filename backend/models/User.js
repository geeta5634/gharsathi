const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  role: { type: String, enum: ['customer', 'worker', 'admin'], default: 'customer' },
  address: { type: String },
  city: { type: String },
  isVerified: { type: Boolean, default: false },
  membership: { type: String, enum: ['none', 'basic', 'premium', 'vip'], default: 'none' },
  profileImage: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
