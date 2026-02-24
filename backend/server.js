// backend/server.js
// Express server for Tiny Tasks backend API
// Author: Miracle Emefiele

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/database');

const authRoutes = require('./routes/auth');
// Task routes
const createTask = require('./api/tasks/create');
const getTodayTasks = require('./api/tasks/getToday');
const getAllTasks = require('./api/tasks/getAll');
const updateTask = require('./api/tasks/update');
const deleteTask = require('./api/tasks/delete');
const completeTask = require('./api/tasks/complete');

// Archive routes
const getArchive = require('./api/archive/getArchive');
const { startCleanupJob } = require('./api/archive/cleanup');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use(express.urlencoded({ extended: true }));

// ── ROUTES ──────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Tiny Tasks API is running' });
});

// Task endpoints
app.post('/api/tasks', createTask);
app.get('/api/tasks/today/:user_id', getTodayTasks);
app.get('/api/tasks/user/:user_id', getAllTasks);
app.put('/api/tasks/:task_id', updateTask);
app.delete('/api/tasks/:task_id', deleteTask);
app.patch('/api/tasks/:task_id/complete', completeTask);

// Archive endpoints
app.get('/api/archive/:user_id', getArchive);

// ── START SERVER ─────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 TINY TASKS API SERVER STARTED');
  console.log(`   Port: ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log('   Task Endpoints:');
  console.log('   POST    /api/tasks');
  console.log('   GET     /api/tasks/today/:user_id');
  console.log('   GET     /api/tasks/user/:user_id');
  console.log('   PUT     /api/tasks/:task_id');
  console.log('   DELETE  /api/tasks/:task_id');
  console.log('   PATCH   /api/tasks/:task_id/complete');
  console.log('   Archive Endpoints:');
  console.log('   GET     /api/archive/:user_id');
  console.log('');

  // Start automatic archive cleanup job
  startCleanupJob();
});

module.exports = app;

