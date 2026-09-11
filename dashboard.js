function readAuth() {
  try {
    return JSON.parse(localStorage.getItem('kisansetu_auth') || sessionStorage.getItem('kisansetu_auth') || 'null');
  } catch {
    return null;
  }
}
const auth = readAuth();
const userPill = document.getElementById('user-pill');
const logoutBtn = document.getElementById('logout-btn');
const pageRoleByFile = {
  'farmer-dashboard.html': 'FARMER',
  'buyer-dashboard.html': 'BUYER',
  'admin-dashboard.html': 'ADMIN',
};
const currentPage = window.location.pathname.split('/').pop();
const requiredRole = pageRoleByFile[currentPage];
const STORAGE_KEY = 'kisansetu_demo_state';
const API_BASE = 'http://127.0.0.1:8000/api/v1';
const CHAT_ORDER_ID = 1;
const PRODUCT_IMAGES = {
  Onion: 'assets/products/onion.jpg',
  Tomato: 'assets/products/tomato.jpg',
  Potato: 'assets/products/potato.jpg',
  Wheat: 'assets/products/wheat.jpg',
};

const defaultState = {
  items: [
    { name: 'Onion', quantity: 1200, region: 'Nashik', owner: 'Saraswati FPO', contact: '+91 98765 43210', emoji: '🧅', picture: '' },
    { name: 'Tomato', quantity: 800, region: 'Pune', owner: 'Kamal Farms', contact: '+91 98220 11882', emoji: '🍅', picture: '' },
  ],
  chat: [
    { sender: 'Nutrient Foods', role: 'BUYER', textKey: 'chatBuyerOpening', time: '10:24' },
    { sender: 'Ramesh', role: 'FARMER', textKey: 'chatFarmerCounter', time: '10:27' },
  ],
  counterOffers: [
    { name: 'Nutrient Foods', role: 'BUYER', item: 'Onion', price: 3020, quantity: '1,600 kg', region: 'Pune', time: '10:27' },
    { name: 'Vara Agro', role: 'BUYER', item: 'Onion', price: 2950, quantity: '1,200 kg', region: 'Nashik', time: '10:31' },
    { name: 'Saraswati FPO', role: 'FARMER', item: 'Onion', price: 3180, quantity: '1,000 kg', region: 'Nashik', time: '10:34' },
  ],
  offers: [
    { buyer: 'Nutrient Foods', item: 'Onion', price: 3020, quantity: '1,600 kg', region: 'Pune', status: 'Pending', offer_id: 88 },
    { buyer: 'Vara Agro', item: 'Onion', price: 2950, quantity: '1,200 kg', region: 'Nashik', status: 'Countered', offer_id: 89 },
    { buyer: 'Green Basket', item: 'Tomato', price: 3100, quantity: '2,000 kg', region: 'Aurangabad', status: 'Accepted', offer_id: 90 },
  ],
  matches: [
    { farmer: 'Saraswati FPO', score: 94.2, distance: 32.5, price: 100, verified: true, lot_id: 102 },
    { farmer: 'Kamal Farms', score: 91.7, distance: 46.1, price: 92, verified: true, lot_id: 103 },
    { farmer: 'Rajasthan Co-op', score: 88.9, distance: 58.2, price: 89, verified: false, lot_id: 104 },
  ],
  sellerDirectory: [
    { name: 'Saraswati FPO', type: 'FARMER', item: 'Onion', quantity: 1200, region: 'Nashik', contact: '+91 98765 43210', email: 'saraswati@example.com' },
    { name: 'Kamal Farms', type: 'FARMER', item: 'Tomato', quantity: 800, region: 'Pune', contact: '+91 98220 11882', email: 'kamal@example.com' },
    { name: 'FreshRoute Foods', type: 'COMPANY', item: 'Potato', quantity: 2400, region: 'Aurangabad', contact: '+91 97654 22331', email: 'sales@freshroute.example.com' },
    { name: 'Bharat Harvest Co.', type: 'COMPANY', item: 'Wheat', quantity: 5000, region: 'Nagpur', contact: '+91 98111 77665', email: 'trade@bharatharvest.example.com' },
  ],
  orders: [
    { id: 'KS-1042', status: 'DELIVERED', item: 'Tomato', quantity: 800, price: 2860, partner: 'Kamal Farms', partnerType: 'FARMER', contact: '+91 98220 11882', location: 'Pune', vehicle: 'Truck MH 12 CD 7788', updated: '2026-09-09' },
    { id: 'KS-1043', status: 'IN_TRANSIT', item: 'Onion', quantity: 1200, price: 3020, partner: 'Nutrient Foods', partnerType: 'COMPANY', contact: '+91 98989 11223', location: 'Pune corridor', vehicle: 'Truck MH 20 AB 4812', updated: '2026-09-11' },
    { id: 'KS-1044', status: 'PENDING', item: 'Wheat', quantity: 5000, price: 2410, partner: 'Bharat Harvest Co.', partnerType: 'COMPANY', contact: '+91 98111 77665', location: 'Nashik', vehicle: 'Not assigned', updated: '2026-09-11' },
  ],
};

function getDemoState() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
    return JSON.parse(JSON.stringify(defaultState));
  }
  return {
    ...defaultState,
    ...saved,
    items: saved.items || defaultState.items,
    chat: Array.isArray(saved.chat) && saved.chat.length ? saved.chat : defaultState.chat,
    counterOffers: Array.isArray(saved.counterOffers) && saved.counterOffers.length ? saved.counterOffers : defaultState.counterOffers,
    sellerDirectory: (saved.sellerDirectory || defaultState.sellerDirectory).map((seller) => ({
      ...defaultState.sellerDirectory.find((defaultSeller) => defaultSeller.name === seller.name),
      ...seller,
    })),
    orders: saved.orders || defaultState.orders,
  };
}

