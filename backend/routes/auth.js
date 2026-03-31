// backend/routes/auth.js
//AUTHOR : Aliyah Adebisi

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

const router = express.Router();

// helpers
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (pw) => typeof pw === "string" && pw.length >= 6;
const validateUsername = (u) => typeof u === "string" && u.trim().length >= 2;

/**
 * POST /auth/register
 * body: { username, email, password }
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1) validate
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }
    if (!validateUsername(username)) {
      return res.status(400).json({ message: "Username must be at least 2 characters" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // 2) check existing user (by email)
    const existing = await db.getAsync(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    // (optional but good) check existing username
    const existingUsername = await db.getAsync(
      "SELECT user_id FROM users WHERE username = ?",
      [username.trim()]
    );
    if (existingUsername) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // 3) hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4) insert ✅ fixed placeholders + params
    const result = await db.runAsync(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username.trim(), email.trim().toLowerCase(), passwordHash]
    );

    return res.status(201).json({
      message: "User registered successfully",
      userId: result.lastID,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /auth/login
 * body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 1) find user
    const user = await db.getAsync(
      "SELECT user_id, username, email, password_hash FROM users WHERE email = ?",
      [email.trim().toLowerCase()]
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2) compare password
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3) token
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET missing in .env" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4) return
    return res.json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
