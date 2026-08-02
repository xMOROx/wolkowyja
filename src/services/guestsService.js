import { supabase, isSupabaseConfigured } from './supabaseClient.js';

export async function fetchGuestsRemote() {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('guests').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;
    return data.map(mapGuestRow);
  } catch (e) {
    console.error('fetchGuestsRemote error:', e);
    return null;
  }
}

export async function upsertGuestRemote(guest) {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('guests').upsert({
      name: guest.name,
      status: guest.status,
      plus_count: guest.plusCount,
      is_drinking: guest.isDrinking,
      alcohol_type: guest.alcoholType,
      bringing: guest.bringing
    }, { onConflict: 'name' });
  } catch (e) {
    console.error('upsertGuestRemote error:', e);
  }
}

function mapGuestRow(g) {
  return {
    id: g.id,
    name: g.name,
    status: g.status,
    plusCount: g.plus_count || 0,
    isDrinking: g.is_drinking ?? true,
    alcoholType: g.alcohol_type || 'Nieokreślono',
    bringing: g.bringing || 'Dobre chęci',
    createdAt: g.created_at
  };
}