function saveDemoState(nextState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

function cropEmoji(name) {
  return { Onion: '🧅', Tomato: '🍅', Potato: '🥔', Wheat: '🌾' }[name] || '🌱';
}

function renderItems() {
  const grid = document.getElementById('item-grid');
  if (!grid) return;
  const state = getDemoState();
  grid.innerHTML = (state.items || []).map((item) => `
    <article class="item-card">
      <div class="item-picture"><img src="${item.picture || PRODUCT_IMAGES[item.name]}" alt="${t('dashboard.' + item.name.toLowerCase())}" loading="lazy" onerror="this.onerror=null;this.replaceWith(Object.assign(document.createElement('span'),{className:'crop-fallback',textContent:'${cropEmoji(item.name)}'}))" /></div>
      <div class="item-details">
        <strong>${t(`dashboard.${item.name.toLowerCase()}`)}</strong>
        <span>${formatLocalizedUnit(item.quantity, 'kg')} · ${localizedEntity('locations', item.region)}</span>
        ${item.owner ? `<span>${localizedEntity('names', item.owner)} · <a href="tel:${(item.contact || '').replace(/[^+\d]/g, '')}">${item.contact || ''}</a></span>` : ''}
      </div>
    </article>
  `).join('');
}

function renderChat() {
  const thread = document.getElementById('chat-thread');
  if (!thread) return;
  const state = getDemoState();
  thread.innerHTML = (state.chat || []).map((message) => {
    const mine = message.role === auth?.role;
    const legacyTextKeys = {
      'Can we close the onion lot at ₹2,980 per quintal?': 'chatBuyerOpening',
      'I can accept ₹3,020 if pickup is scheduled this week.': 'chatFarmerCounter',
    };
    const textKey = message.textKey || legacyTextKeys[message.text];
    const text = textKey ? t(`dashboard.${textKey}`) : message.text;
    return `<div class="chat-message ${mine ? 'mine' : ''}"><small>${localizedEntity('companies', message.sender) || localizedEntity('names', message.sender)} · ${message.time}</small>${text}</div>`;
  }).join('');
  thread.scrollTop = thread.scrollHeight;
}

function renderCounterOffers() {
  const list = document.getElementById('counter-offers-list');
  if (!list) return;
  const state = getDemoState();
  const visibleOffers = auth?.role === 'FARMER'
    ? (state.counterOffers || []).filter((offer) => offer.role === 'BUYER')
    : (state.counterOffers || []);
  list.innerHTML = visibleOffers.map((offer) => `
    <article class="counter-offer-card">
      <div>
        <strong>${localizedEntity(offer.role === 'BUYER' ? 'companies' : 'names', offer.name)}</strong>
        <span>${localizedEntity('crops', offer.item)} · ${localizedQuantity(offer.quantity)} · ${localizedEntity('locations', offer.region)}</span>
      </div>
      <strong class="counter-price">${formatLocalizedCurrency(offer.price)}</strong>
    </article>
  `).join('');
}

function ensureChatDrawer() {
  if (!document.getElementById('chat-drawer')) {
    const panel = document.getElementById('chat-panel');
    if (!panel) return null;
    const drawer = document.createElement('aside');
    drawer.id = 'chat-drawer';
    drawer.className = 'chat-drawer';
    drawer.innerHTML = `
      <div class="chat-drawer-header">
        <h2 data-i18n="dashboard.priceChat">Price discussion</h2>
        <button class="drawer-close" type="button" data-close-chat aria-label="Close chat">×</button>
      </div>
      <div class="chat-drawer-content"></div>
    `;
    const backdrop = document.createElement('div');
    backdrop.id = 'chat-drawer-backdrop';
    backdrop.className = 'chat-drawer-backdrop';
    document.body.append(drawer, backdrop);
    drawer.querySelector('.chat-drawer-content').append(panel);
    drawer.querySelector('[data-close-chat]').addEventListener('click', closeChatDrawer);
    backdrop.addEventListener('click', closeChatDrawer);
  }
  return document.getElementById('chat-drawer');
}

function openChatDrawer() {
  const drawer = ensureChatDrawer();
  if (!drawer) return;
  drawer.classList.add('is-open');
  document.getElementById('chat-drawer-backdrop').classList.add('is-open');
  loadProductionChat();
}

function closeChatDrawer() {
  document.getElementById('chat-drawer')?.classList.remove('is-open');
  document.getElementById('chat-drawer-backdrop')?.classList.remove('is-open');
}

function ensureOrdersDrawer() {
  if (document.getElementById('orders-drawer')) return document.getElementById('orders-drawer');
  const drawer = document.createElement('aside');
  drawer.id = 'orders-drawer';
  drawer.className = 'orders-drawer';
  drawer.innerHTML = `
    <div class="chat-drawer-header">
      <h2 data-i18n="dashboard.orders">Orders</h2>
      <button class="drawer-close" type="button" data-close-orders aria-label="Close orders">×</button>
    </div>
    <div class="orders-filter" role="tablist">
      <button type="button" class="order-filter active" data-order-filter="ALL" data-i18n="dashboard.allOrders">All</button>
      <button type="button" class="order-filter" data-order-filter="DELIVERED" data-i18n="common.delivered">Delivered</button>
      <button type="button" class="order-filter" data-order-filter="IN_TRANSIT" data-i18n="common.inTransit">In transit</button>
      <button type="button" class="order-filter" data-order-filter="PENDING" data-i18n="dashboard.pending">Pending</button>
    </div>
    <div id="orders-list" class="orders-list"></div>
    <div id="order-details" class="order-details" hidden></div>
  `;
  const backdrop = document.createElement('div');
  backdrop.id = 'orders-drawer-backdrop';
  backdrop.className = 'chat-drawer-backdrop';
  document.body.append(drawer, backdrop);
  drawer.querySelector('[data-close-orders]').addEventListener('click', closeOrdersDrawer);
  backdrop.addEventListener('click', closeOrdersDrawer);
  drawer.querySelectorAll('[data-order-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      drawer.querySelectorAll('[data-order-filter]').forEach((filter) => filter.classList.remove('active'));
      button.classList.add('active');
      renderOrders(button.dataset.orderFilter);
    });
  });
  return drawer;
}

