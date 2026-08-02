import { escapeHtml } from '../../utils/dom.js';

export function openPromptModal({
  title = 'Podaj informację',
  label = '',
  placeholder = '',
  confirmLabel = 'Zapisz',
  cancelLabel = 'Anuluj'
}) {
  return new Promise((resolve) => {
    const existing = document.getElementById('modal-prompt-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'modal-prompt-overlay';
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    overlay.innerHTML = `
      <div class="modal-card glass-panel reveal-visible">
        <h3 class="modal-title">${escapeHtml(title)}</h3>
        ${label ? `<p class="modal-label">${escapeHtml(label)}</p>` : ''}
        <div class="form-group" style="margin-top: 16px;">
          <input type="text" id="modal-prompt-input" class="form-input" placeholder="${escapeHtml(placeholder)}" autofocus />
        </div>
        <div class="modal-actions" style="display: flex; gap: 12px; margin-top: 20px; justify-content: flex-end;">
          <button type="button" id="modal-btn-cancel" class="btn btn-secondary btn-sm">${escapeHtml(cancelLabel)}</button>
          <button type="button" id="modal-btn-confirm" class="btn btn-primary btn-sm">${escapeHtml(confirmLabel)}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const input = overlay.querySelector('#modal-prompt-input');
    const btnCancel = overlay.querySelector('#modal-btn-cancel');
    const btnConfirm = overlay.querySelector('#modal-btn-confirm');

    setTimeout(() => input?.focus(), 50);

    function cleanup(val) {
      overlay.remove();
      window.removeEventListener('keydown', handleKeydown);
      resolve(val);
    }

    function handleKeydown(e) {
      if (e.key === 'Escape') cleanup(null);
      if (e.key === 'Enter') handleConfirm();
    }

    function handleConfirm() {
      const val = input.value.trim();
      if (!val) {
        input.classList.add('input-error');
        return;
      }
      cleanup(val);
    }

    btnCancel.addEventListener('click', () => cleanup(null));
    btnConfirm.addEventListener('click', handleConfirm);
    window.addEventListener('keydown', handleKeydown);
  });
}
