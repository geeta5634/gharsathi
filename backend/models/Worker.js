const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  experience: { type: String },
  rating: { type: Number, default: 4.0 },
  totalJobs: { type: Number, default: 0 },
  price: { type: String },
  location: { type: String },
  city: { type: String },
  isAvailable: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  trustScore: { type: Number, default: 0 },
  description: { type: String },
  skills: [{ type: String }],
  certifications: [{ type: String }],
  earnings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Worker', workerSchema);