function renderOrders(filter = 'ALL') {
  const list = document.getElementById('orders-list');
  if (!list) return;
  const orders = (getDemoState().orders || []).filter((order) => filter === 'ALL' || order.status === filter);
  list.innerHTML = orders.map((order) => `
    <button class="order-card" type="button" data-order-id="${order.id}">
      <span class="order-icon">${order.status === 'DELIVERED' ? '✓' : order.status === 'IN_TRANSIT' ? '→' : '…'}</span>
      <span class="order-card-main"><strong>${order.id}</strong><small>${localizedEntity('crops', order.item)} · ${formatLocalizedUnit(order.quantity, 'kg')}</small></span>
      <span class="order-card-status"><span class="status-badge status-${order.status === 'DELIVERED' ? 'accepted' : order.status === 'IN_TRANSIT' ? 'countered' : 'pending'}">${localizedOrderState(order.status)}</span>${order.status === 'IN_TRANSIT' ? `<span class="location-hint">⌖ ${t('dashboard.seeLocation')}</span>` : ''}</span>
    </button>
  `).join('');
  list.querySelectorAll('[data-order-id]').forEach((button) => button.addEventListener('click', () => showOrderDetails(button.dataset.orderId)));
}

function showOrderDetails(orderId) {
  const order = (getDemoState().orders || []).find((item) => item.id === orderId);
  const details = document.getElementById('order-details');
  if (!order || !details) return;
  details.hidden = false;
  details.innerHTML = `<div class="order-details-heading"><strong>${order.id}</strong><button type="button" class="drawer-close" data-hide-order-details>×</button></div>
    <p><b>${t('dashboard.status')}:</b> ${localizedOrderState(order.status)}</p>
    <p><b>${t('common.shipmentItem')}:</b> ${localizedEntity('crops', order.item)}</p>
    <p><b>${t('dashboard.quantity')}:</b> ${formatLocalizedUnit(order.quantity, 'kg')}</p>
    <p><b>${t('dashboard.price')}:</b> ${formatLocalizedCurrency(order.price)}</p>
    <p><b>${t('dashboard.contactPartner')}:</b> ${localizedEntity(order.partnerType === 'COMPANY' ? 'companies' : 'names', order.partner)} · <a href="tel:${order.contact.replace(/[^+\d]/g, '')}">${order.contact}</a></p>
    <p><b>${t('dashboard.region')}:</b> ${localizedEntity('locations', order.location)}</p>
    <p><b>${t('common.vehicle')}:</b> ${order.vehicle}</p>
    <p><b>${t('dashboard.lastUpdated')}:</b> ${order.updated}</p>
    ${order.status === 'IN_TRANSIT' ? `<button type="button" class="small-button primary see-location-button" data-see-location="${order.id}">⌖ ${t('dashboard.seeLocation')}</button>` : ''}`;
  details.querySelector('[data-hide-order-details]').addEventListener('click', () => { details.hidden = true; });
  details.querySelector('[data-see-location]')?.addEventListener('click', () => {
    window.location.href = `tracking.html?order=${encodeURIComponent(order.id)}`;
    closeOrdersDrawer();
  });
}

function openOrdersDrawer() {
  const drawer = ensureOrdersDrawer();
  drawer.classList.add('is-open');
  document.getElementById('orders-drawer-backdrop').classList.add('is-open');
  renderOrders();
}

function closeOrdersDrawer() {
  document.getElementById('orders-drawer')?.classList.remove('is-open');
  document.getElementById('orders-drawer-backdrop')?.classList.remove('is-open');
}

async function loadProductionChat() {
  const payload = await fetchJson(`${API_BASE}/orders/${CHAT_ORDER_ID}/chat`);
  if (!payload || !Array.isArray(payload.messages) || !payload.messages.length) return;
  const state = getDemoState();
  state.chat = payload.messages.map((message) => ({
    sender: message.sender_name,
    role: message.sender_role,
    text: message.message,
    time: new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));
  saveDemoState(state);
  renderChat();
}

function connectProductionChat() {
  if (!window.WebSocket) return;
  const socketUrl = API_BASE.replace(/^http/, 'ws') + `/orders/${CHAT_ORDER_ID}/chat/ws`;
  const socket = new WebSocket(socketUrl);
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    const state = getDemoState();
    state.chat = [...(state.chat || []), {
      sender: message.sender_name,
      role: message.sender_role,
      text: message.message,
      time: new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }];
    saveDemoState(state);
    renderChat();
  });
}

