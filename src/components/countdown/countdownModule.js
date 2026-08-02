import { eventStore } from '../../store/eventStore.js';

export function initCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  let lastValues = { d: '', h: '', m: '', s: '' };

  function updateBlock(el, val, key) {
    const formatted = String(val).padStart(2, '0');
    if (lastValues[key] !== formatted) {
      lastValues[key] = formatted;
      const block = el.closest('.time-block');
      if (block) {
        block.classList.add('flip');
        setTimeout(() => block.classList.remove('flip'), 250);
      }
      el.textContent = formatted;
    }
  }

  function updateTimer() {
    const d = eventStore.eventDetails;
    if (!d || !d.eventTargetDate) return;

    const target = new Date(d.eventTargetDate).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      updateBlock(daysEl, 0, 'd');
      updateBlock(hoursEl, 0, 'h');
      updateBlock(minsEl, 0, 'm');
      updateBlock(secsEl, 0, 's');
      const label = document.querySelector('.countdown-label');
      if (label) label.textContent = 'OGNISKO WŁAŚNIE TRWA!';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    updateBlock(daysEl, days, 'd');
    updateBlock(hoursEl, hours, 'h');
    updateBlock(minsEl, mins, 'm');
    updateBlock(secsEl, secs, 's');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}
