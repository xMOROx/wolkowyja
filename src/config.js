// Zmienne środowiskowe pobierane z Vite (np. z pliku .env.local lub GitHub Secrets)
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
