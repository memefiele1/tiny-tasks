// backend/api/tasks/setViewPreference.js
// Saves and retrieves the user's Daily vs Half-Day view preference
// Stored in the user_preferences table (half_day_default column)
// Author: Miracle Emefiele

const db = require('../../config/database');

async function setViewPreference(req, res) {
  try {
    const { user_id } = req.params;
    const { half_day_default } = req.body;
    // half_day_default: 0 = full day view, 1 = half day view

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'user_id is required' });
    }
    if (half_day_default === undefined) {
      return res.status(400).json({ success: false, error: 'half_day_default is required (0 or 1)' });
    }

    // Check if preferences row already exists for this user
    const existing = await db.getAsync(
      'SELECT pref_id FROM user_preferences WHERE user_id = ?',
      [user_id]
    );

    if (existing) {
      // Update existing preference
      await db.runAsync(
        'UPDATE user_preferences SET half_day_default = ? WHERE user_id = ?',
        [half_day_default ? 1 : 0, user_id]
      );
    } else {
      // Insert new preference row for this user
      await db.runAsync(
        'INSERT INTO user_preferences (user_id, half_day_default) VALUES (?, ?)',
        [user_id, half_day_default ? 1 : 0]
      );
    }

    const updated = await db.getAsync(
      'SELECT * FROM user_preferences WHERE user_id = ?',
      [user_id]
    );

    return res.status(200).json({
      success: true,
      message: 'View preference saved',
      preferences: updated
    });

  } catch (error) {
    console.error('❌ Error saving view preference:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

async function getViewPreference(req, res) {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'user_id is required' });
    }

    const prefs = await db.getAsync(
      'SELECT * FROM user_preferences WHERE user_id = ?',
      [user_id]
    );

    // If no preferences saved yet, return defaults
    if (!prefs) {
      return res.status(200).json({
        success: true,
        preferences: { user_id: parseInt(user_id), half_day_default: 0, focus_interval: 25, color_theme: 'light', sync_enabled: 1 }
      });
    }

    return res.status(200).json({ success: true, preferences: prefs });

  } catch (error) {
    console.error('❌ Error fetching view preference:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

module.exports = { setViewPreference, getViewPreference };