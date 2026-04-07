// backend/api/sync/autoSync.js
// Processes pending sync queue when device comes back online
// Retries failed operations up to 3 times
// Author: Miracle Emefiele

const db = require('../../config/database');
const { checkConnectivity } = require('./offlineDetection');

const MAX_RETRIES = 3;

async function processOperation(op) {
  const data = op.data ? JSON.parse(op.data) : {};

  if (op.operation === 'create' && op.resource === 'tasks') {
    await db.runAsync(
      `INSERT INTO tasks (user_id, title, description, due_date, priority, status)
       VALUES (?, ?, ?, ?, ?, 'Not Started')`,
      [op.user_id, data.title, data.description, data.due_date, data.priority || 2]
    );
  } else if (op.operation === 'update' && op.resource === 'tasks') {
    await db.runAsync(
      `UPDATE tasks SET title = ?, description = ?, due_date = ?, updated_at = datetime('now')
       WHERE task_id = ? AND user_id = ?`,
      [data.title, data.description, data.due_date, op.task_id, op.user_id]
    );
  } else if (op.operation === 'delete' && op.resource === 'tasks') {
    await db.runAsync(
      'DELETE FROM tasks WHERE task_id = ? AND user_id = ?',
      [op.task_id, op.user_id]
    );
  } else if (op.operation === 'complete' && op.resource === 'tasks') {
    await db.runAsync(
      `UPDATE tasks SET status = 'Completed', is_completed = 1, completed_at = datetime('now')
       WHERE task_id = ? AND user_id = ?`,
      [op.task_id, op.user_id]
    );
  }
}

async function runAutoSync(req, res) {
  try {
    const { user_id } = req.params;

    // Check connectivity first
    const { online } = await checkConnectivity();
    if (!online) {
      return res.status(200).json({
        success: false,
        message: 'Device is offline — sync skipped',
        synced: 0,
        failed: 0
      });
    }

    // Get all pending operations
    const pending = await db.allAsync(
      `SELECT * FROM sync_queue 
       WHERE user_id = ? AND sync_status = 'pending' AND retry_count < ?
       ORDER BY created_at ASC`,
      [user_id, MAX_RETRIES]
    );

    let synced = 0;
    let failed = 0;

    for (const op of pending) {
      try {
        await processOperation(op);
        await db.runAsync(
          `UPDATE sync_queue SET sync_status = 'completed', last_attempt = datetime('now')
           WHERE sync_id = ?`,
          [op.sync_id]
        );
        synced++;
      } catch (err) {
        const newRetryCount = op.retry_count + 1;
        const newStatus = newRetryCount >= MAX_RETRIES ? 'failed' : 'pending';
        await db.runAsync(
          `UPDATE sync_queue SET retry_count = ?, sync_status = ?, last_attempt = datetime('now')
           WHERE sync_id = ?`,
          [newRetryCount, newStatus, op.sync_id]
        );
        failed++;
        console.error(`❌ Sync failed for operation ${op.sync_id}:`, err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Sync complete — ${synced} succeeded, ${failed} failed`,
      synced,
      failed
    });

  } catch (error) {
    console.error('❌ Auto-sync error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

module.exports = { runAutoSync };
