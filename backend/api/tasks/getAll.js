const db = require('../../config/database');

async function getAllTasks(req, res) {
  try {
    const { user_id } = req.params;
    const { status, priority, time_view, completed } = req.query;
    if (!user_id) return res.status(400).json({ success: false, error: 'user_id is required' });

    let sql = `SELECT * FROM tasks WHERE user_id = ?`;
    const params = [user_id];

    if (status) { sql += ' AND status = ?'; params.push(status); }
    if (priority) { sql += ' AND priority = ?'; params.push(parseInt(priority)); }
    if (time_view) { sql += ' AND time_view = ?'; params.push(time_view); }
    if (completed !== undefined) { sql += ' AND is_completed = ?'; params.push(completed === 'true' ? 1 : 0); }

    sql += ' ORDER BY is_completed ASC, priority ASC, due_date ASC';

    const tasks = await db.allAsync(sql, params);
    return res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    console.error('❌ Error fetching tasks:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

module.exports = getAllTasks;
