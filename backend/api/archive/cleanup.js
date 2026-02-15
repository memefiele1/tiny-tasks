// backend/api/archive/cleanup.js
// TIN-62: Automatic Archive Cleanup Job
// Deletes archive records older than 30 days
// Author: Miracle Emefiele

const db = require('../../config/database');

/**
 * Delete archive records older than 30 days
 * Runs automatically when server starts, then every 24 hours
 */
async function cleanupArchive() {
  try {
    console.log('🧹 Running archive cleanup job...');

    // Find records to delete (older than 30 days)
    const expiredRecords = await db.allAsync(`
      SELECT archive_id, title, date_completed, deleted_on
      FROM archive
      WHERE deleted_on <= CURRENT_TIMESTAMP
    `);

    if (expiredRecords.length === 0) {
      console.log('✅ Archive cleanup: No expired records found');
      return { deleted: 0 };
    }

    // Delete expired records
    const result = await db.runAsync(`
      DELETE FROM archive
      WHERE deleted_on <= CURRENT_TIMESTAMP
    `);

    console.log(`✅ Archive cleanup: Deleted ${result.changes} expired record(s)`);
    return { deleted: result.changes };

  } catch (error) {
    console.error('❌ Archive cleanup error:', error.message);
    return { error: error.message };
  }
}

/**
 * Start the cleanup job - runs every 24 hours
 */
function startCleanupJob() {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  // Run immediately on startup
  cleanupArchive();

  // Then run every 24 hours
  setInterval(cleanupArchive, TWENTY_FOUR_HOURS);

  console.log('⏰ Archive cleanup job scheduled (runs every 24 hours)');
}

module.exports = { cleanupArchive, startCleanupJob };

