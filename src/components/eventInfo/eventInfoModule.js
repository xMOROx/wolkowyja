import { eventStore } from '../../store/eventStore.js';

export function initEventInfo() {
  render();
  eventStore.subscribe(render);
}

function render() {
  const d = eventStore.eventDetails;
  if (!d) return;

  const placeName = extractPlaceName(d.locationName);

  setText('hero-title', `Ognisko w ${placeName} `);
  setText('hero-title-year', extractYear(d.eventTargetDate) || '2026');
  setText('hero-subtitle', buildHeroSubtitle(d));
  
  setText('info-date', d.dateString);
  setText('info-date-sub', d.timeString || 'Najwcześniejszy przyjazd: 18:00 - 19:00');
  setText('info-rsvp-deadline', d.rsvpDeadlineString);
  setText('info-location', placeName);
  
  setText('map-location-name', `${placeName} (Działka)`);
  setText('map-coords', `${d.coords.lat}, ${d.coords.lng}`);

  setHref('link-call-organizer', `tel:${d.hostPhoneRaw}`);
  setHref('link-maps-search', `https://www.google.com/maps/search/${d.coords.lat},+${d.coords.lng}`);
  setHref('link-maps-directions', `https://www.google.com/maps/dir/?api=1&destination=${d.coords.lat},${d.coords.lng}`);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value != null) el.textContent = value;
}

function setHref(id, value) {
  const el = document.getElementById(id);
  if (el && value != null) el.setAttribute('href', value);
}

function extractPlaceName(locationName) {
  if (!locationName) return 'Wołkowyi';
  return locationName.split(',')[0].trim();
}

function extractYear(isoDateStr) {
  if (!isoDateStr) return '2026';
  try {
    return new Date(isoDateStr).getFullYear().toString();
  } catch (e) {
    return '2026';
  }
}

function buildHeroSubtitle(d) {
  return `Spotkanie ekipy nad Jeziorem Solińskim. ${d.dateString}. ${d.timeString || ''}`.trim();
}
