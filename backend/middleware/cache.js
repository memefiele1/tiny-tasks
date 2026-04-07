// backend/middleware/cache.js
// Simple in-memory cache for API responses
// Cache expires after 5 minutes
// Author: Miracle Emefiele

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in ms

function setCache(key, data) {
  cache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL
  });
}

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function clearCache(key) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

// Middleware factory — caches responses by key
function cacheMiddleware(keyFn) {
  return (req, res, next) => {
    const key = keyFn(req);
    const cached = getCache(key);
    if (cached) {
      return res.status(200).json({ ...cached, cached: true });
    }
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (res.statusCode === 200) {
        setCache(key, data);
      }
      return originalJson(data);
    };
    next();
  };
}

module.exports = { setCache, getCache, clearCache, cacheMiddleware };
