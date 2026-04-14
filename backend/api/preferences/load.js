// Aliyah 

const db = require('../../config/database');

const DEFAULT_PREFERENCES = {
  color_theme: 'light',
  focus_interval: 25,
  half_day_default: 0,
  sync_enabled: 1,
};

module.exports = (req, res) => {
  try {
    const { user_id } = req.params;

    if (!Number.isInteger(Number(user_id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user_id',
      });
    }

    db.get(
      `SELECT user_id, color_theme, focus_interval, half_day_default, sync_enabled
       FROM user_preferences
       WHERE user_id = ?`,
      [user_id],
      (err, row) => {
        if (err) {
          console.error('Error loading preferences:', err.message);
          return res.status(500).json({
            success: false,
            message: 'Failed to load preferences',
          });
        }

        return res.status(200).json({
          success: true,
          preferences: row || {
            user_id: Number(user_id),
            ...DEFAULT_PREFERENCES,
          },
        });
      }
    );
  } catch (error) {
    console.error('Unexpected error in load preferences:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unexpected server error',
    });
  }
};