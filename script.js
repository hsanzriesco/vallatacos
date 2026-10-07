const buttons = document.querySelectorAll('.menu-tabs button');
const cards = document.querySelectorAll('.food-card');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    cards.forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.cat !== filter);
    });
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelector('.menu-toggle')?.addEventListener('click', () => {
  const nav = document.querySelector('.nav nav');
  nav.classList.toggle('is-open');
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', () => {
    const nav = document.querySelector('.nav nav');
    if (window.innerWidth <= 900) nav.classList.remove('is-open');
  });
});

// Ficha de producto: contenido editable en un único lugar.
// Los alérgenos son orientativos hasta que el restaurante confirme las recetas y proveedores.
const productDetails = {
  'Taco Mixto': {
    category: 'Taco · Mixto',
    ingredients: 'Pollo, carne picada, patatas, salsa de queso, salsa a elegir y pan/tortilla de trigo.',
    allergens: 'Gluten y leche. Algunas salsas pueden contener huevo, mostaza u otros alérgenos.',
  },
  'Taco de Pollo': {
    category: 'Taco · Pollo',
    ingredients: 'Pollo, patatas, salsa de queso, salsa a elegir y pan/tortilla de trigo.',
    allergens: 'Gluten y leche. Algunas salsas pueden contener huevo, mostaza u otros alérgenos.',
  },
  'Taco Kebab': {
    category: 'Taco · Kebab',
    ingredients: 'Carne de kebab, patatas, salsa de queso, salsa a elegir y pan/tortilla de trigo.',
    allergens: 'Gluten y leche. La carne y las salsas pueden incorporar otros alérgenos según proveedor/receta.',
  },
  'Taco Crispy': {
    category: 'Taco · Crispy',
    ingredients: 'Relleno crujiente/rebozado, patatas, queso, salsa a elegir y pan/tortilla de trigo.',
    allergens: 'Gluten y leche. El rebozado y las salsas pueden contener huevo, mostaza u otros alérgenos.',
  },
  'Taco Carne Picada': {
    category: 'Taco · Carne',
    ingredients: 'Carne picada, patatas, salsa de queso, salsa a elegir y pan/tortilla de trigo.',
    allergens: 'Gluten y leche. Algunas salsas pueden contener huevo, mostaza u otros alérgenos.',
  },
  'Taco Nuggets': {
    category: 'Taco · Nuggets',
    ingredients: 'Nuggets de pollo, patatas, salsa de queso, salsa a elegir y pan/tortilla de trigo.',
    allergens: 'Gluten y leche. Los nuggets y las salsas pueden contener huevo, soja, mostaza u otros alérgenos.',
  },
  'Patatas': {
    category: 'Ración',
    ingredients: 'Patatas fritas.',
    allergens: 'Pendiente de confirmación según aceite, condimentos y posible contaminación cruzada.',
  },
  'Fingers de Pollo': {
    category: 'Ración',
    ingredients: 'Tiras de pollo rebozadas.',
    allergens: 'Gluten. El rebozado puede contener huevo, leche o soja según proveedor.',
  },
  'Pasticcio': {
    category: 'Ración · Pasticcio',
    ingredients: 'Pollo o kebab, fiambre, queso y patatas.',
    allergens: 'Gluten y leche. El fiambre, la carne y las salsas pueden contener otros alérgenos.',
  },
  'Menú Familiar': {
    category: 'Menú',
    ingredients: '3 tacos L, 3 bebidas y 3 raciones de patatas. La composición depende de los tacos elegidos.',
    allergens: 'Dependen de los tacos, salsas y opciones elegidas. Consultar la ficha de cada producto.',
  },
  'Menú Infantil': {
    category: 'Menú',
    ingredients: 'Taco M, bebida y patatas.',
    allergens: 'Dependen del taco elegido. Consultar la ficha del producto.',
  },
  'Salsas': {
    category: 'Extra · Salsas',
    ingredients: 'Andalus, Argelina, Samourai, Barbacoa y salsa de queso, según elección.',
    allergens: 'Puede variar según la salsa. Confirmar etiqueta/proveedor antes de servir a personas alérgicas.',
  }
};

const modal = document.querySelector('#productModal');
const modalImage = document.querySelector('#productModalImage');
const modalTitle = document.querySelector('#productModalTitle');
const modalCategory = document.querySelector('#productModalCategory');
const modalDescription = document.querySelector('#productModalDescription');
const modalIngredients = document.querySelector('#productModalIngredients');
const modalAllergens = document.querySelector('#productModalAllergens');
const modalPrice = document.querySelector('#productModalPrice');
let lastFocusedElement = null;

function openProductModal(card) {
  const title = card.querySelector('h3')?.textContent.trim();
  const detail = productDetails[title];
  if (!detail || !modal) return;

  lastFocusedElement = document.activeElement;
  const image = card.querySelector('img');
  modalImage.src = image?.src || '';
  modalImage.alt = image?.alt || title;
  modalTitle.textContent = title;
  modalCategory.textContent = detail.category;
  modalDescription.textContent = card.querySelector('.food-info p')?.textContent.trim() || '';
  modalIngredients.textContent = detail.ingredients;
  modalAllergens.textContent = detail.allergens;
  modalPrice.textContent = card.querySelector('.food-info > strong')?.textContent.trim() || '';

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  document.querySelector('.product-close')?.focus();
}

function closeProductModal() {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

cards.forEach(card => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('click', () => openProductModal(card));
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProductModal(card);
    }
  });
});

document.querySelectorAll('[data-modal-close]').forEach(element => {
  element.addEventListener('click', closeProductModal);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal?.classList.contains('is-open')) closeProductModal();
});

