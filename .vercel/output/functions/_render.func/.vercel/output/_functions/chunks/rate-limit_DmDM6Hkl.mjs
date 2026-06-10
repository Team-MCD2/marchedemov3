const cache = /* @__PURE__ */ new Map();
if (globalThis && !globalThis.__rateLimitInterval) {
  globalThis.__rateLimitInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
      if (now > value.resetTime) {
        cache.delete(key);
      }
    }
  }, 5 * 60 * 1e3);
}
function isRateLimited(ip, limit = 5, windowMs = 6e4) {
  const now = Date.now();
  const key = ip;
  let record = cache.get(key);
  if (!record || now > record.resetTime) {
    record = {
      count: 0,
      resetTime: now + windowMs
    };
  }
  record.count++;
  cache.set(key, record);
  const limited = record.count > limit;
  const remaining = Math.max(0, limit - record.count);
  return {
    limited,
    remaining,
    reset: Math.ceil((record.resetTime - now) / 1e3)
  };
}

export { isRateLimited as i };
