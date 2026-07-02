const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String },
  basePrice: { type: Number, required: true },
  visitCharge: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  category: { type: String },
  isActive: { type: Boolean, default: true },
  features: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Service', serviceSchema);
