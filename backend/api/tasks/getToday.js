const db = require('../../config/database');

async function getTodayTasks(req, res) {
  try {
    const { user_id } = req.params;
    if (!user_id) return res.status(400).json({ success: false, error: 'user_id is required' });

    const sql = `
      SELECT * FROM tasks
      WHERE user_id = ?
        AND date(due_date) = date('now')
        AND is_completed = 0
      ORDER BY priority ASC, due_date ASC
    `;

    const tasks = await db.allAsync(sql, [user_id]);
    return res.status(200).json({ success: true, count: tasks.length, date: new Date().toISOString().split('T')[0], tasks });
  } catch (error) {
    console.error('❌ Error fetching today tasks:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

module.exports = getTodayTasks;