// Pedido online: carrito local + envío seguro a la API de Vercel.
const cart = [];
const orderFab = document.querySelector('#orderFab');
const orderCount = document.querySelector('#orderCount');
const orderModal = document.querySelector('#orderModal');
const orderItems = document.querySelector('#orderItems');
const orderEmpty = document.querySelector('#orderEmpty');
const orderTotal = document.querySelector('#orderTotal');
const orderForm = document.querySelector('#orderForm');
const addressField = document.querySelector('#addressField');
const addToOrderBtn = document.querySelector('#addToOrderBtn');
const orderStatus = document.querySelector('#orderStatus');
const orderSuccess = document.querySelector('#orderSuccess');
const orderSuccessText = document.querySelector('#orderSuccessText');

function euro(value){ return `${value.toFixed(2).replace('.', ',')} €`; }
function cardProduct(card){
  const title = card.querySelector('h3')?.textContent.trim() || 'Producto';
  const priceText = card.querySelector('.food-info > strong')?.textContent.trim() || '0';
  const price = Number(priceText.replace(/[^0-9,.-]/g,'').replace(',','.')) || 0;
  return { title, price };
}
function addProduct(product){
  const existing = cart.find(item => item.title === product.title);
  if(existing) existing.qty += 1;
  else cart.push({...product, qty:1});
  renderCart();
  openOrderModal();
}
function changeQty(index, delta){
  if(!cart[index]) return;
  cart[index].qty += delta;
  if(cart[index].qty <= 0) cart.splice(index,1);
  renderCart();
}
function renderCart(){
  const count = cart.reduce((sum,item)=>sum+item.qty,0);
  const total = cart.reduce((sum,item)=>sum+(item.price*item.qty),0);
  orderCount.textContent = count;
  orderTotal.textContent = euro(total);
  orderFab.classList.toggle('has-items', count > 0);
  orderEmpty.classList.toggle('hidden', count > 0);
  orderItems.innerHTML = cart.map((item,index)=>`
    <div class="order-item">
      <div class="order-item-main"><strong>${escapeHtml(item.title)}</strong><span>${euro(item.price)} · ${item.qty} ud.</span></div>
      <div class="order-item-side"><div class="order-item-price">${euro(item.price*item.qty)}</div><div class="qty-controls"><button type="button" data-qty="${index}" data-delta="-1" aria-label="Quitar una unidad">−</button><b>${item.qty}</b><button type="button" data-qty="${index}" data-delta="1" aria-label="Añadir una unidad">+</button></div></div>
    </div>`).join('');
}
function escapeHtml(value){
  return value.replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}
function openOrderModal(){
  orderModal.classList.add('is-open');
  orderModal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
}
function closeOrderModal(){
  orderModal.classList.remove('is-open');
  orderModal.setAttribute('aria-hidden','true');
  if(!document.querySelector('.product-modal.is-open')) document.body.classList.remove('modal-open');
}
function showOrderSuccess(orderNumber, total){
  orderSuccessText.textContent = `Pedido #${orderNumber} recibido correctamente. Total: ${euro(total)}. El equipo de Valla Tacos ya puede gestionarlo.`;
  orderSuccess.classList.add('is-open');
  orderSuccess.setAttribute('aria-hidden','false');
}
function setOrderStatus(message = '', type = ''){
  if (!orderStatus) return;
  orderStatus.textContent = message;
  orderStatus.className = `order-status ${type}`.trim();
}
orderFab?.addEventListener('click', openOrderModal);
document.querySelectorAll('[data-order-close]').forEach(el => el.addEventListener('click', closeOrderModal));
orderItems?.addEventListener('click', event => {
  const btn = event.target.closest('[data-qty]');
  if(btn) changeQty(Number(btn.dataset.qty), Number(btn.dataset.delta));
});

document.querySelectorAll('input[name="service"]').forEach(input => {
  input.addEventListener('change', () => {
    const delivery = document.querySelector('input[name="service"]:checked')?.value === 'A domicilio';
    addressField.classList.toggle('is-hidden', !delivery);
    addressField.querySelector('textarea').required = delivery;
  });
});

addToOrderBtn?.addEventListener('click', () => {
  if(!modal) return;
  const title = modalTitle.textContent.trim();
  const card = [...cards].find(c => c.querySelector('h3')?.textContent.trim() === title);
  if(card) addProduct(cardProduct(card));
  closeProductModal();
});

orderForm?.addEventListener('submit', async event => {
  event.preventDefault();
  if(!cart.length){
    setOrderStatus('Añade al menos un producto al pedido.', 'error');
    return;
  }
  const submitButton = orderForm.querySelector('.order-submit');
  const data = new FormData(orderForm);
  const service = data.get('service');
  const total = cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  const payload = {
    name: data.get('name'),
    phone: data.get('phone'),
    service,
    address: data.get('address') || '',
    notes: data.get('notes') || '',
    items: cart.map(item => ({ name: item.title, quantity: item.qty, price: item.price }))
  };

  submitButton.disabled = true;
  submitButton.textContent = 'Enviando pedido…';
  setOrderStatus('Guardando tu pedido de forma segura…');

  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'No se ha podido enviar el pedido.');

    cart.splice(0, cart.length);
    renderCart();
    orderForm.reset();
    addressField.classList.add('is-hidden');
    addressField.querySelector('textarea').required = false;
    setOrderStatus('');
    closeOrderModal();
    showOrderSuccess(result.order.order_number, total);
  } catch (error) {
    setOrderStatus(error.message || 'Ha ocurrido un error. Inténtalo de nuevo.', 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Confirmar pedido ✓';
  }
});

document.querySelector('[data-order-success-close]')?.addEventListener('click', () => {
  orderSuccess.classList.remove('is-open');
  orderSuccess.setAttribute('aria-hidden','true');
});

renderCart();
