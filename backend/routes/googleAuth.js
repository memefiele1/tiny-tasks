// backend/routes/googleAuth.js
//Author: Aliyah Adebisi

const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const router = express.Router();

// Configure strategy ONCE
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI, // http://localhost:5050/auth/google/callback
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        //pass the profile through (later: create/find user + store tokens)
        return done(null, { profile, accessToken, refreshToken });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Minimal serialize/deserialize for session support
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Step 1: send user to Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/calendar.readonly"],
    accessType: "offline",
    prompt: "consent",
  })
);

// Step 2: callback from Google
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google/failure" }),
  (req, res) => {
    res.json({
      message: "Google auth success",
      user: req.user?.profile,
    });
  }
);

router.get("/google/failure", (req, res) => {
  res.status(401).json({ message: "Google auth failed" });
});

module.exports = router;