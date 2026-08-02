import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config.js';

let supabaseClient = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL !== "" && !SUPABASE_URL.includes("TWOJ_SUPABASE_URL")) {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log("🔥 Połączono z Supabase Realtime Database!");
} else {
  console.log("ℹ️ Supabase nie jest jeszcze skonfigurowany. Używam trybu awaryjnego (localStorage).");
}

export const supabase = supabaseClient;
export const isSupabaseConfigured = () => !!supabaseClient;