function initializeFeatureInteractions() {
  const itemForm = document.getElementById('item-form');
  itemForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('item-name').value;
    const quantity = Number(document.getElementById('item-quantity').value);
    const region = document.getElementById('item-region').value.trim() || 'Nashik';
    const file = document.getElementById('item-picture').files[0];
    const addItem = (picture) => {
      const state = getDemoState();
      state.items = [...(state.items || []), { name, quantity, region, emoji: cropEmoji(name), picture }];
      saveDemoState(state);
      renderItems();
      itemForm.reset();
      showToast(`${t('dashboard.addItem')}: ${t(`dashboard.${name.toLowerCase()}`)}`);
    };
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => addItem(reader.result));
      reader.readAsDataURL(file);
    } else {
      addItem('');
    }
  });

  document.getElementById('chat-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('chat-message');
    const text = input.value.trim();
    if (!text) return;
    const state = getDemoState();
    const message = {
      sender: auth?.name || (auth?.role === 'BUYER' ? 'Priya' : 'Ramesh'),
      role: auth?.role || 'FARMER',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    state.chat = [...(state.chat || []), message];
    saveDemoState(state);
    input.value = '';
    renderChat();
    fetchJson(`${API_BASE}/orders/${CHAT_ORDER_ID}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender_id: 1,
        sender_name: message.sender,
        sender_role: message.role,
        message: message.text,
      }),
    });
  });

  document.querySelectorAll('[data-open-chat]').forEach((button) => button.addEventListener('click', openChatDrawer));
  document.querySelectorAll('[data-open-orders]').forEach((button) => button.addEventListener('click', openOrdersDrawer));
  document.querySelectorAll('[data-open-item-form]').forEach((button) => button.addEventListener('click', () => {
    const panel = document.getElementById('item-form-panel');
    panel?.classList.toggle('is-open');
    panel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  document.getElementById('counter-offer-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = document.getElementById('counter-price');
    const price = Number(input.value);
    if (!Number.isFinite(price) || price <= 0) {
      input.focus();
      showToast(t('dashboard.counterPriceRequired'));
      return;
    }
    const role = auth?.role || 'FARMER';
    const name = auth?.name || (role === 'BUYER' ? 'Priya' : 'Ramesh');
    const state = getDemoState();
    const counter = { name, role, item: 'Onion', price, quantity: '1,000 kg', region: role === 'BUYER' ? 'Nashik' : 'Pune', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    state.counterOffers = [...(state.counterOffers || []), counter];
    state.chat = [...(state.chat || []), {
      sender: name,
      role,
      text: `${t('dashboard.counterPriceMessage')} ${formatLocalizedCurrency(price)}`,
      time: counter.time,
    }];
    saveDemoState(state);
    input.value = '';
    renderCounterOffers();
    renderChat();
    showToast(t('dashboard.counterPriceSent').replace('{price}', formatLocalizedCurrency(price)));
  });
  connectProductionChat();
}

function localizedEntity(group, value) {
  return localizedValue(group, value);
}

function localizedQuantity(value) {
  const match = String(value).match(/([\d,.]+)\s*(kg|किग्रा|किलो)/i);
  return match ? formatLocalizedUnit(Number(match[1].replace(/,/g, '')), 'kg') : value;
}

function localizedStatus(status) {
  const key = String(status || 'Pending').toLowerCase();
  return t(`dashboard.${key}`) || status;
}

function localizedOrderState(state) {
  const key = String(state).toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  return t(`dashboard.${key}`) || state.replace(/_/g, ' ');
}

async function fetchJson(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}

if (userPill && auth) {
  const fallbackRole = auth.role === 'BUYER'
    ? t('common.buyer')
    : auth.role === 'ADMIN' ? t('common.admin') : t('common.farmer');
  const displayName = auth.name && auth.name.toUpperCase() !== auth.role ? localizedEntity('names', auth.name) : fallbackRole;
  userPill.textContent = String(displayName || 'U').trim().charAt(0).toUpperCase();
  userPill.title = 'View account details';
  userPill.setAttribute('aria-label', 'View account details');
  userPill.setAttribute('role', 'link');
  userPill.tabIndex = 0;
  userPill.addEventListener('click', () => { window.location.href = 'account.html'; });
  userPill.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') window.location.href = 'account.html';
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('kisansetu_auth');
    sessionStorage.removeItem('kisansetu_auth');
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = 'index.html';
  });
}

function renderFarmerOffers() {
  const offersBody = document.getElementById('offers-body');
  if (!offersBody) return;

  const state = getDemoState();
  const cropFilter = document.getElementById('offer-crop-filter')?.value || 'ALL';
  const regionFilter = (document.getElementById('offer-region-filter')?.value || '').trim().toLowerCase();
  const filteredOffers = state.offers.filter((offer) => (
    (cropFilter === 'ALL' || offer.item === cropFilter || !offer.item)
    && (!regionFilter || String(offer.region).toLowerCase().includes(regionFilter))
  ));
  offersBody.innerHTML = filteredOffers.map((offer, index) => {
    const statusText = offer.status || 'Pending';
    return `
      <tr>
        <td><strong>${localizedEntity('companies', offer.buyer)}</strong><small class="table-contact">${localizedEntity('contacts', offer.buyer)}</small></td>
        <td>${formatLocalizedCurrency(offer.price)}</td>
        <td>${localizedQuantity(offer.quantity)}</td>
        <td>${localizedEntity('locations', offer.region)}</td>
        <td><span class="status-badge status-${String(statusText).toLowerCase()}">${localizedStatus(statusText)}</span></td>
        <td>
          <div class="action-row">
            <button class="small-button primary" type="button" data-action="accept" data-buyer="${offer.buyer}" data-offer-id="${offer.offer_id ?? 88 + index}">${t('dashboard.accept')}</button>
            <button class="small-button secondary" type="button" data-action="counter" data-buyer="${offer.buyer}" data-offer-id="${offer.offer_id ?? 88 + index}">${t('dashboard.counter')}</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  document.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', async () => {
      const action = button.dataset.action;
      const buyer = button.dataset.buyer;
      const offerId = button.dataset.offerId || 88;
      if (action === 'counter') {
        const counterPrice = document.getElementById('counter-price');
        counterPrice?.focus();
        document.querySelector('.counter-offers-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast(t('dashboard.enterCounterPriceFor').replace('{name}', localizedEntity('companies', buyer)));
        return;
      }
      const status = action === 'accept' ? t('dashboard.accepted') : t('dashboard.countered');

      const route = action === 'accept' ? 'accept' : 'counter';
      const response = await fetchJson(`${API_BASE}/offers/${offerId}/${route}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const state = getDemoState();
      state.offers = state.offers.map((offer) => (
        offer.buyer === buyer ? { ...offer, status: action === 'accept' ? 'Accepted' : 'Countered' } : offer
      ));
      saveDemoState(state);
      renderFarmerOffers();
      const toastKey = action === 'accept' ? 'dashboard.offerAcceptedToast' : 'dashboard.offerCounteredToast';
      showToast(t(toastKey).replace('{name}', localizedEntity('companies', buyer)));
    });
  });
}

function normalizeMatch(match) {
  return {
    farmer: match.farmer_name || match.farmer || 'Farmer',
    score: Number(match.matching_score ?? match.score ?? 0),
    distance: Number(match.distance_km ?? match.distance ?? 0),
    price: Number(match.price_score ?? match.price ?? 0),
    verified: Boolean(match.verified ?? true),
    lot_id: Number(match.lot_id ?? 102),
  };
}

async function loadBuyerMatches() {
  const payload = await fetchJson(`${API_BASE}/demands/1/matches`);
  const matches = payload && Array.isArray(payload.matches) ? payload.matches.map(normalizeMatch) : null;

  if (!matches) return;

  const state = getDemoState();
  state.matches = matches;
  saveDemoState(state);
  renderBuyerMatches();
  renderBuyerDirectory();
}

async function loadSaleAdvisor() {
  const payload = await fetchJson(`${API_BASE}/market/sale-window`);
  if (!payload) return;

  const valueNodes = document.querySelectorAll('.advisor-card .kpi-label, .advisor-card .muted');
  const card = document.querySelector('.advisor-card');
  if (!card) return;

  const currentPrice = card.querySelector('#sale-window-current-price');
  const forecastPrice = card.querySelector('#sale-window-forecast-price');
  const suggestion = card.querySelector('.small-button.primary');

  const item = card.querySelector('#sale-window-item');
  const market = card.querySelector('#sale-window-market');
  const unit = card.querySelector('#sale-window-unit');
  const range = card.querySelector('#sale-window-range');
  if (item) item.textContent = localizedEntity('crops', payload.crop || 'Tomato');
  if (market) market.textContent = localizedEntity('locations', payload.market || 'Pune APMC');
  if (unit) unit.textContent = payload.price_unit || '₹/kg';
  if (currentPrice) currentPrice.innerHTML = `<div style="font-size: 2.7rem; font-weight: 900; letter-spacing: -0.08em; color: #0F2942;">${formatLocalizedCurrency(payload.current_price)}</div>`;
  if (forecastPrice) forecastPrice.innerHTML = `<div style="font-size: 2.7rem; font-weight: 900; letter-spacing: -0.08em; color: #0F2942;">${formatLocalizedCurrency(payload.predicted_7_day_price)}</div>`;
  if (range && Array.isArray(payload.recommended_range)) range.textContent = `${formatLocalizedCurrency(payload.recommended_range[0])}–${formatLocalizedCurrency(payload.recommended_range[1])}`;
  if (suggestion) suggestion.textContent = t('dashboard.wait');
}

function renderBuyerMatches() {
  const matchGrid = document.getElementById('match-grid');
  if (!matchGrid) return;

  const state = getDemoState();
  matchGrid.innerHTML = state.matches.map((match) => `
    <div class="match-card">
      <div class="flex-row" style="display:flex; justify-content:space-between; align-items:center;">
        <div style="font-size:1.1rem; font-weight:800; color:#0F2942;">${localizedEntity('names', match.farmer)}</div>
        <span class="status-badge status-accepted" style="background:${match.verified ? '#e8f6eb' : '#f3f5f4'}; color:${match.verified ? '#2a7d4b' : '#5d6a62'};">${match.verified ? t('dashboard.verified') : t('dashboard.newLabel')}</span>
      </div>
      <div class="score-badge" style="margin-top: 14px;">${formatLocalizedNumber(match.score)}</div>
      <div class="muted" style="margin-top: 8px;">${t('dashboard.matchingScore')}</div>
      <div style="margin-top: 18px; display:grid; grid-template-columns: 1fr 1fr; gap: 12px; color:#53655d; font-size: 0.92rem;">
        <div><div class="muted" style="font-size: 10px; text-transform: uppercase; letter-spacing: .16em;">${t('dashboard.distance')}</div><div>${formatLocalizedUnit(match.distance, 'km')}</div></div>
        <div><div class="muted" style="font-size: 10px; text-transform: uppercase; letter-spacing: .16em;">${t('dashboard.priceScore')}</div><div>${formatLocalizedNumber(match.price)}</div></div>
      </div>
      <div class="contact-line">${localizedEntity('contacts', match.farmer) || '+91 98765 43210'}</div>
      <button class="gradient-cta" type="button" data-lot-id="${match.lot_id}" data-farmer="${match.farmer}" style="width:100%; margin-top: 20px;">${t('dashboard.placeOffer')}</button>
    </div>
  `).join('');

  document.querySelectorAll('[data-lot-id]').forEach((button) => {
    button.addEventListener('click', async () => {
      const farmer = button.dataset.farmer || 'Farmer';
      const offerForm = Array.from(document.querySelectorAll('.seller-offer-form'))
        .find((form) => form.dataset.seller === farmer);
      offerForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      offerForm?.querySelector('input')?.focus();
      if (!offerForm) showToast(t('dashboard.offerSellerUnavailable'));
    });
  });
}

function renderBuyerDirectory() {
  const directory = document.getElementById('buyer-directory');
  if (!directory) return;
  const state = getDemoState();
  const matches = state.matches || [];
  directory.innerHTML = (state.sellerDirectory || []).map((seller) => {
    const match = matches.find((candidate) => candidate.farmer === seller.name);
    return `
    <article class="seller-card">
      <div class="seller-card-heading">
        <div>
          <strong>${localizedEntity(seller.type === 'COMPANY' ? 'companies' : 'names', seller.name)}</strong>
          <span>${seller.type === 'COMPANY' ? t('dashboard.companySeller') : t('dashboard.farmerSeller')}</span>
        </div>
        <span class="status-badge status-accepted">${localizedEntity('crops', seller.item)}</span>
      </div>
      <div class="seller-meta">${formatLocalizedUnit(seller.quantity, 'kg')} · ${localizedEntity('locations', seller.region)}</div>
      ${match ? `<div class="seller-match-summary">
        <div><strong>${formatLocalizedNumber(match.score)}</strong><span>${t('dashboard.matchingScore')}</span></div>
        <div><strong>${formatLocalizedUnit(match.distance, 'km')}</strong><span>${t('dashboard.distance')}</span></div>
        <div><strong>${formatLocalizedNumber(match.price)}</strong><span>${t('dashboard.priceScore')}</span></div>
      </div>` : ''}
      <div class="seller-contact"><a href="tel:${seller.contact.replace(/[^+\d]/g, '')}">${seller.contact}</a><a href="mailto:${seller.email}">${seller.email}</a></div>
      <form class="seller-offer-form" data-seller="${seller.name}" data-seller-item="${seller.item}" data-lot-id="${match?.lot_id || 102}">
        <label><span>${t('dashboard.offerPrice')}</span><input type="number" min="1" step="1" required placeholder="₹/quintal" /></label>
        <button class="small-button primary" type="submit">${t('dashboard.sendOffer')}</button>
      </form>
    </article>
  `;
  }).join('');
  directory.querySelectorAll('.seller-offer-form').forEach((form) => form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const farmer = form.dataset.seller || 'Farmer';
    const price = Number(form.querySelector('input').value);
    if (!Number.isFinite(price) || price <= 0) {
      form.querySelector('input').focus();
      showToast(t('dashboard.offerPriceRequired'));
      return;
    }
    const state = getDemoState();
    const existing = state.offers.find((offer) => offer.buyer === farmer);
    state.offers = existing
      ? state.offers.map((offer) => offer.buyer === farmer ? { ...offer, price, status: 'Pending' } : offer)
      : [...state.offers, { buyer: farmer, price, quantity: '1,600 kg', region: 'Pune', status: 'Pending', offer_id: 999 }];
    saveDemoState(state);
    await fetchJson(`${API_BASE}/lots/${form.dataset.lotId || 102}/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buyer: auth?.name || 'Priya', price }),
    });
    form.reset();
    showToast(t('dashboard.offerSentToast').replace('{name}', localizedEntity('names', farmer)));
  }));
}

