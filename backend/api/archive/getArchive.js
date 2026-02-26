// backend/api/archive/getArchive.js
// GET archived tasks for a user
// Route: GET /api/archive/:user_id
// Author: Miracle Emefiele

const db = require('../../config/database');

async function getArchive(req, res) {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'user_id is required' });
    }

    const tasks = await db.allAsync(`
      SELECT * FROM archive
      WHERE user_id = ?
      ORDER BY date_completed DESC
    `, [user_id]);

    return res.status(200).json({
      success: true,
      count: tasks.length,
      archived_tasks: tasks
    });

  } catch (error) {
    console.error('❌ Error fetching archive:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

module.exports = getArchive;

