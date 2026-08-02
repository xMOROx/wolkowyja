import { eventStore } from '../../store/eventStore.js';
import { escapeHtml } from '../../utils/dom.js';
import { openPromptModal } from '../ui/modal.js';
import { showToast } from '../ui/toast.js';

export function initChecklist() {
  const btnAdd = document.getElementById('btn-add-item');
  const inputAdd = document.getElementById('new-item-input');

  if (btnAdd && inputAdd) {
    btnAdd.addEventListener('click', async () => {
      const text = inputAdd.value.trim();
      if (!text) return;
      await eventStore.addChecklistItem(text);
      inputAdd.value = '';
      showToast('Dodano do listy', 'success');
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
    container.innerHTML = `<div style="color: var(--color-text-muted); text-align: center; padding: 20px 0;">Lista jest pusta — dodaj pierwszą pozycję poniżej.</div>`;
    return;
  }

  container.innerHTML = items.map(i => {
    const isDone = i.completed;
    const claimBadge = i.claimedBy 
      ? `<span class="stat-tag tag-yes">${escapeHtml(i.claimedBy)}</span>` 
      : `<span class="stat-tag tag-maybe">Do wzięcia</span>`;

    return `
      <div class="check-item ${isDone ? 'completed' : ''}" data-id="${i.id}" role="button" tabindex="0" aria-pressed="${isDone}">
        <div style="display: flex; align-items: center; gap: 10px;">
          <i data-lucide="${isDone ? 'check-square' : 'square'}" style="color: ${isDone ? 'var(--color-pine)' : 'var(--color-text-dim)'}; flex-shrink:0;"></i>
          <span>${escapeHtml(i.item)}</span>
        </div>
        <div>${claimBadge}</div>
      </div>
    `;
  }).join('');

  const itemEls = container.querySelectorAll('.check-item');
  itemEls.forEach(el => {
    const handleToggle = async () => {
      const id = el.dataset.id;
      const item = eventStore.checklist.find(x => x.id === id);
      if (!item) return;

      const willComplete = !item.completed;
      let claimedBy = item.claimedBy;

      if (willComplete && !claimedBy) {
        claimedBy = await openPromptModal({
          title: 'Kto to przynosi?',
          label: 'Podaj imię, aby oznaczyć pozycję jako zabraną',
          placeholder: 'np. Kasia',
          confirmLabel: 'Zapisz',
          cancelLabel: 'Anuluj'
        });
        if (!claimedBy) return;
      }

      await eventStore.toggleChecklistItem(id, claimedBy);
      showToast(willComplete ? `Oznaczono: ${item.item}` : `Cofnięto: ${item.item}`, 'success');
    };

    el.addEventListener('click', handleToggle);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
    });
  });

  if (window.lucide) window.lucide.createIcons();
}
