import { eventStore } from '../../store/eventStore.js';

let map = null;
let marker = null;

export function initMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement || typeof L === 'undefined') return;

  renderMap();
  eventStore.subscribe(renderMap);
}

function renderMap() {
  const d = eventStore.eventDetails;
  if (!d || !d.coords) return;

  const destLat = d.coords.lat;
  const destLng = d.coords.lng;

  if (!map) {
    map = L.map('map', {
      scrollWheelZoom: false
    }).setView([destLat, destLng], 14);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19
    }).addTo(map);

    const markerIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div class="map-pin-pulse"></div>
        <div style="
          position: relative;
          z-index: 2;
          background: var(--color-ember, #F97316);
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

    marker = L.marker([destLat, destLng], { icon: markerIcon }).addTo(map);
  } else {
    map.setView([destLat, destLng], 14);
    marker.setLatLng([destLat, destLng]);
  }

  marker.bindPopup(`
    <div style="font-family: var(--font-sans, sans-serif); text-align: center; padding: 4px;">
      <strong style="font-size: 14px; display: block; margin-bottom: 2px; color: var(--color-text-main, #FFF);">${d.title}</strong>
      <span style="font-size: 12px; color: var(--color-text-muted, #999);">${d.locationName}</span>
    </div>
  `);
}
