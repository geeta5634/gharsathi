require('dotenv').config();

const SMS_PROVIDER = process.env.SMS_PROVIDER || 'console';
const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY || '';
const FAST2SMS_SENDER_ID = process.env.FAST2SMS_SENDER_ID || 'TXTIND';
const SMS_ROUTE = process.env.SMS_ROUTE || 'v3';

const RAPID_API_KEY = process.env.RAPID_API_KEY || '';
const RAPID_API_HOST = process.env.RAPID_API_HOST || '';
const RAPID_API_URL = process.env.RAPID_API_URL || '';

async function sendSMS(phone, message) {
  if (!phone || !message) return { success: false, error: 'Phone and message are required' };

  const phoneClean = phone.replace(/\D/g, '');
  if (phoneClean.length < 10) return { success: false, error: 'Invalid phone number' };

  if (SMS_PROVIDER === 'fast2sms' && FAST2SMS_API_KEY) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: SMS_ROUTE,
          sender_id: FAST2SMS_SENDER_ID,
          message,
          language: 'english',
          flash: 0,
          numbers: phoneClean,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await res.json();
      if (data.return === true) {
        console.log(`[SMS] Sent to ${phoneClean} via Fast2SMS`);
        return { success: true, provider: 'fast2sms' };
      }
      console.warn(`[SMS] Fast2SMS failed: ${JSON.stringify(data)}`);
      return { success: false, provider: 'fast2sms', error: data.message || 'Fast2SMS error' };
    } catch (err) {
      console.warn(`[SMS] Fast2SMS error: ${err.message}`);
      return { success: false, provider: 'fast2sms', error: err.message };
    }
  }

  if (SMS_PROVIDER === 'rapidapi' && RAPID_API_KEY && RAPID_API_URL) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const body = JSON.stringify({
        numbers: phoneClean,
        message,
        ...(RAPID_API_HOST.includes('fast2sms') ? { route: 'v3', sender_id: 'TXTIND' } : {}),
      });

      const res = await fetch(RAPID_API_URL, {
        method: 'POST',
        headers: {
          'x-rapidapi-key': RAPID_API_KEY,
          'x-rapidapi-host': RAPID_API_HOST,
          'Content-Type': 'application/json',
        },
        body,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await res.json();
      console.log(`[SMS] Sent to ${phoneClean} via RapidAPI`);
      return { success: true, provider: 'rapidapi', data };
    } catch (err) {
      console.warn(`[SMS] RapidAPI error: ${err.message}`);
      return { success: false, provider: 'rapidapi', error: err.message };
    }
  }

  console.log(`[SMS] ${phoneClean}: ${message}`);
  return { success: true, provider: 'console' };
}

async function sendOTP(phone, otp) {
  const message = `Your GharSathi OTP is ${otp}. Valid for 5 minutes. - GharSathi Team`;
  return sendSMS(phone, message);
}

module.exports = { sendSMS, sendOTP };
