// backend/api/sync/syncQueue.js
// Manages pending operations when device is offline
// Author: Miracle Emefiele

const db = require('../../config/database');

// Add operation to sync queue
async function addToQueue(req, res) {
  try {
    const { user_id, task_id, operation, resource, data } = req.body;

    if (!user_id || !operation) {
      return res.status(400).json({ success: false, error: 'user_id and operation are required' });
    }

    await db.runAsync(
      `INSERT INTO sync_queue (user_id, task_id, operation, resource, data, sync_status, retry_count)
       VALUES (?, ?, ?, ?, ?, 'pending', 0)`,
      [user_id, task_id || null, operation, resource || 'tasks', data ? JSON.stringify(data) : null]
    );

    return res.status(201).json({
      success: true,
      message: 'Operation queued for sync',
      operation,
      resource: resource || 'tasks'
    });

  } catch (error) {
    console.error('❌ Error adding to sync queue:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

// Get all pending operations for a user
async function getPendingQueue(req, res) {
  try {
    const { user_id } = req.params;

    const pending = await db.allAsync(
      `SELECT * FROM sync_queue 
       WHERE user_id = ? AND sync_status = 'pending'
       ORDER BY created_at ASC`,
      [user_id]
    );

    return res.status(200).json({
      success: true,
      count: pending.length,
      queue: pending
    });

  } catch (error) {
    console.error('❌ Error getting sync queue:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

module.exports = { addToQueue, getPendingQueue };
