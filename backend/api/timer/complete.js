// backend/api/timer/complete.js
// Completes a focus timer session — records end time, calculates duration
// Author: Miracle Emefiele

const db = require('../../config/database');

async function completeTimer(req, res) {
  try {
    const { timer_id } = req.params;
    const { user_id } = req.body;

    if (!timer_id) {
      return res.status(400).json({ success: false, error: 'timer_id is required' });
    }
    if (!user_id) {
      return res.status(400).json({ success: false, error: 'user_id is required' });
    }

    // Find the session
    const session = await db.getAsync(
      'SELECT * FROM timer_logs WHERE timer_id = ? AND user_id = ?',
      [timer_id, user_id]
    );

    if (!session) {
      return res.status(404).json({ success: false, error: 'Timer session not found' });
    }
    if (session.completed) {
      return res.status(400).json({ success: false, error: 'Timer session already completed' });
    }

    const end_time = new Date().toISOString();
    const start = new Date(session.start_time);
    const end = new Date(end_time);

    // Calculate duration in minutes, rounded to nearest minute
    const duration_minutes = Math.round((end - start) / (1000 * 60));

    await db.runAsync(
      `UPDATE timer_logs
       SET end_time = ?, duration_minutes = ?, completed = 1
       WHERE timer_id = ?`,
      [end_time, duration_minutes, timer_id]
    );

    const updated = await db.getAsync(
      'SELECT * FROM timer_logs WHERE timer_id = ?',
      [timer_id]
    );

    return res.status(200).json({
      success: true,
      message: 'Timer session completed',
      session: updated
    });

  } catch (error) {
    console.error('❌ Error completing timer:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

module.exports = completeTimer;