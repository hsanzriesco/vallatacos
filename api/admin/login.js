import { createToken, cookie } from './auth.js';
const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...headers } });
export default async function handler(request) {
  if (request.method !== 'POST') return json({ error: 'Método no permitido.' }, 405);
  try {
    const { password } = await request.json();
    if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) return json({ error: 'Contraseña incorrecta.' }, 401);
    return json({ ok: true }, 200, { 'set-cookie': cookie(createToken()) });
  } catch { return json({ error: 'Solicitud no válida.' }, 400); }
}
