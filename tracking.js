const TRACKING_API = 'http://127.0.0.1:8000/api/v1';
const trackingOrderId = new URLSearchParams(window.location.search).get('order') || 'KS-1043';
const trackingOrders = {
  'KS-1043': {
    item: 'Onion', quantity: 1200, vehicle: 'Truck MH 20 AB 4812', partner: 'Nutrient Foods',
    origin: 'Nashik, India', destination: 'Pune, India',
    route: [
      { name: 'Nashik farm gate', lat: 20.0059, lng: 73.7898, time: '08:15', date: '11 Sep 2026' },
      { name: 'Sinnar checkpoint', lat: 19.8456, lng: 73.9988, time: '09:05', date: '11 Sep 2026' },
      { name: 'Sangamner hub', lat: 19.5679, lng: 74.2115, time: '10:00', date: '11 Sep 2026' },
      { name: 'Akluj hub', lat: 17.8827, lng: 74.3724, time: '11:25', date: '11 Sep 2026' },
      { name: 'Pune corridor', lat: 18.5204, lng: 73.8567, time: 'Live now', date: '11 Sep 2026' },
    ],
  },
};
const trackingOrder = trackingOrders[trackingOrderId] || trackingOrders['KS-1043'];
let googleMap;
let googleMarker;
let latestTrackingState = trackingOrder;
let authRole = null;
try {
  authRole = JSON.parse(localStorage.getItem('kisansetu_auth') || sessionStorage.getItem('kisansetu_auth') || 'null')?.role;
} catch {
  authRole = null;
}
const ordersPage = authRole === 'FARMER' ? 'farmer-dashboard.html' : 'buyer-dashboard.html';
document.querySelector('.tracking-back').href = `${ordersPage}#orders`;

function updateTrackingDetails(payload = {}) {
  const state = {
    ...trackingOrder,
    ...payload,
    route: Array.isArray(payload.route) && payload.route.every((point) => Number.isFinite(point.lat))
      ? payload.route
      : trackingOrder.route,
  };
  latestTrackingState = state;
  document.getElementById('tracking-order-id').textContent = trackingOrderId;
  document.getElementById('tracking-item').textContent = state.item_name || state.item;
  document.getElementById('tracking-quantity').textContent = formatLocalizedUnit(state.quantity || 1200, 'kg');
  document.getElementById('tracking-vehicle').textContent = state.vehicle || trackingOrder.vehicle;
  document.getElementById('tracking-eta').textContent = formatEta(Number(state.eta_minutes || 140));
  document.getElementById('tracking-stop').textContent = state.current_stop || 'Pune corridor';
  document.getElementById('tracking-partner').textContent = state.farmer_name || state.partner;
  renderTrackingHistory(state.tracking_history || state.route || trackingOrder.route, state.active_index);
  updateGoogleMarker(state);
}

function formatEta(minutes) {
  return `${formatLocalizedUnit(Math.floor(minutes / 60), 'hour')} ${formatLocalizedUnit(minutes % 60, 'minute')}`;
}

function showMapUnavailable() {
  const map = document.getElementById('google-map');
  const livePoint = latestTrackingState.current_location || latestTrackingState.route[latestTrackingState.route.length - 1];
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(`${livePoint.lat},${livePoint.lng}`)}&z=8&output=embed`;
  map.hidden = false;
  map.innerHTML = `<iframe class="embedded-google-map" title="Live shipment location on Google Maps" src="${mapUrl}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
}

function initGoogleMap() {
  const route = latestTrackingState.route;
  googleMap = new google.maps.Map(document.getElementById('google-map'), { center: route[2], zoom: 8, mapTypeControl: false, streetViewControl: false });
  new google.maps.Polyline({ map: googleMap, path: route, strokeColor: '#8ca49a', strokeOpacity: 0.85, strokeWeight: 5 });
  route.slice(0, -1).forEach((point, index) => new google.maps.Marker({
    map: googleMap,
    position: point,
    title: `${point.name} · ${point.date} ${point.time}`,
    label: { text: String(index + 1), color: '#ffffff', fontSize: '11px' },
    icon: { path: google.maps.SymbolPath.CIRCLE, scale: 9, fillColor: '#8ca49a', fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 2 },
  }));
  googleMarker = new google.maps.Marker({
    map: googleMap,
    position: latestTrackingState.current_location || route[route.length - 1],
    title: trackingOrder.item,
    icon: { path: google.maps.SymbolPath.CIRCLE, scale: 11, fillColor: '#e53935', fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 3 },
  });
}

function updateGoogleMarker(state) {
  if (!googleMarker || !googleMap) return;
  const route = state.route || trackingOrder.route;
  const activeIndex = Math.min(Number(state.active_index ?? route.length - 1), route.length - 1);
  const activePoint = state.current_location || route[activeIndex];
  if (!activePoint?.lat) return;
  googleMarker.setPosition(activePoint);
  googleMarker.setTitle(`${state.item_name || trackingOrder.item} · ${activePoint.name || 'Live location'}`);
  googleMap.panTo(activePoint);
}

function renderTrackingHistory(route, activeIndex) {
  const list = document.getElementById('tracking-history-list');
  if (!list) return;
  const current = Number(activeIndex ?? route.length - 1);
  list.innerHTML = route.map((point, index) => `
    <article class="history-entry ${index === current ? 'current' : ''}">
      <strong>${point.name || point.label || 'Route point'}</strong>
      <span>${point.status === 'LIVE' || index === current ? t('dashboard.liveLocation') : t('dashboard.previousTracking')}</span>
      <time>${point.timestamp ? new Date(point.timestamp).toLocaleString() : `${point.date || '11 Sep 2026'} · ${point.time || '--'}`}</time>
    </article>
  `).join('');
}

function loadGoogleMaps() {
  const apiKey = document.querySelector('meta[name="google-maps-api-key"]')?.content;
  if (!apiKey) {
    showMapUnavailable();
    return;
  }
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&callback=initGoogleMap`;
  script.async = true;
  script.onerror = showMapUnavailable;
  window.initGoogleMap = initGoogleMap;
  document.head.appendChild(script);
}

async function refreshTracking() {
  try {
    const response = await fetch(`${TRACKING_API}/orders/1/tracking`);
    if (!response.ok) return;
    const payload = await response.json();
    updateTrackingDetails(payload);
  } catch (error) {
    updateTrackingDetails();
  }
}

updateTrackingDetails();
loadGoogleMaps();
refreshTracking();
setInterval(refreshTracking, 5000);
