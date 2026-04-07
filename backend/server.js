// backend/server.js
// Express server for Tiny Tasks backend API
// Author: Miracle Emefiele

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/database');
const authRoutes = require('./routes/auth');

// ── TASK ROUTES ───────────────────────────────────
const createTask = require('./api/tasks/create');
const getTodayTasks = require('./api/tasks/getToday');
const getAllTasks = require('./api/tasks/getAll');
const updateTask = require('./api/tasks/update');
const deleteTask = require('./api/tasks/delete');
const completeTask = require('./api/tasks/complete');

// Sprint 2 task routes
const getMorningTasks = require('./api/tasks/getMorning');
const getAfternoonTasks = require('./api/tasks/getAfternoon');
const getFilteredTasks = require('./api/tasks/getFiltered');
const { setViewPreference, getViewPreference } = require('./api/tasks/setViewPreference');
const { estimateTask } = require('./api/tasks/estimateTask');
const rescheduleTasks = require('./api/tasks/reschedule');

// ── TIMER ROUTES ──────────────────────────────────
const startTimer = require('./api/timer/start');
const completeTimer = require('./api/timer/complete');
const getTimerHistory = require('./api/timer/history');

// ── ARCHIVE ROUTES ────────────────────────────────
const getArchive = require('./api/archive/getArchive');
const restoreTask = require('./api/archive/restore');
const permanentDelete = require('./api/archive/permanentDelete');
const { startCleanupJob } = require('./api/archive/cleanup');

// ── SYNC ROUTES ───────────────────────────────────
const { getNetworkStatus } = require('./api/sync/offlineDetection');
const { addToQueue, getPendingQueue } = require('./api/sync/syncQueue');
const { runAutoSync } = require('./api/sync/autoSync');

// ── CACHE MIDDLEWARE ──────────────────────────────
const { cacheMiddleware } = require('./middleware/cache');

// ── GOOGLE AUTH ───────────────────────────────────
const session = require('express-session');
const passport = require('passport');
const googleAuthRoutes = require('./routes/googleAuth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.JWT_SECRET || 'dev_session_secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
// app.use('/auth', googleAuthRoutes);
app.use('/auth', authRoutes);

// ── HEALTH ────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Tiny Tasks API is running' });
});

// ── TASK ENDPOINTS ────────────────────────────────
app.post('/api/tasks', createTask);
app.get('/api/tasks/today/:user_id', cacheMiddleware(req => `today_${req.params.user_id}`), getTodayTasks);
app.get('/api/tasks/user/:user_id', getAllTasks);
app.get('/api/tasks/morning/:user_id', getMorningTasks);
app.get('/api/tasks/afternoon/:user_id', getAfternoonTasks);
app.get('/api/tasks/filtered/:user_id', getFilteredTasks);
app.get('/api/tasks/:task_id/estimate', estimateTask);
app.put('/api/tasks/:task_id', updateTask);
app.delete('/api/tasks/:task_id', deleteTask);
app.patch('/api/tasks/:task_id/complete', completeTask);
app.post('/api/tasks/reschedule/:user_id', rescheduleTasks);

// ── PREFERENCE ENDPOINTS ──────────────────────────
app.get('/api/preferences/:user_id', getViewPreference);
app.put('/api/preferences/:user_id', setViewPreference);

// ── TIMER ENDPOINTS ───────────────────────────────
app.post('/api/timer/start', startTimer);
app.patch('/api/timer/:timer_id/complete', completeTimer);
app.get('/api/timer/history/:user_id', getTimerHistory);

// ── ARCHIVE ENDPOINTS ─────────────────────────────
app.get('/api/archive/:user_id', getArchive);
app.post('/api/archive/:archive_id/restore', restoreTask);
app.delete('/api/archive/:archive_id', permanentDelete);

// ── SYNC ENDPOINTS ────────────────────────────────
app.get('/api/sync/status', getNetworkStatus);
app.post('/api/sync/queue', addToQueue);
app.get('/api/sync/queue/:user_id', getPendingQueue);
app.post('/api/sync/run/:user_id', runAutoSync);

// ── START SERVER ──────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 TINY TASKS API SERVER STARTED');
  console.log(`   Port: ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log('');
  console.log('   Task Endpoints:');
  console.log('   POST    /api/tasks');
  console.log('   GET     /api/tasks/today/:user_id  [CACHED 5min]');
  console.log('   GET     /api/tasks/user/:user_id');
  console.log('   GET     /api/tasks/morning/:user_id');
  console.log('   GET     /api/tasks/afternoon/:user_id');
  console.log('   GET     /api/tasks/filtered/:user_id');
  console.log('   GET     /api/tasks/:task_id/estimate');
  console.log('   PUT     /api/tasks/:task_id');
  console.log('   DELETE  /api/tasks/:task_id');
  console.log('   PATCH   /api/tasks/:task_id/complete');
  console.log('   POST    /api/tasks/reschedule/:user_id');
  console.log('');
  console.log('   Preference Endpoints:');
  console.log('   GET     /api/preferences/:user_id');
  console.log('   PUT     /api/preferences/:user_id');
  console.log('');
  console.log('   Timer Endpoints:');
  console.log('   POST    /api/timer/start');
  console.log('   PATCH   /api/timer/:timer_id/complete');
  console.log('   GET     /api/timer/history/:user_id');
  console.log('');
  console.log('   Archive Endpoints:');
  console.log('   GET     /api/archive/:user_id');
  console.log('   POST    /api/archive/:archive_id/restore');
  console.log('   DELETE  /api/archive/:archive_id');
  console.log('');
  console.log('   Sync Endpoints:');
  console.log('   GET     /api/sync/status');
  console.log('   POST    /api/sync/queue');
  console.log('   GET     /api/sync/queue/:user_id');
  console.log('   POST    /api/sync/run/:user_id');

  startCleanupJob();
});

module.exports = app;
