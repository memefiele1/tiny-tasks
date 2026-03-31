// backend/api/tasks/getFiltered.js
// Returns tasks sorted by urgency score with visibility filtering
// Urgency score formula: (priority_weight * 10) - days_until_due
// Author: Miracle Emefiele


const db = require('../../config/database');
const { estimateCompletionTime } = require('./estimateTask');

// Priority weights — higher number = more urgent
// In your schema: priority 1 = High, 2 = Medium, 3 = Low
const PRIORITY_WEIGHTS = { 1: 3, 2: 2, 3: 1 };

// Only show tasks with urgency score above this threshold
const VISIBILITY_THRESHOLD = -7;

function calculateUrgencyScore(priority, due_date) {
  const now = new Date();
  const due = new Date(due_date);
  const daysUntilDue = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  const priorityWeight = PRIORITY_WEIGHTS[priority] || 2;
  return (priorityWeight * 10) - daysUntilDue;
}

async function getFilteredTasks(req, res) {
  try {
    const { user_id } = req.params;
    const { date, view } = req.query;

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'user_id is required' });
    }

    const targetDate = date || new Date().toISOString().split('T')[0];

    let sql = `
      SELECT * FROM tasks
      WHERE user_id = ?
        AND is_completed = 0
    `;
    const params = [user_id];

    if (view === 'morning') {
      sql += ` AND DATE(due_date) = ? AND strftime('%H', due_date) < '12'`;
      params.push(targetDate);
    } else if (view === 'afternoon') {
      sql += ` AND DATE(due_date) = ? AND strftime('%H', due_date) >= '12'`;
      params.push(targetDate);
    } else {
      sql += ` AND DATE(due_date) <= ?`;
      params.push(targetDate);
    }

    const tasks = await db.allAsync(sql, params);

    // Calculate urgency score AND estimation for each task
    const scoredTasks = tasks.map(task => {
      const urgency_score = calculateUrgencyScore(task.priority, task.due_date);
      const estimation = estimateCompletionTime(task);
      return { ...task, urgency_score, estimation };
    });

    // Filter out tasks below visibility threshold
    const visibleTasks = scoredTasks.filter(task => task.urgency_score > VISIBILITY_THRESHOLD);

    // Sort by urgency score descending, break ties with oldest created_at first
    visibleTasks.sort((a, b) => {
      if (b.urgency_score !== a.urgency_score) return b.urgency_score - a.urgency_score;
      return new Date(a.created_at) - new Date(b.created_at);
    });

    const warnings = visibleTasks.filter(t => t.estimation.warning).length;

    return res.status(200).json({
      success: true,
      view: view || 'full',
      date: targetDate,
      count: visibleTasks.length,
      warnings,
      tasks: visibleTasks
    });

  } catch (error) {
    console.error('❌ Error fetching filtered tasks:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

module.exports = getFilteredTasks;