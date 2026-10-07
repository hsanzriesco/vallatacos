import crypto from 'node:crypto';

export function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error('Falta SESSION_SECRET');
  return value;
}

function sign(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('base64url');
}

export function createToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 1000 * 60 * 60 * 12, role: 'admin' })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function validToken(token) {
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(sign(payload)))) return false;
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
  return data.role === 'admin' && data.exp > Date.now();
}

export function isAdmin(request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/valla_admin=([^;]+)/);
  return validToken(match?.[1]);
}

export function cookie(token, maxAge = 43200) {
  return `valla_admin=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}
