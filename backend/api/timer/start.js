// backend/api/timer/start.js
// Starts a new focus timer session for a task
// Author: Miracle Emefiele

const db = require('../../config/database');

async function startTimer(req, res) {
  try {
    const { user_id, task_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'user_id is required' });
    }

    // task_id is optional — user can run a timer without a specific task
    if (task_id) {
      const task = await db.getAsync(
        'SELECT task_id FROM tasks WHERE task_id = ? AND user_id = ?',
        [task_id, user_id]
      );
      if (!task) {
        return res.status(404).json({ success: false, error: 'Task not found or does not belong to this user' });
      }
    }

    const start_time = new Date().toISOString();

    const result = await db.runAsync(
      `INSERT INTO timer_logs (user_id, task_id, start_time, completed) VALUES (?, ?, ?, 0)`,
      [user_id, task_id || null, start_time]
    );

    const session = await db.getAsync(
      'SELECT * FROM timer_logs WHERE timer_id = ?',
      [result.lastID]
    );

    return res.status(201).json({
      success: true,
      message: 'Timer session started',
      session
    });

  } catch (error) {
    console.error('❌ Error starting timer:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

module.exports = startTimer;