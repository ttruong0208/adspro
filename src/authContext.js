import { AsyncLocalStorage } from 'async_hooks';

const storage = new AsyncLocalStorage();

function parseCookies(raw = '') {
  const out = {};
  const pairs = String(raw || '').split(';');
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx < 0) continue;
    const key = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    if (!key) continue;
    out[key] = decodeURIComponent(value);
  }
  return out;
}

function safeJsonParse(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function authContextMiddleware(req, _res, next) {
  const cookies = parseCookies(req.headers?.cookie || '');
  const profileRaw = cookies.fb_profile || '';
  const profile = safeJsonParse(profileRaw, null);

  storage.run(
    {
      userToken: cookies.fb_user_token || null,
      profile
    },
    next
  );
}

export function getAuthContext() {
  return storage.getStore() || {};
}

