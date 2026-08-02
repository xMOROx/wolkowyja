const DAYS_PL = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
const MONTHS_PL = ['Stycznia', 'Lutego', 'Marca', 'Kietnia', 'Maja', 'Czerwca', 'Lipca', 'Sierpnia', 'Września', 'Października', 'Listopada', 'Grudnia'];

export function formatDateStringPl(isoDateStr) {
  if (!isoDateStr) return 'Sobota, 12 Września 2026';
  try {
    const d = new Date(isoDateStr);
    if (isNaN(d.getTime())) return isoDateStr;
    const dayName = DAYS_PL[d.getDay()];
    const dayNum = d.getDate();
    const monthName = MONTHS_PL[d.getMonth()];
    const year = d.getFullYear();
    return `${dayName}, ${dayNum} ${monthName} ${year}`;
  } catch (e) {
    return isoDateStr;
  }
}

export function formatDateShortPl(isoDateStr) {
  if (!isoDateStr) return '12 Września 2026';
  try {
    const d = new Date(isoDateStr);
    if (isNaN(d.getTime())) return isoDateStr;
    return `${d.getDate()} ${MONTHS_PL[d.getMonth()]} ${d.getFullYear()}`;
  } catch (e) {
    return isoDateStr;
  }
}

export function formatDayNamePl(isoDateStr) {
  if (!isoDateStr) return 'Sobota';
  try {
    const d = new Date(isoDateStr);
    if (isNaN(d.getTime())) return '';
    return DAYS_PL[d.getDay()];
  } catch (e) {
    return '';
  }
}

export function formatDeadlineStringPl(isoDateStr) {
  if (!isoDateStr) return 'Potwierdzenia do: 6 Września 2026 (godz. 23:59)';
  try {
    const d = new Date(isoDateStr);
    if (isNaN(d.getTime())) return isoDateStr;
    const dayName = DAYS_PL[d.getDay()];
    const dayNum = d.getDate();
    const monthName = MONTHS_PL[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `Potwierdzenia do: ${dayName}, ${dayNum} ${monthName} ${year} (godz. ${hours}:${minutes})`;
  } catch (e) {
    return isoDateStr;
  }
}

export function formatDeadlineShortPl(isoDateStr) {
  if (!isoDateStr) return '6 Września 2026';
  try {
    const d = new Date(isoDateStr);
    if (isNaN(d.getTime())) return isoDateStr;
    return `${d.getDate()} ${MONTHS_PL[d.getMonth()]} ${d.getFullYear()}`;
  } catch (e) {
    return isoDateStr;
  }
}

export function formatDeadlineTimePl(isoDateStr) {
  if (!isoDateStr) return 'do godz. 23:59';
  try {
    const d = new Date(isoDateStr);
    if (isNaN(d.getTime())) return 'do godz. 23:59';
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `do godz. ${hours}:${minutes}`;
  } catch (e) {
    return 'do godz. 23:59';
  }
}

export function formatPhoneDisplay(rawPhone) {
  if (!rawPhone) return '+48 600 000 000';
  const clean = rawPhone.replace(/\D/g, '');
  if (clean.length === 9) {
    return `+48 ${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
  }
  return rawPhone;
}
