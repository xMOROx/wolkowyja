import './style.css';
import { createIcons, icons } from 'lucide';
import { eventStore } from './store/eventStore.js';
import { initEventInfo } from './components/eventInfo/eventInfoModule.js';
import { initCountdown } from './components/countdown/countdownModule.js';
import { initMap } from './components/map/mapModule.js';
import { initArrival } from './components/arrival/arrivalModule.js';
import { initRSVP } from './components/rsvp/rsvpModule.js';
import { initChecklist } from './components/checklist/checklistModule.js';
import { initEmberField } from './components/ui/emberField.js';
import { initScrollReveal } from './components/ui/scrollReveal.js';

document.addEventListener('DOMContentLoaded', async () => {
  createIcons({ icons });

  initEmberField(document.getElementById('ember-canvas'));

  await eventStore.init();

  initEventInfo();
  initCountdown();
  initMap();
  initArrival();
  initRSVP();
  initChecklist();

  initScrollReveal();
});
