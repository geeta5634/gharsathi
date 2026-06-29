require('dotenv').config();

const SMS_PROVIDER = process.env.SMS_PROVIDER || 'console';

const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY || '';
const FAST2SMS_SENDER_ID = process.env.FAST2SMS_SENDER_ID || 'TXTIND';
const SMS_ROUTE = process.env.SMS_ROUTE || 'v3';

const RAPID_API_KEY = process.env.RAPID_API_KEY || '';
const RAPID_API_HOST = process.env.RAPID_API_HOST || '';
const RAPID_API_URL = process.env.RAPID_API_URL || '';

const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_PER_WINDOW = 5;
const smsRateLimit = new Map();

function checkRateLimit(phone) {
  const now = Date.now();
  const entry = smsRateLimit.get(phone);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    smsRateLimit.set(phone, { windowStart: now, count: 1 });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) {
    return false;
  }
  entry.count++;
  return true;
}

function toInternational(phone) {
  const clean = phone.replace(/\D/g, '');
  if (clean.startsWith('91') && clean.length === 12) return '+' + clean;
  if (clean.length === 10) return '+91' + clean;
  return '+' + clean;
}

async function sendSMS(phone, message) {
  if (!phone) return { success: false, error: 'Phone is required' };

  const phoneClean = phone.replace(/\D/g, '');
  if (phoneClean.length < 10) return { success: false, error: 'Invalid phone number' };

  if (!checkRateLimit(phoneClean)) {
    console.warn(`[SMS] Rate limited: ${phoneClean}`);
    return { success: false, error: 'Too many requests. Try again later.' };
  }

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

      const intlPhone = toInternational(phone);
      const body = JSON.stringify({ target: intlPhone });

      console.log(`[SMS] Sending via RapidAPI to ${intlPhone}...`);

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
      console.log(`[SMS] RapidAPI response: ${JSON.stringify(data)}`);

      if (data.status === 'success' || data.verify_code) {
        const code = data.verify_code || data.otp || data.code || data.pin || '';
        console.log(`[SMS] Sent via RapidAPI (cost: ${data.cost || 'N/A'})`);
        return { success: true, provider: 'rapidapi', verify_code: code, message: data.message };
      }
      console.warn(`[SMS] RapidAPI failed: ${JSON.stringify(data)}`);
      return { success: false, provider: 'rapidapi', error: data.message || data.status || 'RapidAPI error' };
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