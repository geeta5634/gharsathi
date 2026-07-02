const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const otp = generateOtp();

    // Save OTP to database
    await Otp.create({
      phone,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    // In production, send via Twilio:
    // await client.messages.create({ body: `Your GharSathi OTP is: ${otp}`, from: process.env.TWILIO_PHONE_NUMBER, to: phone });

    console.log(`OTP for ${phone}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      // Remove in production:
      otp,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp, name, role } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    const otpRecord = await Otp.findOne({
      phone,
      otp,
      verified: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    otpRecord.verified = true;
    await otpRecord.save();

    // Find or create user
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        name: name || `User_${phone.slice(-4)}`,
        role: role || 'customer',
        isVerified: true,
      });
    } else {
      user.isVerified = true;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        membership: user.membership,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-__v');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, email, address, city } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { name, email, address, city, updatedAt: new Date() },
      { new: true }
    ).select('-__v');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};
