import { EVENT_DETAILS } from '../data/initialData.js';

let map = null;
let destinationMarker = null;
let userMarker = null;
let routeLine = null;

// Obliczanie dystansu w km (Wzór Haversine)
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Promień Ziemi w km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function initMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement || typeof L === 'undefined') return;

  const destLat = EVENT_DETAILS.coords.lat;
  const destLng = EVENT_DETAILS.coords.lng;

  // Inicjalizacja Leaflet
  map = L.map('map').setView([destLat, destLng], 13);

  // Kafelki mapy (Ciemny motyw CartoDB Dark Matter)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Dedykowana ikona ogniska
  const bonfireIcon = L.divIcon({
    className: 'custom-bonfire-marker',
    html: `
      <div style="
        background: linear-gradient(135deg, #FF6B00, #F59E0B);
        width: 42px;
        height: 42px;
        border-radius: 50%;
        border: 3px solid #FFF;
        box-shadow: 0 0 20px rgba(255,107,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
      ">🔥</div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21]
  });

  // Dodanie pinezki celu
  destinationMarker = L.marker([destLat, destLng], { icon: bonfireIcon }).addTo(map);
  destinationMarker.bindPopup(`
    <div style="font-family: sans-serif; text-align: center; color: #111;">
      <h4 style="margin: 0 0 5px 0; font-size: 16px;">🔥 ${EVENT_DETAILS.title}</h4>
      <p style="margin: 0; font-size: 13px; color: #555;">${EVENT_DETAILS.locationName}</p>
      <small style="color: #FF6B00; font-weight: bold;">Szer: ${destLat}, Dł: ${destLng}</small>
    </div>
  `).openPopup();

  // Podpięcie przycisku geolokalizacji
  const btnLocate = document.getElementById('btn-get-location');
  if (btnLocate) {
    btnLocate.addEventListener('click', handleUserGeolocation);
  }
}

function handleUserGeolocation() {
  const btnLocate = document.getElementById('btn-get-location');
  const errorMsg = document.getElementById('location-error');
  const userLocText = document.getElementById('user-location-text');
  const routeInfo = document.getElementById('route-info');
  const distText = document.getElementById('route-distance');
  const durText = document.getElementById('route-duration');
  const gmapsNavBtn = document.getElementById('btn-google-maps-nav');

  if (!navigator.geolocation) {
    if (errorMsg) {
      errorMsg.textContent = "Twoja przeglądarka nie wspiera geolokalizacji HTML5.";
      errorMsg.classList.remove('hidden');
    }
    return;
  }

  // Efekt ładowania
  if (btnLocate) {
    btnLocate.disabled = true;
    btnLocate.innerHTML = `<span class="spinner"></span> Odczytywanie pozycji GPS...`;
  }
  if (errorMsg) errorMsg.classList.add('hidden');

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const uLat = position.coords.latitude;
      const uLng = position.coords.longitude;
      const destLat = EVENT_DETAILS.coords.lat;
      const destLng = EVENT_DETAILS.coords.lng;

      // Zmień treść przycisku
      if (btnLocate) {
        btnLocate.disabled = false;
        btnLocate.innerHTML = `<i data-lucide="check-circle"></i> Trasa Wyznaczona! Pokaż Ponownie`;
      }

      if (userLocText) {
        userLocText.textContent = `Szer: ${uLat.toFixed(4)}, Dł: ${uLng.toFixed(4)} (GPS)`;
      }

      // Aktualizuj przycisk nawigacji w Google Maps
      if (gmapsNavBtn) {
        gmapsNavBtn.href = `https://www.google.com/maps/dir/?api=1&origin=${uLat},${uLng}&destination=${destLat},${destLng}&travelmode=driving`;
      }

      // Usunięcie poprzednich znaczników i linii trasy
      if (userMarker) map.removeLayer(userMarker);
      if (routeLine) map.removeLayer(routeLine);

      // Ikona użytkownika
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="
            background: #3B82F6;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid #FFF;
            box-shadow: 0 0 15px rgba(59,130,246,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
          ">📍</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      userMarker = L.marker([uLat, uLng], { icon: userIcon }).addTo(map);
      userMarker.bindPopup("<b>Twoja aktualna pozycja</b>").openPopup();

      // Rysuj linię trasy
      routeLine = L.polyline([
        [uLat, uLng],
        [destLat, destLng]
      ], {
        color: '#FF6B00',
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8'
      }).addTo(map);

      // Dopasuj widok mapy do obu punktów
      const bounds = L.latLngBounds([
        [uLat, uLng],
        [destLat, destLng]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });

      // Oblicz odległość i szacowany czas dojazdu (zakładając ok. 60 km/h średnio)
      const distKm = calculateHaversineDistance(uLat, uLng, destLat, destLng);
      const estMinutes = Math.round((distKm / 60) * 60);

      if (distText) distText.textContent = `${distKm.toFixed(1)} km`;
      if (durText) {
        if (estMinutes > 60) {
          const hrs = Math.floor(estMinutes / 60);
          const mins = estMinutes % 60;
          durText.textContent = `ok. ${hrs}h ${mins}min`;
        } else {
          durText.textContent = `ok. ${estMinutes} min`;
        }
      }

      if (routeInfo) routeInfo.classList.remove('hidden');

      // Ponowne odświeżenie ikonek Lucide
      if (window.lucide) window.lucide.createIcons();
    },
    (err) => {
      if (btnLocate) {
        btnLocate.disabled = false;
        btnLocate.innerHTML = `<i data-lucide="crosshair"></i> Ponów Próbę GPS`;
      }
      if (errorMsg) {
        let msg = "Błąd odczytu GPS: ";
        if (err.code === err.PERMISSION_DENIED) {
          msg += "Brak zgody na geolokalizację w przeglądarce. Zezwól na dostęp i spróbuj ponownie.";
        } else {
          msg += "Nie udało się ustalić pozycji.";
        }
        errorMsg.textContent = msg;
        errorMsg.classList.remove('hidden');
      }
      if (window.lucide) window.lucide.createIcons();
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}
