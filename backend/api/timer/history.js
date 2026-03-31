// backend/api/timer/history.js
// Returns all timer sessions for a user with total focus time stats
// Author: Miracle Emefiele

const db = require('../../config/database');

async function getTimerHistory(req, res) {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'user_id is required' });
    }

    // Get all timer sessions for this user, most recent first
    // Join with tasks to include task title if available
    const sessions = await db.allAsync(
      `SELECT
        tl.*,
        t.title as task_title
       FROM timer_logs tl
       LEFT JOIN tasks t ON tl.task_id = t.task_id
       WHERE tl.user_id = ?
       ORDER BY tl.created_at DESC`,
      [user_id]
    );

    // Calculate stats
    const completedSessions = sessions.filter(s => s.completed === 1);
    const totalFocusMinutes = completedSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    const totalFocusHours = Math.floor(totalFocusMinutes / 60);
    const remainingMinutes = totalFocusMinutes % 60;

    return res.status(200).json({
      success: true,
      stats: {
        total_sessions: sessions.length,
        completed_sessions: completedSessions.length,
        total_focus_minutes: totalFocusMinutes,
        total_focus_time: `${totalFocusHours}h ${remainingMinutes}m`
      },
      sessions
    });

  } catch (error) {
    console.error('❌ Error fetching timer history:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

module.exports = getTimerHistory;