import { eventStore } from '../store/eventStore.js';

export function initChecklist() {
  const btnAdd = document.getElementById('btn-add-item');
  const inputAdd = document.getElementById('new-item-input');

  if (btnAdd && inputAdd) {
    btnAdd.addEventListener('click', async () => {
      const text = inputAdd.value.trim();
      if (!text) return;
      await eventStore.addChecklistItem(text);
      inputAdd.value = '';
    });

    inputAdd.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') btnAdd.click();
    });
  }

  eventStore.subscribe(() => renderChecklist());
  renderChecklist();
}

export function renderChecklist() {
  const container = document.getElementById('checklist-container');
  const progressText = document.getElementById('checklist-progress-text');
  const progressFill = document.getElementById('checklist-progress-fill');

  if (!container) return;

  const items = eventStore.checklist;
  const completedCount = items.filter(i => i.completed).length;
  const percent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  if (progressText) progressText.textContent = `${percent}% (${completedCount}/${items.length})`;
  if (progressFill) progressFill.style.width = `${percent}%`;

  if (items.length === 0) {
    container.innerHTML = `<div style="color: var(--color-text-muted); text-align: center;">Brak pozycji na liście.</div>`;
    return;
  }

  container.innerHTML = items.map(i => {
    const isDone = i.completed;
    const claimBadge = i.claimedBy 
      ? `<span class="stat-tag tag-yes">${escapeHtml(i.claimedBy)}</span>` 
      : `<span class="stat-tag tag-maybe">Do wzięcia</span>`;

    return `
      <div class="check-item ${isDone ? 'completed' : ''}" data-id="${i.id}">
        <div style="display: flex; align-items: center; gap: 10px;">
          <i data-lucide="${isDone ? 'check-square' : 'square'}" style="color: ${isDone ? 'var(--color-accent-emerald)' : 'var(--color-text-dim)'};"></i>
          <span>${escapeHtml(i.item)}</span>
        </div>
        <div>${claimBadge}</div>
      </div>
    `;
  }).join('');

  const itemEls = container.querySelectorAll('.check-item');
  itemEls.forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      eventStore.toggleChecklistItem(id);
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
