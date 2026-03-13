// backend/api/tasks/reschedule.js
// Finds incomplete tasks that are past their due date and bumps their priority up.
// Priority scale: 1 = High, 2 = Medium, 3 = Low
// Rescheduling moves priority closer to 1 (more urgent)
// Author: Miracle Emefiele

const db = require('../../config/database');

/**
 * POST /api/tasks/reschedule/:user_id
 * Re-runs prioritization on all overdue incomplete tasks for a user.
 * Intended to be called on login or manually triggered.
 */
async function rescheduleTasks(req, res) {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'user_id is required' });
    }

    const today = new Date().toISOString().split('T')[0];

    // Find all incomplete tasks that are past their due date
    const overdueTasks = await db.allAsync(
      `SELECT * FROM tasks
       WHERE user_id = ?
         AND is_completed = 0
         AND DATE(due_date) < ?`,
      [user_id, today]
    );

    if (overdueTasks.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No overdue tasks to reschedule',
        rescheduled_count: 0,
        tasks: []
      });
    }

    const rescheduled = [];

    for (const task of overdueTasks) {
      // Bump priority up by 1 level — but floor at 1 (High), can't go higher
      const newPriority = Math.max(1, task.priority - 1);

      // Only update if priority actually changed
      if (newPriority !== task.priority) {
        await db.runAsync(
          `UPDATE tasks
           SET priority = ?, updated_at = CURRENT_TIMESTAMP
           WHERE task_id = ?`,
          [newPriority, task.task_id]
        );
      }

      const updatedTask = await db.getAsync(
        'SELECT * FROM tasks WHERE task_id = ?',
        [task.task_id]
      );

      rescheduled.push({
        task_id: updatedTask.task_id,
        title: updatedTask.title,
        due_date: updatedTask.due_date,
        old_priority: task.priority,
        new_priority: updatedTask.priority,
        priority_changed: newPriority !== task.priority
      });
    }

    const changed = rescheduled.filter(t => t.priority_changed).length;

    return res.status(200).json({
      success: true,
      message: `Rescheduled ${overdueTasks.length} overdue task(s). Priority updated for ${changed}.`,
      rescheduled_count: overdueTasks.length,
      priority_bumped: changed,
      tasks: rescheduled
    });

  } catch (error) {
    console.error('❌ Error rescheduling tasks:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

module.exports = rescheduleTasks;
