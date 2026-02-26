const db = require('../../config/database');

async function createTask(req, res) {
  try {
    const { user_id, title, description, due_date, priority, status, time_view } = req.body;

    if (!user_id) return res.status(400).json({ success: false, error: 'user_id is required' });
    if (!title || title.trim() === '') return res.status(400).json({ success: false, error: 'Task title is required' });
    if (!due_date) return res.status(400).json({ success: false, error: 'Due date is required' });

    const userExists = await db.getAsync('SELECT user_id FROM users WHERE user_id = ?', [user_id]);
    if (!userExists) return res.status(404).json({ success: false, error: 'User not found' });

    const dueDateObj = new Date(due_date);
    if (isNaN(dueDateObj.getTime())) return res.status(400).json({ success: false, error: 'Invalid due_date format' });

    const sql = `INSERT INTO tasks (user_id, title, description, due_date, priority, status, time_view) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const result = await db.runAsync(sql, [user_id, title.trim(), description || null, due_date, priority || 2, status || 'Not Started', time_view || 'full']);
    const newTask = await db.getAsync('SELECT * FROM tasks WHERE task_id = ?', [result.lastID]);

    return res.status(201).json({ success: true, message: 'Task created successfully', task: newTask });
  } catch (error) {
    console.error('❌ Error creating task:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

module.exports = createTask;
