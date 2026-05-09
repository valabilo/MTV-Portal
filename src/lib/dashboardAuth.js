import crypto from "crypto";

export const DASHBOARD_SESSION_COOKIE = "mtv_dashboard_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

function getAuthSecret() {
  return (
    process.env.DASHBOARD_AUTH_SECRET ||
    process.env.DASHBOARD_PASSWORD ||
    ""
  ).trim();
}

export function getDashboardCredentials() {
  return {
    username: (process.env.DASHBOARD_USERNAME || "").trim(),
    password: (process.env.DASHBOARD_PASSWORD || "").trim(),
  };
}

function sign(value) {
  const secret = getAuthSecret();
  if (!secret) return "";

  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function credentialsAreConfigured() {
  const { username, password } = getDashboardCredentials();
  return Boolean(username && password && getAuthSecret());
}

export function validateDashboardCredentials(username, password) {
  const configured = getDashboardCredentials();
  if (!credentialsAreConfigured()) return false;

  return (
    safeEqual(String(username || ""), configured.username) &&
    safeEqual(String(password || ""), configured.password)
  );
}

export function createDashboardSession(username = "") {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const sessionId = crypto.randomUUID();
  const normalizedUsername = String(username || "Dashboard user").trim();
  const encodedUsername = Buffer.from(normalizedUsername).toString("base64url");
  const payload = `dashboard:${expiresAt}:${encodedUsername}:${sessionId}`;
  const signature = sign(payload);

  return {
    value: `${expiresAt}.${encodedUsername}.${sessionId}.${signature}`,
    expiresAt,
  };
}

export function getDashboardSession(value) {
  if (!value || !credentialsAreConfigured()) return false;

  const parts = String(value).split(".");
  const [expiresAt, encodedUsername, sessionId, signature] =
    parts.length === 4 ? parts : [parts[0], "", "", parts[1]];
  const expiresNumber = Number(expiresAt);

  if (!expiresAt || !signature || !Number.isFinite(expiresNumber)) return false;
  if (expiresNumber <= Date.now()) return false;

  const payload = parts.length === 4
    ? `dashboard:${expiresAt}:${encodedUsername}:${sessionId}`
    : `dashboard:${expiresAt}`;

  if (!safeEqual(signature, sign(payload))) return false;

  let username = "Dashboard user";
  if (encodedUsername) {
    try {
      username = Buffer.from(encodedUsername, "base64url").toString("utf8");
    } catch {
      username = "Dashboard user";
    }
  }

  return { username, sessionId: sessionId || "legacy", expiresAt: expiresNumber };
}

export function verifyDashboardSession(value) {
  return Boolean(getDashboardSession(value));
}

export function requestHasDashboardSession(request) {
  return verifyDashboardSession(
    request.cookies.get(DASHBOARD_SESSION_COOKIE)?.value,
  );
}

export function getDashboardSessionFromRequest(request) {
  return getDashboardSession(request.cookies.get(DASHBOARD_SESSION_COOKIE)?.value);
}
