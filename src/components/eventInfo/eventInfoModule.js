import { createIcons, icons } from 'lucide';
import { eventStore } from '../../store/eventStore.js';
import { formatDateShortPl, formatDayNamePl, formatDeadlineShortPl, formatDeadlineTimePl } from '../../utils/format.js';
import { escapeHtml } from '../../utils/dom.js';

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
  setText('info-date-sub', `Najwcześniejszy przyjazd`);
  setText('info-rsvp-deadline', formatDeadlineShortPl(d.rsvpDeadlineDate));
  setText('info-rsvp-deadline-sub', 'Ostateczny termin');
  setText('info-location', placeName);

  // Map section
  setText('map-location-name', `${placeName} (Działka)`);
  setText('map-coords', `${d.coords.lat}, ${d.coords.lng}`);

  // Links
  setHref('link-call-organizer', `tel:${d.hostPhoneRaw}`);
  setHref('link-maps-search', `https://www.google.com/maps/search/${d.coords.lat},+${d.coords.lng}`);
  setHref('link-maps-directions', `https://www.google.com/maps/dir/?api=1&destination=${d.coords.lat},${d.coords.lng}`);

  // Packing Items
  renderPackingItems(d.packingItems);
}

function renderPackingItems(items) {
  const container = document.getElementById('packing-items-container');
  if (!container) return;

  if (!Array.isArray(items) || items.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--color-text-muted); padding: 24px 0; grid-column: 1 / -1;">Zabierz ze sobą to, co uważasz za przydatne na ognisko!</div>`;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="packing-item">
      <div class="packing-item__icon"><i data-lucide="${escapeHtml(item.icon || 'check-circle')}"></i></div>
      <div class="packing-item__body">
        <strong>${escapeHtml(item.title || '')}</strong>
        <span>${escapeHtml(item.desc || '')}</span>
      </div>
    </div>
  `).join('');

  createIcons({ icons });
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
  if (!locationName) return 'Wołkowyja';
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
