const db = require('../../config/database');

async function completeTask(req, res) {
  try {
    const { task_id } = req.params;

    if (!task_id) return res.status(400).json({ success: false, error: 'task_id is required' });

    const existingTask = await db.getAsync('SELECT * FROM tasks WHERE task_id = ?', [task_id]);
    if (!existingTask) return res.status(404).json({ success: false, error: 'Task not found' });
    if (existingTask.is_completed === 1) return res.status(400).json({ success: false, error: 'Task already completed' });

        await db.runAsync(`
          UPDATE tasks 
          SET is_completed = 1, status = 'Completed', 
              completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
          WHERE task_id = ?
        `, [task_id]);

        const deletedOn = new Date();
        deletedOn.setDate(deletedOn.getDate() + 30);
        console.log(deletedOn);

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
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, NULL)
    `, [
      existingTask.task_id,
      existingTask.user_id,
      existingTask.title,
      existingTask.description,
      existingTask.due_date,
      existingTask.priority,
      existingTask.deletedOn
    ]);

    const completedTask = await db.getAsync('SELECT * FROM tasks WHERE task_id = ?', [task_id]);
    return res.status(200).json({ success: true, message: 'Task marked as completed!', task: completedTask });
  } catch (error) {
    console.error('❌ Error completing task:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

module.exports = completeTask;
