import { INITIAL_CARPOOLS } from '../data/initialData.js';

const STORAGE_KEY = 'wolkowyja_carpools_v1';

export function getCarpools() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CARPOOLS));
    return INITIAL_CARPOOLS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_CARPOOLS;
  }
}

export function saveCarpools(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function initCarpool() {
  const modal = document.getElementById('carpool-modal');
  const btnOpen = document.getElementById('btn-open-carpool-modal');
  const btnClose = document.getElementById('btn-close-carpool-modal');
  const form = document.getElementById('carpool-form');

  if (btnOpen && modal) {
    btnOpen.addEventListener('click', () => modal.classList.remove('hidden'));
  }
  if (btnClose && modal) {
    btnClose.addEventListener('click', () => modal.classList.add('hidden'));
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const driver = document.getElementById('carpool-driver').value.trim();
      const from = document.getElementById('carpool-from').value.trim();
      const seats = parseInt(document.getElementById('carpool-seats').value, 10) || 1;
      const time = document.getElementById('carpool-time').value.trim() || 'Do uzgodnienia';

      if (!driver || !from) return;

      const list = getCarpools();
      list.push({
        id: 'cp_' + Date.now(),
        driver,
        from,
        seats,
        time,
        note: `Dodano przez ${driver}`
      });

      saveCarpools(list);
      form.reset();
      if (modal) modal.classList.add('hidden');
      renderCarpools();
    });
  }

  renderCarpools();
}

export function renderCarpools() {
  const container = document.getElementById('carpool-list-container');
  if (!container) return;

  const carpools = getCarpools();

  if (carpools.length === 0) {
    container.innerHTML = `<div style="color: var(--text-muted); text-align: center; padding: 1rem 0;">Brak zgłoszonych przejazdów. Dodaj pierwsze auto!</div>`;
    return;
  }

  container.innerHTML = carpools.map(cp => `
    <div class="carpool-card">
      <div class="carpool-header">
        <strong>🚗 ${escapeHtml(cp.driver)}</strong>
        <span class="carpool-seats-badge"><i data-lucide="users" style="width: 12px;"></i> ${cp.seats} wolne ${cp.seats === 1 ? 'miejsce' : 'miejsca'}</span>
      </div>
      <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
        <div>📍 Skąd: <strong style="color: #FFF;">${escapeHtml(cp.from)}</strong></div>
        <div>⏰ Godzina wyjazdu: <span style="color: var(--accent-amber);">${escapeHtml(cp.time)}</span></div>
        ${cp.note ? `<div style="font-style: italic; margin-top: 2px;">💬 ${escapeHtml(cp.note)}</div>` : ''}
      </div>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
