-- TINY TASKS DATABASE SCHEMA
-- Run this in DBeaver to create all tables
-- Author: Miracle Emefiele

-- create table in database
CREATE TABLE IF NOT EXISTS users (
  user_id        INTEGER PRIMARY KEY AUTOINCREMENT,
  username       TEXT    UNIQUE NOT NULL,
  email          TEXT    UNIQUE NOT NULL,
  password_hash  TEXT    NOT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
  task_id       INTEGER   PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER   NOT NULL,
  title         TEXT      NOT NULL,
  description   TEXT,
  due_date      TIMESTAMP NOT NULL,
  priority      INTEGER   NOT NULL DEFAULT 2,
  status        TEXT      NOT NULL DEFAULT 'Not Started',
  time_view     TEXT      DEFAULT 'full',
  is_completed  INTEGER   NOT NULL DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at  TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS archive (
  archive_id     INTEGER   PRIMARY KEY AUTOINCREMENT,
  task_id        INTEGER   NOT NULL,
  user_id        INTEGER   NOT NULL,
  title          TEXT      NOT NULL,
  description    TEXT,
  due_date       TIMESTAMP,
  priority       INTEGER,
  date_completed TIMESTAMP NOT NULL,
  deleted_on     TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_preferences (
  pref_id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id          INTEGER UNIQUE NOT NULL,
  color_theme      TEXT    NOT NULL DEFAULT 'light',
  focus_interval   INTEGER NOT NULL DEFAULT 25,
  half_day_default INTEGER NOT NULL DEFAULT 0,
  sync_enabled     INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sync_queue (
  sync_id           INTEGER   PRIMARY KEY AUTOINCREMENT,
  user_id           INTEGER   NOT NULL,
  task_id           INTEGER,
  calendar_event_id TEXT,
  operation         TEXT      NOT NULL,
  resource          TEXT      NOT NULL DEFAULT 'tasks',
  data              TEXT,
  sync_status       TEXT      NOT NULL DEFAULT 'pending',
  retry_count       INTEGER   NOT NULL DEFAULT 0,
  last_attempt      TIMESTAMP,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS timer_logs (
  timer_id         INTEGER   PRIMARY KEY AUTOINCREMENT,
  user_id          INTEGER   NOT NULL,
  task_id          INTEGER,
  start_time       TIMESTAMP NOT NULL,
  end_time         TIMESTAMP,
  duration_minutes INTEGER,
  completed        INTEGER   NOT NULL DEFAULT 0,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE SET NULL
);


