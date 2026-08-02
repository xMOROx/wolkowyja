import { EVENT_DETAILS_FALLBACK, INITIAL_GUESTS, INITIAL_CHECKLIST } from '../data/fallbackData.js';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient.js';
import { fetchEventConfig } from '../services/eventConfigService.js';
import { fetchGuestsRemote, upsertGuestRemote } from '../services/guestsService.js';
import { fetchChecklistRemote, insertChecklistItemRemote, updateChecklistItemRemote } from '../services/checklistService.js';

const STORAGE_KEYS = {
  GUESTS: 'wolkowyja_v2_guests',
  CHECKLIST: 'wolkowyja_v2_checklist'
};

class EventStore {
  constructor() {
    this.eventDetails = null;
    this.guests = [];
    this.checklist = [];
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }

  async init() {
    await this.loadEventConfig();
    await this.loadGuests();
    await this.loadChecklist();

    if (isSupabaseConfigured()) {
      supabase
        .channel('public:event_config_v1')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'event_config' }, () => this.loadEventConfig())
        .subscribe();

      supabase
        .channel('public:guests_v1')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'guests' }, () => this.loadGuests())
        .subscribe();

      supabase
        .channel('public:checklist_v1')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'checklist' }, () => this.loadChecklist())
        .subscribe();
    }
  }

  async loadEventConfig() {
    const remoteConfig = await fetchEventConfig();
    this.eventDetails = remoteConfig || EVENT_DETAILS_FALLBACK;
    this.notify();
  }

  async loadGuests() {
    const remoteGuests = await fetchGuestsRemote();
    if (remoteGuests) {
      this.guests = remoteGuests;
      this.notify();
      return;
    }

    const saved = localStorage.getItem(STORAGE_KEYS.GUESTS);
    if (!saved) {
      this.guests = INITIAL_GUESTS;
      localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(INITIAL_GUESTS));
    } else {
      try {
        this.guests = JSON.parse(saved);
      } catch (e) {
        this.guests = INITIAL_GUESTS;
      }
    }
    this.notify();
  }

  async addGuest(guestData) {
    const newGuest = {
      id: 'g_' + Date.now(),
      ...guestData,
      createdAt: Date.now()
    };

    await upsertGuestRemote(newGuest);

    const existingIdx = this.guests.findIndex(g => g.name.toLowerCase() === newGuest.name.toLowerCase());
    if (existingIdx !== -1) {
      this.guests[existingIdx] = newGuest;
    } else {
      this.guests.unshift(newGuest);
    }

    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(this.guests));
    this.notify();
  }

  async loadChecklist() {
    const remoteChecklist = await fetchChecklistRemote();
    if (remoteChecklist && remoteChecklist.length > 0) {
      this.checklist = remoteChecklist;
      this.notify();
      return;
    }

    const saved = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
    if (!saved) {
      this.checklist = INITIAL_CHECKLIST;
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(INITIAL_CHECKLIST));
    } else {
      try {
        this.checklist = JSON.parse(saved);
      } catch (e) {
        this.checklist = INITIAL_CHECKLIST;
      }
    }
    this.notify();
  }

  async toggleChecklistItem(id, claimedByOverride) {
    const target = this.checklist.find(x => x.id === id);
    if (!target) return;

    target.completed = !target.completed;
    if (claimedByOverride !== undefined) {
      target.claimedBy = claimedByOverride;
    }

    await updateChecklistItemRemote(id, { completed: target.completed, claimedBy: target.claimedBy });

    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(this.checklist));
    this.notify();
  }

  async addChecklistItem(itemName) {
    const newItem = {
      id: 'c_' + Date.now(),
      item: itemName,
      claimedBy: null,
      completed: false
    };

    await insertChecklistItemRemote(itemName);

    this.checklist.push(newItem);
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(this.checklist));
    this.notify();
  }
}

export const eventStore = new EventStore();