/*
 * Keep the original offer state synchronization for pages that expose the
 * farmer offer table; buyer offers are submitted through the form above.
 */
function syncLegacyBuyerOffer(farmer, offerPrice, lotId) {
      const state = getDemoState();
      const existingOffer = state.offers.find((offer) => offer.buyer === farmer);
      const nextOffers = existingOffer
        ? state.offers.map((offer) => offer.buyer === farmer ? { ...offer, status: 'Pending', price: offerPrice } : offer)
        : [...state.offers, { buyer: farmer, price: offerPrice, quantity: '1,600 kg', region: 'Pune', status: 'Pending', offer_id: 999 }];
      state.offers = nextOffers;
      saveDemoState(state);
      renderFarmerOffers();
}

function getDefaultTrackingState() {
  return {
    success: true,
    order_id: 1,
    status: 'IN_TRANSIT',
    vehicle: 'Truck MH 20 AB 4812',
    speed_kmh: 28,
    eta_minutes: 140,
    current_stop: 'Pune corridor',
    item_name: 'Onion',
    farmer_name: 'Saraswati FPO',
    route: [
      { name: 'Farm gate', percent: 15, label: 'Nashik' },
      { name: 'Akluj hub', percent: 38, label: 'Akluj' },
      { name: 'Pune corridor', percent: 62, label: 'Pune' },
      { name: 'Distribution center', percent: 85, label: 'Hyderabad' },
      { name: 'Destination', percent: 100, label: 'Buyer dock' },
    ],
    active_index: 2,
  };
}

