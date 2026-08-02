import './style.css';
import { createIcons, icons } from 'lucide';
import { eventStore } from './store/eventStore.js';
import { initMap } from './components/mapModule.js';
import { initRSVP } from './components/rsvpModule.js';
import { initChecklist } from './components/checklistModule.js';
import { initCountdown } from './components/countdownModule.js';

document.addEventListener('DOMContentLoaded', async () => {
  createIcons({ icons });

  await eventStore.init();

  initCountdown();
  initMap();
  initRSVP();
  initChecklist();
});
