import { INITIAL_GUESTS } from '../data/initialData.js';
import { supabase, isSupabaseConfigured } from '../services/supabase.js';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'wolkowyja_guests_v1';
let activeFilter = 'all';
let currentGuests = [];

export function getGuests() {
  return currentGuests;
}

export async function initRSVP() {
  const form = document.getElementById('rsvp-form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
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

  await loadGuests();

  // Subskrypcja Realtime w Supabase jeśli jest skonfigurowany
  if (isSupabaseConfigured()) {
    supabase
      .channel('public:guests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'guests' }, () => {
        loadGuests();
      })
      .subscribe();
  }
}

async function loadGuests() {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('guests').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        currentGuests = data.map(g => ({
          id: g.id,
          name: g.name,
          status: g.status,
          plusCount: g.plus_count || 0,
          transport: g.transport,
          bringing: g.bringing,
          createdAt: g.created_at
        }));
        renderGuestList();
        return;
      }
    } catch (e) {
      console.error("Błąd pobierania gości z Supabase:", e);
    }
  }

  // Fallback do localStorage
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    currentGuests = INITIAL_GUESTS;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GUESTS));
  } else {
    try {
      currentGuests = JSON.parse(saved);
    } catch (e) {
      currentGuests = INITIAL_GUESTS;
    }
  }
  renderGuestList();
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('guest-name');
  const statusSelect = document.getElementById('guest-status');
  const plusInput = document.getElementById('guest-plus');
  const transportSelect = document.getElementById('guest-transport');
  const bringingInput = document.getElementById('guest-bringing');

  const name = nameInput.value.trim();
  if (!name) return;

  const newGuest = {
    id: 'g_' + Date.now(),
    name: name,
    status: statusSelect.value,
    plusCount: parseInt(plusInput.value, 10) || 0,
    transport: transportSelect.value,
    bringing: bringingInput.value.trim() || 'Dobre chęci',
    createdAt: Date.now()
  };

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('guests').insert([{
        name: newGuest.name,
        status: newGuest.status,
        plus_count: newGuest.plusCount,
        transport: newGuest.transport,
        bringing: newGuest.bringing
      }]);
    } catch (err) {
      console.error("Błąd zapisu do Supabase:", err);
    }
  }

  // Zapis w localStorage dla wsparcia offline
  const existingIdx = currentGuests.findIndex(g => g.name.toLowerCase() === name.toLowerCase());
  if (existingIdx !== -1) {
    currentGuests[existingIdx] = newGuest;
  } else {
    currentGuests.unshift(newGuest);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentGuests));

  renderGuestList();
  e.target.reset();

  if (newGuest.status === 'yes') {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  }
}

export function renderGuestList() {
  const container = document.getElementById('guest-list-container');
  const confirmedCountEl = document.getElementById('confirmed-count');
  const statYesEl = document.getElementById('stat-yes');
  const statMaybeEl = document.getElementById('stat-maybe');

  if (!container) return;

  const guests = currentGuests;
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
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem 0;">Brak zgłoszeń. Bądź pierwszy!</div>`;
    return;
  }

  const transportLabels = {
    car_driver: '🚗 Kierowca',
    car_passenger: '🚘 Pasażer',
    needs_ride: '🙋 Szuka autka',
    other: '🚲 Na miejscu'
  };

  container.innerHTML = filtered.map(g => {
    let statusBadge = '';
    if (g.status === 'yes') statusBadge = `<span class="stat-tag tag-yes"><i data-lucide="check"></i> Będzie</span>`;
    else if (g.status === 'maybe') statusBadge = `<span class="stat-tag tag-maybe"><i data-lucide="help-circle"></i> Może</span>`;
    else statusBadge = `<span class="stat-tag tag-no"><i data-lucide="x"></i> Nie będzie</span>`;

    const plusText = g.plusCount > 0 ? ` (+${g.plusCount} os.)` : '';
    const transportText = transportLabels[g.transport] || '';

    return `
      <div class="guest-item">
        <div class="guest-info">
          <strong>${escapeHtml(g.name)}${plusText}</strong>
          <div class="guest-details-sub">
            ${transportText ? `<span style="margin-right: 8px;">${transportText}</span>` : ''}
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
