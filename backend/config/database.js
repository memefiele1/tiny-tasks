const fs = require('fs'); // used to import all sql queries
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// connect database to sql schema 
const dbSql = fs.readFileSync('../database/schema.sql').toString();

// create path to create database
const DB_PATH = path.resolve(__dirname, '../../tinytasks.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Connected to SQLite database:', DB_PATH);
    db.run('PRAGMA foreign_keys = ON;', (err) => {
      if (err) {
        console.error('❌ Error enabling foreign keys:', err.message);
      } else {
        console.log('✅ Foreign keys enabled');
      }
    });
  }
});

// run sql queries one at a time
db.serialize(() => {
  db.exec(dbSql, function(err) {
    if (err) console.error('Error creating tables');
    else console.log('Tables created successfully');
  });
});

db.runAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

db.getAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.allAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = db;
