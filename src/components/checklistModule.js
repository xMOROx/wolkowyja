import { INITIAL_CHECKLIST } from '../data/initialData.js';

const STORAGE_KEY = 'wolkowyja_checklist_v1';

export function getChecklist() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CHECKLIST));
    return INITIAL_CHECKLIST;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_CHECKLIST;
  }
}

export function saveChecklist(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function initChecklist() {
  const btnAdd = document.getElementById('btn-add-item');
  const inputAdd = document.getElementById('new-item-input');

  if (btnAdd && inputAdd) {
    btnAdd.addEventListener('click', () => {
      const text = inputAdd.value.trim();
      if (!text) return;

      const items = getChecklist();
      items.push({
        id: 'c_' + Date.now(),
        item: text,
        claimedBy: null,
        completed: false
      });

      saveChecklist(items);
      inputAdd.value = '';
      renderChecklist();
    });

    inputAdd.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        btnAdd.click();
      }
    });
  }

  renderChecklist();
}

export function renderChecklist() {
  const container = document.getElementById('checklist-container');
  const progressText = document.getElementById('checklist-progress-text');
  const progressFill = document.getElementById('checklist-progress-fill');

  if (!container) return;

  const items = getChecklist();

  // Obliczanie postępu
  const completedCount = items.filter(i => i.completed).length;
  const percent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  if (progressText) progressText.textContent = `${percent}% (${completedCount}/${items.length})`;
  if (progressFill) progressFill.style.width = `${percent}%`;

  if (items.length === 0) {
    container.innerHTML = `<div style="color: var(--text-muted); text-align: center;">Brak pozycji na liście. Dodaj pierwszą!</div>`;
    return;
  }

  container.innerHTML = items.map(i => {
    const isDone = i.completed;
    const claimBadge = i.claimedBy ? `<span class="stat-tag tag-yes">${escapeHtml(i.claimedBy)}</span>` : `<span class="stat-tag tag-maybe">Do wzięcia</span>`;

    return `
      <div class="check-item ${isDone ? 'completed' : ''}" data-id="${i.id}">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <i data-lucide="${isDone ? 'check-square' : 'square'}" style="color: ${isDone ? 'var(--accent-emerald)' : 'var(--text-muted)'}; flex-shrink: 0;"></i>
          <span>${escapeHtml(i.item)}</span>
        </div>
        <div>
          ${claimBadge}
        </div>
      </div>
    `;
  }).join('');

  // Kliknięcie przełącza status
  const itemEls = container.querySelectorAll('.check-item');
  itemEls.forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      const currentItems = getChecklist();
      const target = currentItems.find(x => x.id === id);
      if (target) {
        target.completed = !target.completed;
        if (target.completed && !target.claimedBy) {
          const name = prompt('Twój nick / imię (kto przynosi?):', 'Znajomy');
          if (name) target.claimedBy = name;
        }
        saveChecklist(currentItems);
        renderChecklist();
      }
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
