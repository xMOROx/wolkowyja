import { supabase, isSupabaseConfigured } from '../services/supabaseClient.js';
import { fetchEventConfig } from '../services/eventConfigService.js';
import { fetchGuestsRemote, upsertGuestRemote } from '../services/guestsService.js';

class EventStore {
  constructor() {
    this.eventDetails = null;
    this.guests = [];
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

    if (isSupabaseConfigured()) {
      supabase
        .channel('public:event_config_v1')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'event_config' }, () => this.loadEventConfig())
        .subscribe();

      supabase
        .channel('public:guests_v1')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'guests' }, () => this.loadGuests())
        .subscribe();
    }
  }

  async loadEventConfig() {
    const remoteConfig = await fetchEventConfig();
    if (remoteConfig) {
      this.eventDetails = remoteConfig;
    }
    this.notify();
  }

  async loadGuests() {
    const remoteGuests = await fetchGuestsRemote();
    if (remoteGuests) {
      this.guests = remoteGuests;
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

    this.notify();
  }
}

export const eventStore = new EventStore();
