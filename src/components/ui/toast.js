import { escapeHtml } from '../../utils/dom.js';

let toastContainer = null;

function getContainer() {
  if (!toastContainer || !document.contains(toastContainer)) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-root';
    toastContainer.setAttribute('aria-live', 'polite');
    toastContainer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = 'success', duration = 3200) {
  const container = getContainer();

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `
    <span class="toast-message">${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('toast-visible');
  });

  setTimeout(() => {
    toast.classList.remove('toast-visible');
    setTimeout(() => {
      toast.remove();
    }, 200);
  }, duration);
}
