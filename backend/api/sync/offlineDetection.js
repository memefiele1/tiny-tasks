// backend/api/sync/offlineDetection.js
// Checks network connectivity and returns online/offline status
// Author: Miracle Emefiele

const https = require('https');

function checkConnectivity() {
  return new Promise((resolve) => {
    const req = https.get('https://www.google.com', (res) => {
      resolve({ online: true, status: res.statusCode });
    });
    req.on('error', () => {
      resolve({ online: false, status: null });
    });
    req.setTimeout(3000, () => {
      req.destroy();
      resolve({ online: false, status: null });
    });
  });
}

async function getNetworkStatus(req, res) {
  try {
    const result = await checkConnectivity();
    return res.status(200).json({
      success: true,
      online: result.online,
      message: result.online ? 'Device is online' : 'Device is offline'
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Could not check connectivity' });
  }
}

module.exports = { getNetworkStatus, checkConnectivity };
