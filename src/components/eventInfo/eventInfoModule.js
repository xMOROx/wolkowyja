import { eventStore } from '../../store/eventStore.js';
import { formatDateShortPl, formatDayNamePl, formatDeadlineShortPl, formatDeadlineTimePl } from '../../utils/format.js';

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

  // Info cards — short format values
  setText('info-date', formatDateShortPl(d.eventTargetDate));
  setText('info-date-sub', `Najwcze\u015Bniejszy przyjazd`);
  setText('info-rsvp-deadline', formatDeadlineShortPl(d.rsvpDeadlineDate));
  setText('info-rsvp-deadline-sub', 'Ostateczny termin');
  setText('info-location', placeName);

  // Map section
  setText('map-location-name', `${placeName} (Dzia\u0142ka)`);
  setText('map-coords', `${d.coords.lat}, ${d.coords.lng}`);

  // Links
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
