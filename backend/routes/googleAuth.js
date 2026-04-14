// backend/routes/googleAuth.js
// Author: Aliyah Adebisi

const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const router = express.Router();

// 🔹 Check env variables
if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.GOOGLE_REDIRECT_URI
) {
  console.warn("Missing Google OAuth environment variables in .env");
}

// Configure Google Strategy
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

// Session handling
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Start Google login
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

// Google callback
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

// Check auth status
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

// Failure route (fixes missing route issue)
router.get("/google/failure", (req, res) => {
  return res.status(401).json({
    success: false,
    message: "Google authentication failed",
  });
});

module.exports = router;