const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['basic', 'premium', 'vip'],
    required: [true, 'Plan type is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  paymentId: {
    type: String
  },
  benefits: [{
    type: String
  }]
}, {
  timestamps: true
});

membershipSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model('Membership', membershipSchema);
