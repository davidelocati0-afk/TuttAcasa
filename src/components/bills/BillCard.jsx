import theme from '../../styles/theme';
import { RECURRING_LABELS } from '../../utils/constants';
import { daysUntil } from '../../utils/dates';
import ExpiryBadge from '../ui/ExpiryBadge';

function getDueBarColor(date) {
  const days = daysUntil(date);
  if (days === null) return theme.primary[200];
  if (days <= 0) return theme.danger;
  if (days <= 2) return theme.warning;
  if (days <= 7) return '#FBBF24';
  return theme.success;
}

function getDueBarWidth(date) {
  const days = daysUntil(date);
  if (days === null) return '0%';
  if (days <= 0) return '100%';
  if (days <= 7) return `${Math.max(20, 100 - days * 12)}%`;
  return '10%';
}

export default function BillCard({ bill, onTogglePaid, onEdit, onDelete }) {
  const barColor = getDueBarColor(bill.due_date);

  return (
    <div style={{
      background: theme.bg.card,
      borderRadius: '18px',
      boxShadow: bill.is_paid ? 'none' : theme.shadow.sm,
      border: `1px solid ${theme.border.light}`,
      overflow: 'hidden',
      opacity: bill.is_paid ? 0.55 : 1,
      transition: 'opacity 0.25s',
    }}>
      <div style={{ padding: '14px 14px 10px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        {/* Checkbox */}
        <button onClick={() => onTogglePaid(bill)} aria-label={bill.is_paid ? 'Segna non pagata' : 'Segna pagata'} style={{
          width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
          border: bill.is_paid ? 'none' : `2.5px solid ${theme.primary[300]}`,
          background: bill.is_paid ? theme.success : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minWidth: '44px', minHeight: '44px',
        }}>
          {bill.is_paid && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
        </button>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '16px', fontWeight: '700', color: theme.text.primary,
              textDecoration: bill.is_paid ? 'line-through' : 'none',
            }}>{bill.name}</span>
            {bill.recurring !== 'none' && RECURRING_LABELS[bill.recurring] && (
              <span style={{
                fontSize: '9px', fontWeight: '700', padding: '2px 7px', borderRadius: '6px',
                background: theme.primary[50], color: theme.primary[600],
              }}>{RECURRING_LABELS[bill.recurring]}</span>
            )}
          </div>
          <div style={{ marginTop: '4px' }}><ExpiryBadge date={bill.due_date} /></div>
        </div>

        {/* Amount */}
        {bill.amount && (
          <span style={{
            fontSize: '20px', fontWeight: '800', color: bill.is_paid ? theme.text.muted : theme.text.primary,
            fontVariantNumeric: 'tabular-nums', flexShrink: 0,
          }}>
            {'\u20AC'}{parseFloat(bill.amount).toFixed(2)}
          </span>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
          <button onClick={() => onEdit(bill)} aria-label="Modifica" style={{
            width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: theme.text.muted, background: theme.primary[50],
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button onClick={() => onDelete(bill.id)} aria-label="Elimina" style={{
            width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: theme.danger, background: '#FEF2F2',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {!bill.is_paid && (
        <div style={{ height: '4px', background: theme.primary[50] }}>
          <div style={{
            height: '100%', borderRadius: '0 2px 2px 0',
            background: barColor, width: getDueBarWidth(bill.due_date),
            transition: 'width 0.3s ease',
          }} />
        </div>
      )}
    </div>
  );
}
