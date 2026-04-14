const express = require("express");
const { google } = require("googleapis");

const router = express.Router();

function ensureGoogleAuth(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({
      message: "User is not authenticated with Google",
    });
  }

  if (!req.user || !req.user.accessToken) {
    return res.status(401).json({
      message: "Missing Google access token",
    });
  }

  next();
}

router.get("/test", (req, res) => {
  res.json({ message: "calendar router works" });
});

router.get("/events", ensureGoogleAuth, async (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: req.user.accessToken,
      refresh_token: req.user.refreshToken,
    });

    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });

    const timeMin = req.query.timeMin || new Date().toISOString();
    const timeMax =
      req.query.timeMax ||
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = (response.data.items || []).map((event) => ({
      id: event.id,
      title: event.summary || "Untitled Event",
      start: event.start?.dateTime || event.start?.date || null,
      end: event.end?.dateTime || event.end?.date || null,
    }));

    return res.json({
      message: "Calendar events fetched successfully",
      count: events.length,
      events,
    });
  } catch (err) {
    console.error("Calendar events error:", err);
    return res.status(500).json({
      message: "Failed to fetch calendar events",
      error: err.message,
    });
  }
});

router.get("/busy-blocks", ensureGoogleAuth, async (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: req.user.accessToken,
      refresh_token: req.user.refreshToken,
    });

    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });

    const timeMin = req.query.timeMin || new Date().toISOString();
    const timeMax =
      req.query.timeMax ||
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
    });

    const busyBlocks = (response.data.items || []).map((event) => ({
      title: event.summary || "Busy",
      start: event.start?.dateTime || event.start?.date || null,
      end: event.end?.dateTime || event.end?.date || null,
      status: "busy",
    }));

    return res.json({
      message: "Busy blocks fetched successfully",
      count: busyBlocks.length,
      busyBlocks,
    });
  } catch (err) {
    console.error("Busy blocks error:", err);
    return res.status(500).json({
      message: "Failed to fetch busy blocks",
      error: err.message,
    });
  }
});

module.exports = router;