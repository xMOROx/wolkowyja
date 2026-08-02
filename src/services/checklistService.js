import { supabase, isSupabaseConfigured } from './supabaseClient.js';

export async function fetchChecklistRemote() {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('checklist').select('*').order('created_at', { ascending: true });
    if (error || !data) return null;
    return data.map(mapChecklistRow);
  } catch (e) {
    console.error('fetchChecklistRemote error:', e);
    return null;
  }
}

export async function insertChecklistItemRemote(itemName) {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('checklist').insert([{
      item_name: itemName,
      claimed_by: null,
      completed: false
    }]);
  } catch (e) {
    console.error('insertChecklistItemRemote error:', e);
  }
}

export async function updateChecklistItemRemote(id, { completed, claimedBy }) {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('checklist').update({
      completed: completed,
      claimed_by: claimedBy
    }).eq('id', id);
  } catch (e) {
    console.error('updateChecklistItemRemote error:', e);
  }
}

function mapChecklistRow(item) {
  return {
    id: item.id,
    item: item.item_name,
    claimedBy: item.claimed_by,
    completed: item.completed
  };
}