function formatEta(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return formatLocalizedUnit(mins, 'minute');
  return `${formatLocalizedUnit(hours, 'hour')} ${formatLocalizedUnit(mins, 'minute')}`;
}

function renderTrackingPanel(payload) {
  const map = document.getElementById('tracking-map');
  const status = document.getElementById('tracking-status');
  const vehicle = document.getElementById('tracking-vehicle');
  const eta = document.getElementById('tracking-eta');
  const stop = document.getElementById('tracking-stop');
  const item = document.getElementById('tracking-item');
  const farmer = document.getElementById('tracking-farmer');
  const vehicleMarker = document.getElementById('vehicle-marker');

  if (!map || !status || !vehicle || !eta || !stop || !item || !farmer || !vehicleMarker) return;

  const state = payload || getDefaultTrackingState();
  const route = state.route || getDefaultTrackingState().route;
  const activeIndex = Math.max(0, Math.min(Number(state.active_index ?? 0), route.length - 1));
  const activeStop = route[activeIndex];

  map.querySelectorAll('.route-point').forEach((point) => point.remove());
  route.forEach((item, index) => {
    const point = document.createElement('div');
    point.className = `route-point ${index === activeIndex ? 'active' : ''}`;
    point.style.left = `${item.percent}%`;
    point.innerHTML = `<span class="dot"></span><span>${localizedEntity('locations', item.name)}</span>`;
    map.appendChild(point);
  });

  vehicleMarker.style.left = `${activeStop.percent}%`;
  vehicleMarker.style.top = '50%';
  status.textContent = state.status === 'DELIVERED' ? t('common.delivered') : t('common.inTransit');
  status.className = `status-badge ${state.status === 'DELIVERED' ? 'status-accepted' : 'status-pending'}`;
  vehicle.textContent = state.vehicle
    ? localizeDigits(state.vehicle.replace('Truck', localizedEntity('misc', 'truck')))
    : `${localizedEntity('misc', 'truck')} MH 20 AB ${localizeDigits('4812')}`;
  eta.textContent = formatEta(Number(state.eta_minutes ?? 140));
  stop.textContent = localizedEntity('locations', activeStop.name || state.current_stop || 'Pune corridor');
  item.textContent = localizedEntity('crops', state.item_name || 'Onion');
  farmer.textContent = localizedEntity('names', state.farmer_name || 'Saraswati FPO');
}

