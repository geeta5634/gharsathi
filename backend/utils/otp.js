exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOTP = async (phone, otp) => {
  // Simulated OTP sending - in production use Twilio or similar
  console.log(`[OTP SIMULATION] Sending OTP ${otp} to phone: ${phone}`);
  return {
    success: true,
    message: `OTP sent to ${phone}`,
    otp: otp // Only for development/testing
  };
};
