import crypto from 'node:crypto';

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});

function env(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable ${name}`);
  return value;
}

function cleanText(value, max = 500) {
  return String(value ?? '').trim().slice(0, max);
}

function normalizeItems(items) {
  if (!Array.isArray(items) || !items.length || items.length > 50) throw new Error('El pedido no contiene productos válidos.');
  return items.map((item) => {
    const name = cleanText(item.name, 120);
    const quantity = Math.max(1, Math.min(99, Number(item.quantity) || 0));
    const price = Number(item.price);
    if (!name || !Number.isFinite(price) || price < 0 || !quantity) throw new Error('Hay un producto no válido.');
    return { name, quantity, price: Math.round(price * 100) / 100 };
  });
}

export default async function handler(request) {
  if (request.method !== 'POST') return json({ error: 'Método no permitido.' }, 405);
  try {
    const body = await request.json();
    const name = cleanText(body.name, 100);
    const phone = cleanText(body.phone, 40);
    const service = cleanText(body.service, 40);
    const address = cleanText(body.address, 300);
    const notes = cleanText(body.notes, 600);
    const items = normalizeItems(body.items);
    if (!name || !phone || !['Recoger en el local', 'A domicilio'].includes(service)) throw new Error('Completa los datos obligatorios.');
    if (service === 'A domicilio' && !address) throw new Error('Necesitamos la dirección de entrega.');

    const total = Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100;
    const supabaseUrl = env('SUPABASE_URL').replace(/\/$/, '');
    const key = env('SUPABASE_SERVICE_ROLE_KEY');
    const response = await fetch(`${supabaseUrl}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify({ customer_name: name, phone, service, address: service === 'A domicilio' ? address : null, notes: notes || null, items, total, status: 'nuevo' })
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error('Supabase order error', detail);
      return json({ error: 'No se ha podido guardar el pedido. Inténtalo de nuevo.' }, 500);
    }
    const [order] = await response.json();
    return json({ ok: true, order: { id: order.id, order_number: order.order_number, total: order.total } }, 201);
  } catch (error) {
    console.error(error);
    return json({ error: error.message || 'Error al crear el pedido.' }, 400);
  }
}
