import { cookie } from './auth.js';
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'set-cookie': cookie('', 0) } });
export default async function handler(request) { return json({ ok: true }); }
