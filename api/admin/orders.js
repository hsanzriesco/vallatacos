import { isAdmin } from './auth.js';
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
function supa(path, options = {}) {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase no está configurado.');
  return fetch(`${url}/rest/v1/${path}`, { ...options, headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(options.headers || {}) } });
}
export default async function handler(request) {
  if (!isAdmin(request)) return json({ error: 'No autorizado.' }, 401);
  try {
    if (request.method === 'GET') {
      const r = await supa('orders?select=*&order=created_at.desc&limit=200');
      if (!r.ok) throw new Error(await r.text());
      return json({ orders: await r.json() });
    }
    if (request.method === 'PATCH') {
      const body = await request.json();
      const id = String(body.id || '');
      const status = String(body.status || '');
      if (!id || !['nuevo', 'aceptado', 'preparando', 'listo', 'entregado', 'cancelado'].includes(status)) return json({ error: 'Datos no válidos.' }, 400);
      const r = await supa(`orders?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ status, updated_at: new Date().toISOString() }) });
      if (!r.ok) throw new Error(await r.text());
      return json({ ok: true, order: (await r.json())[0] });
    }
    return json({ error: 'Método no permitido.' }, 405);
  } catch (e) { console.error(e); return json({ error: 'Error del servidor.' }, 500); }
}
