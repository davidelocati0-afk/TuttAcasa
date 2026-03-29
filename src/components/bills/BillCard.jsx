import ExpiryBadge from '../ui/ExpiryBadge';
import theme from '../../styles/theme';
import { RECURRING_LABELS } from '../../utils/constants';

export default function BillCard({ bill, onTogglePaid, onEdit, onDelete }) {
  return (
    <div style={{
      background: theme.bg.card,
      backdropFilter: 'blur(8px)',
      borderRadius: theme.radius.lg,
      border: `1px solid ${theme.border.light}`,
      padding: '14px',
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      boxShadow: theme.shadow.sm,
      opacity: bill.is_paid ? 0.55 : 1,
      transition: 'all 0.2s',
    }}>
      <button onClick={() => onTogglePaid(bill)} style={{
        width: '28px', height: '28px', borderRadius: '50%',
        border: `2px solid ${bill.is_paid ? theme.success : theme.primary[300]}`,
        background: bill.is_paid ? theme.success : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, cursor: 'pointer',
      }}>
        {bill.is_paid && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
        )}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '15px', fontWeight: '600', color: theme.text.primary,
            textDecoration: bill.is_paid ? 'line-through' : 'none',
          }}>{bill.name}</span>
          {bill.recurring !== 'none' && RECURRING_LABELS[bill.recurring] && (
            <span style={{
              fontSize: '10px', fontWeight: '600', padding: '2px 6px', borderRadius: '6px',
              background: theme.primary[100], color: theme.primary[600],
            }}>{RECURRING_LABELS[bill.recurring]}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
          <ExpiryBadge date={bill.due_date} />
        </div>
      </div>

      {bill.amount && (
        <span style={{
          fontSize: '16px', fontWeight: '700',
          color: bill.is_paid ? theme.text.muted : theme.text.primary,
          flexShrink: 0,
        }}>
          \u20AC{parseFloat(bill.amount).toFixed(2)}
        </span>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
        <button onClick={() => onEdit(bill)} style={{
          width: '28px', height: '28px', borderRadius: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'none', color: theme.text.muted, fontSize: '14px', border: 'none',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button onClick={() => onDelete(bill.id)} style={{
          width: '28px', height: '28px', borderRadius: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'none', color: theme.danger, fontSize: '14px', border: 'none',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
        </button>
      </div>
    </div>
  );
}