async function loadTrackingData() {
  const payload = await fetchJson(`${API_BASE}/orders/1/tracking`);
  const state = payload && payload.success ? payload : getDefaultTrackingState();
  renderTrackingPanel(state);
  return state;
}

let trackingLoopStarted = false;

function startTrackingLoop() {
  if (trackingLoopStarted) return;
  trackingLoopStarted = true;
  let frame = 0;
  const route = getDefaultTrackingState().route;
  setInterval(async () => {
    const state = await loadTrackingData();
    const nextIndex = ((frame + (state && state.active_index ? state.active_index : 0)) % route.length);
    state.active_index = nextIndex;
    state.eta_minutes = Math.max(20, Number(state.eta_minutes || 140) - 8);
    state.speed_kmh = Math.min(52, Number(state.speed_kmh || 28) + 3);
    renderTrackingPanel(state);
    frame += 1;
  }, 5000);
}

function showToast(message) {
  const status = document.querySelector('.toast');
  if (!status) return;
  status.textContent = message;
  status.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => status.classList.remove('show'), 2800);
}

document.querySelectorAll('[data-toast-i18n]').forEach((button) => {
  button.addEventListener('click', () => showToast(t(button.dataset.toastI18n)));
});

document.querySelector('[data-voice-assist]')?.addEventListener('click', () => {
  if (!('speechSynthesis' in window)) {
    showToast('Voice assist is not supported on this device.');
    return;
  }
  const language = document.getElementById('voice-language')?.value || localStorage.getItem('kisansetu_lang') || 'en';
  const locale = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
  const message = language === 'hi'
    ? 'आज प्याज का भाव तीन हजार बीस रुपये प्रति क्विंटल है। सात दिनों में भाव बढ़ने की संभावना है।'
    : language === 'mr'
      ? 'आज कांद्याचा भाव तीन हजार वीस रुपये प्रति क्विंटल आहे. सात दिवसांत भाव वाढण्याची शक्यता आहे.'
      : 'Today onion is priced at three thousand twenty rupees per quintal. Prices may rise in seven days.';
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = locale;
  window.speechSynthesis.speak(utterance);
});

