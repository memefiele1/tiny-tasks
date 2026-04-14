const db = require('../../config/database');

const DEFAULT_PREFERENCES = {
  theme: 'light',
  default_view: 'today',
  focus_interval: 25,
};

const ALLOWED_THEMES = ['light', 'dark'];
const ALLOWED_VIEWS = ['today', 'all', 'upcoming'];

module.exports = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { theme, default_view, focus_interval } = req.body;

    const finalTheme = theme ?? DEFAULT_PREFERENCES.theme;
    const finalView = default_view ?? DEFAULT_PREFERENCES.default_view;
    const finalFocus =
      focus_interval !== undefined
        ? Number(focus_interval)
        : DEFAULT_PREFERENCES.focus_interval;

    if (!ALLOWED_THEMES.includes(finalTheme)) {
      return res.status(400).json({ error: 'Invalid theme value' });
    }

    if (!ALLOWED_VIEWS.includes(finalView)) {
      return res.status(400).json({ error: 'Invalid default_view value' });
    }

    if (!Number.isInteger(finalFocus) || finalFocus < 1 || finalFocus > 180) {
      return res.status(400).json({ error: 'focus_interval must be between 1 and 180' });
    }

    db.get(
      `SELECT * FROM user_preferences WHERE user_id = ?`,
      [user_id],
      (selectErr, row) => {
        if (selectErr) {
          return res.status(500).json({ error: 'Failed to check preferences' });
        }

        if (row) {
          db.run(
            `UPDATE user_preferences
             SET theme = ?, default_view = ?, focus_interval = ?
             WHERE user_id = ?`,
            [finalTheme, finalView, finalFocus, user_id],
            function (updateErr) {
              if (updateErr) {
                return res.status(500).json({ error: 'Failed to update preferences' });
              }

              return res.status(200).json({
                message: 'Preferences updated successfully',
                preferences: {
                  theme: finalTheme,
                  default_view: finalView,
                  focus_interval: finalFocus,
                },
              });
            }
          );
        } else {
          db.run(
            `INSERT INTO user_preferences (user_id, theme, default_view, focus_interval)
             VALUES (?, ?, ?, ?)`,
            [user_id, finalTheme, finalView, finalFocus],
            function (insertErr) {
              if (insertErr) {
                return res.status(500).json({ error: 'Failed to save preferences' });
              }

              return res.status(201).json({
                message: 'Preferences saved successfully',
                preferences: {
                  theme: finalTheme,
                  default_view: finalView,
                  focus_interval: finalFocus,
                },
              });
            }
          );
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ error: 'Unexpected server error' });
  }
};