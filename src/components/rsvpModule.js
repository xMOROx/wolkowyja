import { eventStore } from '../store/eventStore.js';
import confetti from 'canvas-confetti';

let activeFilter = 'all';

export function initRSVP() {
  const form = document.getElementById('rsvp-form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  const drinkingSelect = document.getElementById('guest-drinking');
  const alcoholGroup = document.getElementById('alcohol-group');

  if (drinkingSelect && alcoholGroup) {
    drinkingSelect.addEventListener('change', (e) => {
      if (e.target.value === 'yes') {
        alcoholGroup.classList.remove('hidden');
      } else {
        alcoholGroup.classList.add('hidden');
      }
    });
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeFilter = e.target.dataset.filter;
      renderGuestList();
    });
  });

  eventStore.subscribe(() => renderGuestList());
  renderGuestList();
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('guest-name');
  const statusSelect = document.getElementById('guest-status');
  const plusInput = document.getElementById('guest-plus');
  const drinkingSelect = document.getElementById('guest-drinking');
  const alcoholInput = document.getElementById('guest-alcohol');
  const bringingInput = document.getElementById('guest-bringing');

  const name = nameInput.value.trim();
  if (!name) return;

  const isDrinking = drinkingSelect.value === 'yes';
  const alcoholType = isDrinking ? (alcoholInput.value.trim() || 'Piwo / Dowolny') : 'Bezalkoholowe';

  const newGuest = {
    name,
    status: statusSelect.value,
    plusCount: parseInt(plusInput.value, 10) || 0,
    isDrinking,
    alcoholType,
    bringing: bringingInput.value.trim() || 'Dobre chęci'
  };

  await eventStore.addGuest(newGuest);

  e.target.reset();
  if (alcoholGroup) alcoholGroup.classList.add('hidden');

  if (newGuest.status === 'yes') {
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  }
}

export function renderGuestList() {
  const container = document.getElementById('guest-list-container');
  const confirmedCountEl = document.getElementById('confirmed-count');
  const statYesEl = document.getElementById('stat-yes');
  const statMaybeEl = document.getElementById('stat-maybe');

  if (!container) return;

  const guests = eventStore.guests;
  const yesGuests = guests.filter(g => g.status === 'yes');
  const maybeGuests = guests.filter(g => g.status === 'maybe');

  const totalHeadcount = yesGuests.reduce((acc, g) => acc + 1 + (g.plusCount || 0), 0);

  if (confirmedCountEl) confirmedCountEl.textContent = totalHeadcount.toString();
  if (statYesEl) statYesEl.textContent = yesGuests.length.toString();
  if (statMaybeEl) statMaybeEl.textContent = maybeGuests.length.toString();

  let filtered = guests;
  if (activeFilter === 'yes') filtered = guests.filter(g => g.status === 'yes');
  else if (activeFilter === 'maybe') filtered = guests.filter(g => g.status === 'maybe');

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--color-text-muted); padding: 24px 0;">Brak zgłoszeń w tej kategorii.</div>`;
    return;
  }

  container.innerHTML = filtered.map(g => {
    let statusBadge = '';
    if (g.status === 'yes') statusBadge = `<span class="stat-tag tag-yes"><i data-lucide="check" style="width:12px;"></i> Będzie</span>`;
    else if (g.status === 'maybe') statusBadge = `<span class="stat-tag tag-maybe"><i data-lucide="help-circle" style="width:12px;"></i> Może</span>`;
    else statusBadge = `<span class="stat-tag"><i data-lucide="x" style="width:12px;"></i> Nie będzie</span>`;

    const plusText = g.plusCount > 0 ? ` (+${g.plusCount} os.)` : '';
    const alcoholBadge = g.isDrinking 
      ? `<span class="tag-alcohol">${escapeHtml(g.alcoholType)}</span>` 
      : `<span class="stat-tag">Bezalkoholowe</span>`;

    return `
      <div class="guest-item">
        <div class="guest-info">
          <strong style="font-size: 0.95rem; color: #FFF;">${escapeHtml(g.name)}${plusText}</strong>
          <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 4px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            ${alcoholBadge}
            <span>Przynosi: <i>${escapeHtml(g.bringing)}</i></span>
          </div>
        </div>
        <div>${statusBadge}</div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
