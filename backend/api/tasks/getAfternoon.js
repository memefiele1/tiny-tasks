// backend/api/tasks/getAfternoon.js
// Returns tasks due in the afternoon (12:00pm - 11:59pm) for a given user and date
// Author: Miracle Emefiele

const db = require('../../config/database');

async function getAfternoonTasks(req, res) {
  try {
    const { user_id } = req.params;
    const { date } = req.query; // expected format: YYYY-MM-DD

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'user_id is required' });
    }

    // Use today's date if none provided
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Afternoon = due_date falls between 12:00 and 23:59 on the target date
    const sql = `
      SELECT * FROM tasks
      WHERE user_id = ?
        AND is_completed = 0
        AND DATE(due_date) = ?
        AND strftime('%H', due_date) >= '12'
      ORDER BY priority ASC, due_date ASC
    `;

    const tasks = await db.allAsync(sql, [user_id, targetDate]);

    return res.status(200).json({
      success: true,
      view: 'afternoon',
      date: targetDate,
      count: tasks.length,
      tasks
    });

  } catch (error) {
    console.error('❌ Error fetching afternoon tasks:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

module.exports = getAfternoonTasks;