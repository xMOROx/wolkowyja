import { EVENT_DETAILS, INITIAL_GUESTS, INITIAL_CHECKLIST } from '../data/initialData.js';
import { supabase, isSupabaseConfigured } from '../services/supabase.js';

const STORAGE_KEYS = {
  GUESTS: 'wolkowyja_v2_guests',
  CHECKLIST: 'wolkowyja_v2_checklist'
};

class EventStore {
  constructor() {
    this.eventDetails = EVENT_DETAILS;
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
    await this.loadGuests();
    await this.loadChecklist();

    if (isSupabaseConfigured()) {
      supabase
        .channel('public:guests_v2')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'guests' }, () => this.loadGuests())
        .subscribe();

      supabase
        .channel('public:checklist_v2')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'checklist' }, () => this.loadChecklist())
        .subscribe();
    }
  }

  async loadGuests() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('guests').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          this.guests = data.map(g => ({
            id: g.id,
            name: g.name,
            status: g.status,
            plusCount: g.plus_count || 0,
            isDrinking: g.is_drinking ?? true,
            alcoholType: g.alcohol_type || 'Nieokreślono',
            bringing: g.bringing || 'Dobre chęci',
            createdAt: g.created_at
          }));
          this.notify();
          return;
        }
      } catch (e) {
        console.error("Supabase load error:", e);
      }
    }

    // LocalStorage Fallback
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

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('guests').insert([{
          name: newGuest.name,
          status: newGuest.status,
          plus_count: newGuest.plusCount,
          is_drinking: newGuest.isDrinking,
          alcohol_type: newGuest.alcoholType,
          bringing: newGuest.bringing
        }]);
      } catch (err) {
        console.error("Supabase insert error:", err);
      }
    }

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
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('checklist').select('*').order('created_at', { ascending: true });
        if (!error && data && data.length > 0) {
          this.checklist = data.map(item => ({
            id: item.id,
            item: item.item_name,
            claimedBy: item.claimed_by,
            completed: item.completed
          }));
          this.notify();
          return;
        }
      } catch (e) {
        console.error("Supabase checklist error:", e);
      }
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

  async toggleChecklistItem(id) {
    const target = this.checklist.find(x => x.id === id);
    if (!target) return;

    target.completed = !target.completed;
    if (target.completed && !target.claimedBy) {
      const name = prompt("Kto przynosi ten przedmiot? (Podaj imię):");
      if (name) target.claimedBy = name.trim();
    }

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('checklist').update({
          completed: target.completed,
          claimed_by: target.claimedBy
        }).eq('id', id);
      } catch (e) {
        console.error("Supabase update error:", e);
      }
    }

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

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('checklist').insert([{
          item_name: newItem.item,
          claimed_by: null,
          completed: false
        }]);
      } catch (e) {
        console.error("Supabase insert error:", e);
      }
    }

    this.checklist.push(newItem);
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(this.checklist));
    this.notify();
  }
}

export const eventStore = new EventStore();
