// backend/api/archive/restore.js
// Restores a task from Archive back to Tasks table
// Author: Miracle Emefiele

const db = require('../../config/database');

async function restoreTask(req, res) {
  try {
    const { archive_id } = req.params;

    const archived = await db.getAsync(
      'SELECT * FROM archive WHERE archive_id = ?',
      [archive_id]
    );

    if (!archived) {
      return res.status(404).json({ success: false, error: 'Archived task not found' });
    }

    await db.runAsync(
      `INSERT INTO tasks (user_id, title, description, due_date, priority, status, time_view, is_completed)
       VALUES (?, ?, ?, ?, ?, 'Not Started', 'full', 0)`,
      [archived.user_id, archived.title, archived.description, archived.due_date, archived.priority]
    );

    await db.runAsync('DELETE FROM archive WHERE archive_id = ?', [archive_id]);

    return res.status(200).json({
      success: true,
      message: 'Task restored successfully',
      task: {
        title: archived.title,
        user_id: archived.user_id,
        status: 'Not Started'
      }
    });

  } catch (error) {
    console.error('❌ Error restoring task:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

module.exports = restoreTask;
