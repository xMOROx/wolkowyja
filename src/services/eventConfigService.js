import { supabase, isSupabaseConfigured } from './supabaseClient.js';
import { formatDateStringPl, formatDeadlineStringPl } from '../utils/format.js';

function mapRow(row) {
  return {
    title: row.title,
    locationName: row.location_name,
    coords: { lat: row.lat, lng: row.lng },
    dateString: formatDateStringPl(row.event_date),
    timeString: "Najwcześniejszy przyjazd: 18:00 - 19:00",
    rsvpDeadlineString: formatDeadlineStringPl(row.rsvp_deadline),
    eventTargetDate: row.event_date,
    rsvpDeadlineDate: row.rsvp_deadline,
    hostPhone: row.host_phone_display,
    hostPhoneRaw: row.host_phone_raw,
    arrivalInstructions: row.arrival_instructions,
    arrivalSteps: Array.isArray(row.arrival_steps) ? row.arrival_steps : []
  };
}

export async function fetchEventConfig() {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('event_config')
      .select('*')
      .eq('id', 1)
      .single();
    if (error || !data) return null;
    return mapRow(data);
  } catch (e) {
    console.error('eventConfigService.fetchEventConfig error:', e);
    return null;
  }
}
