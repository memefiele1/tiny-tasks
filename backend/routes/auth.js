// backend/routes/auth.js
//AUTHOR : Aliyah Adebisi
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../config/database");
const { google } = require("googleapis");

const router = express.Router();

// helpers
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (pw) => typeof pw === "string" && pw.length >= 6;
const validateUsername = (u) => typeof u === "string" && u.trim().length >= 2;

// --------------------------------------------------
// GOOGLE STRATEGY SETUP
// --------------------------------------------------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = {
          profile,
          accessToken,
          refreshToken,
        };

        return done(null, userData);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// --------------------------------------------------
// DEBUG TEST ROUTE
// --------------------------------------------------
router.get("/test", (req, res) => {
  res.send("AUTH ROUTE WORKS");
});

// --------------------------------------------------
// GOOGLE AUTH ROUTES
// --------------------------------------------------
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/calendar.readonly",
    ],
    accessType: "offline",
    prompt: "consent",
  })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("Google callback hit");
    console.log("Query params:", req.query);
    next();
  },
  passport.authenticate("google", { failureRedirect: "/auth/google/failure" }),
  (req, res) => {
    console.log("Google auth successful");

    res.json({
      message: "Google auth success",
      googleUser: req.user?.profile || null,
      hasAccessToken: !!req.user?.accessToken,
      hasRefreshToken: !!req.user?.refreshToken,
    });
  }
);

router.get("/google/status", (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.status(200).json({
      authenticated: true,
      googleUser: req.user?.profile || null,
      hasAccessToken: !!req.user?.accessToken,
      hasRefreshToken: !!req.user?.refreshToken,
    });
  }

  return res.status(401).json({
    authenticated: false,
    message: "User is not authenticated with Google",
  });
});

router.get("/google/failure", (req, res) => {
  return res.status(401).json({
    success: false,
    message: "Google authentication failed",
  });
});

// --------------------------------------------------
// REGISTER
// --------------------------------------------------
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

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

    const existing = await db.getAsync(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const existingUsername = await db.getAsync(
      "SELECT user_id FROM users WHERE username = ?",
      [username.trim()]
    );
    if (existingUsername) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

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

// --------------------------------------------------
// LOGIN
// --------------------------------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await db.getAsync(
      "SELECT user_id, username, email, password_hash FROM users WHERE email = ?",
      [email.trim().toLowerCase()]
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET missing in .env" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

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

