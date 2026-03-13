// backend/routes/googleAuth.js
// Author: Aliyah Adebisi
const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const router = express.Router();

// Only initialize Google strategy if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URI,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          return done(null, { profile, accessToken, refreshToken });
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

// Minimal serialize/deserialize for session support
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Step 1: send user to Google
router.get("/google", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(503).json({ message: "Google auth not configured yet" });
  }
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/calendar.readonly"],
    accessType: "offline",
    prompt: "consent",
  })(req, res, next);
});

// Step 2: callback from Google
router.get("/google/callback", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(503).json({ message: "Google auth not configured yet" });
  }
  passport.authenticate("google", { failureRedirect: "/auth/google/failure" })(req, res, next);
}, (req, res) => {
  res.json({ message: "Google auth success", user: req.user?.profile });
});

router.get("/google/failure", (req, res) => {
  res.status(401).json({ message: "Google auth failed" });
});

module.exports = router;