import { format, differenceInDays, addMonths, addYears, parseISO, isValid } from 'date-fns';
import { it } from 'date-fns/locale';

export function formatDate(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '';
  return format(d, 'dd MMM yyyy', { locale: it });
}

export function formatDateShort(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '';
  return format(d, 'dd/MM', { locale: it });
}

export function daysUntil(date) {
  if (!date) return null;
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return differenceInDays(d, today);
}

export function getExpiryLevel(date) {
  const days = daysUntil(date);
  if (days === null) return 'none';
  if (days <= 0) return 'danger';
  if (days <= 2) return 'warning';
  if (days <= 7) return 'caution';
  return 'ok';
}

export function getExpiryLabel(date) {
  const days = daysUntil(date);
  if (days === null) return '';
  if (days < 0) return 'Scaduto';
  if (days === 0) return 'Scade oggi';
  if (days === 1) return 'Scade domani';
  if (days <= 7) return `Scade tra ${days}gg`;
  return formatDate(date);
}

export function getNextDueDate(currentDate, recurring) {
  const d = typeof currentDate === 'string' ? parseISO(currentDate) : currentDate;
  switch (recurring) {
    case 'monthly': return addMonths(d, 1);
    case 'bimonthly': return addMonths(d, 2);
    case 'quarterly': return addMonths(d, 3);
    case 'yearly': return addYears(d, 1);
    default: return null;
  }
}

export function toInputDate(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '';
  return format(d, 'yyyy-MM-dd');
}
