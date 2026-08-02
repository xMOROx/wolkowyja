import { EVENT_DETAILS } from '../data/initialData.js';

let map = null;

export function initMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement || typeof L === 'undefined') return;

  const destLat = EVENT_DETAILS.coords.lat;
  const destLng = EVENT_DETAILS.coords.lng;

  // Inicjalizacja czystej mapy Leaflet
  map = L.map('map', {
    scrollWheelZoom: false
  }).setView([destLat, destLng], 14);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19
  }).addTo(map);

  // Elegencka ikona pinezki
  const markerIcon = L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background: #F97316;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 2px solid #FFF;
        box-shadow: 0 4px 14px rgba(249, 115, 22, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFF;
        font-weight: bold;
      ">📍</div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });

  const marker = L.marker([destLat, destLng], { icon: markerIcon }).addTo(map);
  marker.bindPopup(`
    <div style="font-family: sans-serif; text-align: center; color: #111; padding: 4px;">
      <strong style="font-size: 14px; display: block; margin-bottom: 2px;">${EVENT_DETAILS.title}</strong>
      <span style="font-size: 12px; color: #666;">${EVENT_DETAILS.locationName}</span>
    </div>
  `).openPopup();
}
