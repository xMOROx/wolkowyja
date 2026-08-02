import { eventStore } from '../../store/eventStore.js';
import { escapeHtml } from '../../utils/dom.js';

export function initArrival() {
  render();
  eventStore.subscribe(render);
}

function render() {
  const list = document.getElementById('arrival-steps-list');
  const d = eventStore.eventDetails;
  if (!list || !d) return;

  const steps = d.arrivalSteps || [];
  if (steps.length === 0) {
    list.innerHTML = `<li class="arrival-step"><span class="arrival-step-text">${escapeHtml(d.arrivalInstructions || '')}</span></li>`;
    return;
  }

  list.innerHTML = steps.map((step, i) => `
    <li class="arrival-step">
      <span class="arrival-step-index">${i + 1}</span>
      <span class="arrival-step-text">${escapeHtml(step)}</span>
    </li>
  `).join('');
}
