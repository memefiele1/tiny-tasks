const db = require('../../config/database');

async function deleteTask(req, res) {
  try {
    const { task_id } = req.params;

    if (!task_id) return res.status(400).json({ success: false, error: 'task_id is required' });

    const existingTask = await db.getAsync('SELECT * FROM tasks WHERE task_id = ?', [task_id]);
    if (!existingTask) return res.status(404).json({ success: false, error: 'Task not found' });

    const deletedOn = new Date();
    deletedOn.setDate(deletedOn.getDate() + 30);

      await db.runAsync(`
    INSERT INTO archive (
      task_id,
      user_id,
      title,
      description,
      due_date,
      priority,
      date_completed,
      deleted_on
    )
    VALUES (?, ?, ?, ?, ?, ?, NULL, ?)
  `, [
    existingTask.task_id,
    existingTask.user_id,
    existingTask.title,
    existingTask.description,
    existingTask.due_date,
    existingTask.priority,
    deletedOn.toISOString()
  ]);

    await db.runAsync('DELETE FROM tasks WHERE task_id = ?', [task_id]);

    return res.status(200).json({ success: true, message: 'Task deleted and archived', archived_task: existingTask });
  } catch (error) {
    console.error('❌ Error deleting task:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

module.exports = deleteTask;
