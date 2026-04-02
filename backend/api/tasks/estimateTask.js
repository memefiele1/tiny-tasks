// Estimates how long a task will take to complete based on priority,
// description length, and status. Also flags tasks where estimated
// time exceeds time remaining until due date.
// Author: Miracle Emefiele

const db = require('../../config/database');

// Base time estimates in minutes by priority
// High priority tasks tend to be more complex
const BASE_ESTIMATES = {
  1: 90,  // High   → ~90 min base
  2: 45,  // Medium → ~45 min base
  3: 20,  // Low    → ~20 min base
};

// Status multipliers — in progress tasks need less time than not started
const STATUS_MULTIPLIERS = {
  'Not Started': 1.0,
  'In Progress': 0.5,
  'Completed':   0.0,
};

/**
 * Estimates completion time for a single task object
 * Returns estimate in minutes + a flag if time is insufficient
 */
function estimateCompletionTime(task) {
  const base = BASE_ESTIMATES[task.priority] || 45;
  const statusMultiplier = STATUS_MULTIPLIERS[task.status] ?? 1.0;

  // Add extra time based on description length (longer = more complex)
  // Every 100 characters adds ~5 minutes
  const descriptionLength = task.description ? task.description.length : 0;
  const descriptionBonus = Math.floor(descriptionLength / 100) * 5;

  const estimatedMinutes = Math.round((base + descriptionBonus) * statusMultiplier);

  // Calculate how many minutes are left until due date
  const now = new Date();
  const due = new Date(task.due_date);
  const minutesUntilDue = Math.round((due - now) / (1000 * 60));

  // Edge case: estimated time exceeds time remaining
  const isTimeInsufficient = estimatedMinutes > minutesUntilDue && minutesUntilDue > 0;

  // Edge case: task is already overdue
  const isOverdue = minutesUntilDue <= 0;

  return {
    estimated_minutes: estimatedMinutes,
    estimated_label: formatEstimate(estimatedMinutes),
    minutes_until_due: minutesUntilDue,
    is_overdue: isOverdue,
    is_time_insufficient: isTimeInsufficient,
    warning: isOverdue
      ? 'Task is overdue!'
      : isTimeInsufficient
        ? `Only ${formatEstimate(minutesUntilDue)} left but task may take ${formatEstimate(estimatedMinutes)}`
        : null
  };
}

/**
 * Formats minutes into a human readable string
 * e.g. 90 → "1h 30m", 45 → "45m"
 */
function formatEstimate(minutes) {
  if (minutes <= 0) return '0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * API endpoint — estimates a single task by task_id
 * GET /api/tasks/:task_id/estimate
 */
async function estimateTask(req, res) {
  try {
    const { task_id } = req.params;

    if (!task_id) {
      return res.status(400).json({ success: false, error: 'task_id is required' });
    }

    const task = await db.getAsync('SELECT * FROM tasks WHERE task_id = ?', [task_id]);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const estimation = estimateCompletionTime(task);

    return res.status(200).json({
      success: true,
      task_id: task.task_id,
      title: task.title,
      due_date: task.due_date,
      estimation
    });

  } catch (error) {
    console.error('❌ Error estimating task:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

module.exports = { estimateTask, estimateCompletionTime };

