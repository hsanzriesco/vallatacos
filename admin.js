const loginView = document.querySelector('#loginView');
const dashboardView = document.querySelector('#dashboardView');
const loginForm = document.querySelector('#loginForm');
const loginError = document.querySelector('#loginError');
const ordersEl = document.querySelector('#orders');
const emptyEl = document.querySelector('#empty');
const lastUpdated = document.querySelector('#lastUpdated');
const stats = { new: document.querySelector('#statNew'), prep: document.querySelector('#statPrep'), sales: document.querySelector('#statSales') };
let timer;
const euro = n => `${Number(n).toFixed(2).replace('.', ',')} €`;
const escapeHtml = v => String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const date = v => new Intl.DateTimeFormat('es-ES',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(v));

async function loadOrders() {
  const r = await fetch('/api/admin/orders', { cache:'no-store' });
  if (r.status === 401) { showLogin(); return false; }
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || 'Error');
  render(data.orders || []);
}
function showDashboard(){ loginView.classList.add('hidden'); dashboardView.classList.remove('hidden'); loadOrders(); clearInterval(timer); timer=setInterval(loadOrders, 10000); }
function showLogin(){ dashboardView.classList.add('hidden'); loginView.classList.remove('hidden'); clearInterval(timer); }
function render(orders){
  const today = new Date().toDateString();
  const newCount = orders.filter(o=>o.status==='nuevo').length;
  const prepCount = orders.filter(o=>['aceptado','preparando'].includes(o.status)).length;
  const sales = orders.filter(o=>new Date(o.created_at).toDateString()===today && o.status!=='cancelado').reduce((s,o)=>s+Number(o.total),0);
  stats.new.textContent=newCount; stats.prep.textContent=prepCount; stats.sales.textContent=euro(sales); lastUpdated.textContent=`Última actualización: ${new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}`;
  emptyEl.classList.toggle('hidden', orders.length>0); ordersEl.innerHTML=orders.map(orderCard).join('');
}
function orderCard(o){
  const items=(o.items||[]).map(i=>`<li><b>${i.quantity}×</b> ${escapeHtml(i.name)} <span>${euro(Number(i.price)*Number(i.quantity))}</span></li>`).join('');
  const statusOptions=['nuevo','aceptado','preparando','listo','entregado','cancelado'].map(s=>`<option value="${s}" ${o.status===s?'selected':''}>${s}</option>`).join('');
  return `<article class="order-card ${o.status}"><div class="order-top"><div><span class="order-number">#${o.order_number}</span><span class="order-date">${date(o.created_at)}</span></div><select data-status="${o.id}">${statusOptions}</select></div><div class="customer"><strong>${escapeHtml(o.customer_name)}</strong><a href="tel:${escapeHtml(o.phone)}">${escapeHtml(o.phone)}</a><span>${escapeHtml(o.service)}${o.address?` · ${escapeHtml(o.address)}`:''}</span></div><ul>${items}</ul><div class="order-bottom"><div>${o.notes?`<strong>Nota:</strong> ${escapeHtml(o.notes)}`:''}</div><strong>${euro(o.total)}</strong></div></article>`;
}
async function updateStatus(id,status){
  const r=await fetch('/api/admin/orders',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status})});
  if(!r.ok){alert('No se pudo actualizar el pedido.'); loadOrders();}
  else loadOrders();
}
loginForm.addEventListener('submit', async e=>{e.preventDefault();loginError.textContent='';const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:document.querySelector('#password').value})});const d=await r.json();if(!r.ok){loginError.textContent=d.error||'No autorizado.';return;}showDashboard();});
document.querySelector('#logoutBtn').addEventListener('click',async()=>{await fetch('/api/admin/logout',{method:'POST'});showLogin();});
document.querySelector('#refreshBtn').addEventListener('click',loadOrders);
ordersEl.addEventListener('change',e=>{if(e.target.matches('[data-status]'))updateStatus(e.target.dataset.status,e.target.value);});
loadOrders().then(ok=>{ if(ok !== false) showDashboard(); }).catch(()=>showLogin());
