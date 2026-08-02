import './style.css';
import { createIcons, icons } from 'lucide';
import { initMap } from './components/mapModule.js';
import { initRSVP } from './components/rsvpModule.js';
import { initChecklist } from './components/checklistModule.js';
import { initCarpool } from './components/carpoolModule.js';
import { initCountdown } from './components/countdownModule.js';

document.addEventListener('DOMContentLoaded', () => {
  // Inicjalizacja ikonek Lucide
  createIcons({ icons });

  // Inicjalizacja poszczególnych modułów
  initCountdown();
  initMap();
  initRSVP();
  initChecklist();
  initCarpool();
});
