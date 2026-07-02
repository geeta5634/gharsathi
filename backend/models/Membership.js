const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['basic', 'premium', 'vip'], required: true },
  price: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  autoRenew: { type: Boolean, default: false },
  paymentId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Membership', membershipSchema);
