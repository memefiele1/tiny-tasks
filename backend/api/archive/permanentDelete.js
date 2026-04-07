// backend/api/archive/permanentDelete.js
// Permanently deletes a task from Archive — cannot be undone
// Author: Miracle Emefiele

const db = require('../../config/database');

async function permanentDelete(req, res) {
  try {
    const { archive_id } = req.params;

    const archived = await db.getAsync(
      'SELECT * FROM archive WHERE archive_id = ?',
      [archive_id]
    );

    if (!archived) {
      return res.status(404).json({ success: false, error: 'Archived task not found' });
    }

    await db.runAsync('DELETE FROM archive WHERE archive_id = ?', [archive_id]);

    return res.status(200).json({
      success: true,
      message: 'Task permanently deleted',
      deleted: { archive_id, title: archived.title }
    });

  } catch (error) {
    console.error('❌ Error permanently deleting task:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

module.exports = permanentDelete;
