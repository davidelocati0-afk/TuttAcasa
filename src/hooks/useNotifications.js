import { useMemo } from 'react';
import { daysUntil } from '../utils/dates';

export function useNotifications(products = [], bills = []) {
  const alerts = useMemo(() => {
    const result = [];

    products.forEach(p => {
      if (!p.expiry_date) return;
      const days = daysUntil(p.expiry_date);
      if (days === null || days > 2) return;

      let message, level;
      if (days < 0) { message = `${p.name} è scaduto!`; level = 'danger'; }
      else if (days === 0) { message = `${p.name} scade oggi!`; level = 'danger'; }
      else if (days === 1) { message = `${p.name} scade domani!`; level = 'warning'; }
      else { message = `${p.name} scade tra 2 giorni`; level = 'warning'; }

      result.push({ id: `prod-${p.id}`, type: 'product_expiry', message, level, date: p.expiry_date, icon: '⚠️' });
    });

    bills.forEach(b => {
      if (b.is_paid) return;
      const days = daysUntil(b.due_date);
      if (days === null || days > 2) return;

      const amount = b.amount ? ` — €${parseFloat(b.amount).toFixed(2)}` : '';
      let message, level;
      if (days < 0) { message = `${b.name} scaduta!${amount}`; level = 'danger'; }
      else if (days === 0) { message = `${b.name} scade oggi!${amount}`; level = 'danger'; }
      else if (days === 1) { message = `${b.name} scade domani!${amount}`; level = 'warning'; }
      else { message = `${b.name} scade tra 2 giorni${amount}`; level = 'warning'; }

      result.push({ id: `bill-${b.id}`, type: 'bill_expiry', message, level, date: b.due_date, icon: '💰' });
    });

    result.sort((a, b) => {
      if (a.level === 'danger' && b.level !== 'danger') return -1;
      if (a.level !== 'danger' && b.level === 'danger') return 1;
      return new Date(a.date) - new Date(b.date);
    });

    return result;
  }, [products, bills]);

  return { alerts, alertCount: alerts.length };
}