document.getElementById('dispute-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const description = document.getElementById('dispute-description').value.trim();
  if (!description) return;
  try {
    const response = await fetch(`${API_BASE}/disputes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: 'KS-1043', reason: document.getElementById('dispute-reason').value, description }),
    });
    if (!response.ok) throw new Error('Dispute request failed');
    document.getElementById('dispute-description').value = '';
    showToast(t('dashboard.disputeStarted'));
  } catch {
    showToast(t('dashboard.disputeUnavailable'));
  }
});

async function loadPaymentStatus() {
  const status = document.getElementById('payment-status');
  const amount = document.getElementById('payment-amount');
  if (!status) return;
  try {
    const response = await fetch(`${API_BASE}/payments/KS-1043`);
    if (!response.ok) throw new Error('Payment status unavailable');
    const payload = await response.json();
    const statusKey = payload.status.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    status.textContent = t(`dashboard.${statusKey}`) || payload.status;
    if (amount) amount.textContent = formatLocalizedCurrency(payload.amount);
  } catch {
    status.textContent = t('dashboard.escrowPending');
  }
}
loadPaymentStatus();

document.querySelectorAll('[data-channel]').forEach((button) => {
  button.addEventListener('click', async () => {
    const channel = button.dataset.channel;
    const mobile = auth?.mobile;
    if (channel === 'ussd') {
      showToast('Dial *123# from your registered phone to use USSD.');
      return;
    }
    if (!mobile) {
      showToast('Add a phone number to your account before using this channel.');
      return;
    }
    const endpoint = channel === 'voice' ? `${API_BASE}/channels/voice/call?to=${encodeURIComponent(mobile)}` : `${API_BASE}/channels/message`;
    const options = channel === 'voice'
      ? { method: 'POST' }
      : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ channel, to: mobile, message: 'KisanSetu market update: Onion ₹3,020/quintal. Predicted 7-day price: ₹3,180.' }) };
    try {
      const response = await fetch(endpoint, options);
      if (!response.ok) throw new Error('Channel request failed');
      showToast(`${channel.toUpperCase()} request sent successfully.`);
    } catch {
      showToast(`${channel.toUpperCase()} integration is not configured.`);
    }
  });
});

const orderLifecycle = ['OFFER_ACCEPTED', 'ORDER_CONFIRMED', 'PICKUP_SCHEDULED', 'IN_TRANSIT', 'DELIVERED', 'PAYMENT_COMPLETED'];

function getOrderState() {
  return localStorage.getItem('kisansetu_order_state') || 'OFFER_ACCEPTED';
}

function setOrderState(nextState) {
  localStorage.setItem('kisansetu_order_state', nextState);
}

function renderAdminFlow() {
  const flow = document.querySelector('.order-flow');
  if (!flow) return;

  const currentState = getOrderState();
  const currentIndex = orderLifecycle.indexOf(currentState);

  const html = orderLifecycle.map((step, index) => {
    const isCurrent = step === currentState;
    const isPast = index < currentIndex;
    const label = localizedOrderState(step);
    return `
      <span class="flow-step ${isCurrent ? 'active' : ''} ${isPast ? 'complete' : ''}">${label}</span>
      ${index < orderLifecycle.length - 1 ? '<span>→</span>' : ''}
    `;
  }).join('');

  flow.innerHTML = html;

  if (currentIndex < orderLifecycle.length - 1) {
    const nextState = orderLifecycle[currentIndex + 1];
    const action = document.querySelector('.order-flow-action');
    if (action) {
      action.remove();
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'small-button primary order-flow-action';
    button.textContent = `${t('dashboard.advanceTo')} ${localizedOrderState(nextState)}`;
    button.addEventListener('click', async () => {
      const response = await fetchJson(`${API_BASE}/orders/1/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from_state: currentState, to_state: nextState }),
      });

      if (response && response.success) {
        setOrderState(nextState);
        renderAdminFlow();
        showToast(t('dashboard.orderUpdatedToast').replace('{state}', localizedOrderState(nextState)));
      } else {
        showToast(t('dashboard.transitionBlocked'));
      }
    });
    flow.parentElement.appendChild(button);
  }
}

if (document.getElementById('offers-body')) {
  renderFarmerOffers();
  document.getElementById('offer-crop-filter')?.addEventListener('change', renderFarmerOffers);
  document.getElementById('offer-region-filter')?.addEventListener('input', renderFarmerOffers);
}

if (document.getElementById('counter-offers-list')) renderCounterOffers();

if (document.getElementById('item-grid') || document.getElementById('chat-thread')) {
  renderItems();
  renderChat();
  initializeFeatureInteractions();
}

if (document.getElementById('match-grid')) {
  renderBuyerMatches();
  renderBuyerDirectory();
  loadBuyerMatches();
  loadSaleAdvisor();
}

if (document.getElementById('buyer-directory')) {
  renderBuyerDirectory();
  loadBuyerMatches();
}

if (document.querySelector('.order-flow')) {
  renderAdminFlow();
}

document.addEventListener('kisansetu:languagechange', () => {
  if (document.getElementById('offers-body')) renderFarmerOffers();
  if (document.getElementById('match-grid')) renderBuyerMatches();
  if (document.getElementById('buyer-directory')) renderBuyerDirectory();
  if (document.getElementById('item-grid')) renderItems();
  if (document.getElementById('chat-thread')) renderChat();
  if (document.getElementById('counter-offers-list')) renderCounterOffers();
  if (document.querySelector('.order-flow')) renderAdminFlow();
  if (userPill && auth) {
    const fallbackRole = auth.role === 'BUYER'
      ? t('common.buyer')
      : auth.role === 'ADMIN' ? t('common.admin') : t('common.farmer');
    const displayName = auth.name && auth.name.toUpperCase() !== auth.role ? localizedEntity('names', auth.name) : fallbackRole;
    userPill.textContent = String(displayName || 'U').trim().charAt(0).toUpperCase();
  }
});

window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY) {
    if (document.getElementById('item-grid')) renderItems();
    if (document.getElementById('chat-thread')) renderChat();
    if (document.getElementById('counter-offers-list')) renderCounterOffers();
  }
});

if (!auth && requiredRole) {
  window.location.href = 'login.html';
} else if (auth && requiredRole && auth.role !== requiredRole) {
  const redirectMap = {
    FARMER: 'farmer-dashboard.html',
    BUYER: 'buyer-dashboard.html',
    ADMIN: 'admin-dashboard.html',
  };
  window.location.href = redirectMap[auth.role] || 'login.html';
}
