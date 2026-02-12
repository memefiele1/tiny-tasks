const db = require('../../config/database');

async function updateTask(req, res) {
  try {
    const { task_id } = req.params;
    const { title, description, due_date, priority, status, time_view } = req.body;

    if (!task_id) return res.status(400).json({ success: false, error: 'task_id is required' });

    const existingTask = await db.getAsync('SELECT * FROM tasks WHERE task_id = ?', [task_id]);
    if (!existingTask) return res.status(404).json({ success: false, error: 'Task not found' });

    const sql = `
      UPDATE tasks 
      SET title = ?, description = ?, due_date = ?, priority = ?, 
          status = ?, time_view = ?, updated_at = CURRENT_TIMESTAMP
      WHERE task_id = ?
    `;

    await db.runAsync(sql, [
      title || existingTask.title,
      description !== undefined ? description : existingTask.description,
      due_date || existingTask.due_date,
      priority || existingTask.priority,
      status || existingTask.status,
      time_view || existingTask.time_view,
      task_id
    ]);

    const updatedTask = await db.getAsync('SELECT * FROM tasks WHERE task_id = ?', [task_id]);
    return res.status(200).json({ success: true, message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    console.error('❌ Error updating task:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

module.exports = updateTask;
