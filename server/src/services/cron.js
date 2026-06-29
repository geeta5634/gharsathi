const cron = require('node-cron');
const { query, queryOne } = require('../database');
const { sendSMS } = require('./sms');

function setupCronJobs() {
  cron.schedule('0 9 * * *', () => {
    console.log('[Cron] Checking health record reminders...');
    try {
      const today = new Date().toISOString().split('T')[0];
      const dueAssets = query(
        "SELECT ha.*, u.name as user_name, u.phone FROM home_assets ha JOIN users u ON ha.user_id = u.id WHERE ha.next_service_date <= ? AND ha.next_service_date IS NOT NULL",
        today
      );

      for (const asset of dueAssets) {
        const msg = `GharSathi Reminder: Your ${asset.name} (${asset.category}) is due for service. Book now: https://gharsathi.com/customer.html?asset=${asset.id}`;
        sendSMS(asset.phone, msg);
        console.log(`[Cron] Reminder sent to ${asset.phone} for ${asset.name}`);
      }
    } catch (err) {
      console.error('[Cron] Health record check failed:', err.message);
    }
  });

  cron.schedule('0 2 * * *', () => {
    console.log('[Cron] Cleaning old location data...');
    try {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      execute('DELETE FROM location_updates WHERE updated_at < ?', weekAgo);
    } catch (err) {
      console.error('[Cron] Location cleanup failed:', err.message);
    }
  });

  console.log('[Cron] Jobs scheduled');
}

module.exports = { setupCronJobs };
