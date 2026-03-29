import { useState } from 'react';
import theme from '../../styles/theme';
import { UNITS } from '../../utils/constants';

const INTENT_CONFIG = {
  add_pantry: { label: 'Dispensa +', bg: '#A855F718', color: '#A855F7' },
  remove_pantry: { label: 'Finito', bg: '#F59E0B18', color: '#D97706' },
  add_shopping: { label: 'Lista Spesa +', bg: '#EC489918', color: '#EC4899' },
  add_bill: { label: 'Bolletta', bg: '#10B98118', color: '#10B981' },
};

export default function ParsedActionCard({ action, categories, onConfirm, onEdit, onDismiss }) {
  const [editing, setEditing] = useState(false);
  const intentCfg = INTENT_CONFIG[action.intent] || INTENT_CONFIG.add_pantry;

  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${theme.border.light}`,
      borderRadius: theme.radius.md,
      padding: '12px',
      boxShadow: theme.shadow.sm,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      {/* Top row: intent badge + dismiss */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px',
          background: intentCfg.bg, color: intentCfg.color,
        }}>
          {intentCfg.label}
        </span>
        <button onClick={() => onDismiss(action.id)} style={{
          width: '24px', height: '24px', borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center', background: 'none',
          color: theme.text.muted, fontSize: '16px', border: 'none', cursor: 'pointer',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      {/* Product name */}
      {editing ? (
        <input
          autoFocus
          value={action.product}
          onChange={e => onEdit(action.id, { product: e.target.value })}
          onBlur={() => setEditing(false)}
          onKeyDown={e => e.key === 'Enter' && setEditing(false)}
          style={{
            fontSize: '16px', fontWeight: '600', color: theme.text.primary,
            border: `1.5px solid ${theme.border.focus}`, borderRadius: '8px',
            padding: '6px 10px', outline: 'none', width: '100%',
          }}
        />
      ) : (
        <div onClick={() => setEditing(true)} style={{
          fontSize: '16px', fontWeight: '600', color: theme.text.primary, cursor: 'pointer',
        }}>
          {action.product || 'Tocca per modificare'}
        </div>
      )}

      {/* Details row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {/* Quantity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            type="number"
            min="1"
            value={action.quantity}
            onChange={e => onEdit(action.id, { quantity: parseInt(e.target.value) || 1 })}
            style={{
              width: '48px', padding: '4px 6px', borderRadius: '6px', textAlign: 'center',
              border: `1px solid ${theme.border.medium}`, fontSize: '13px', color: theme.text.primary,
              outline: 'none',
            }}
          />
          <select
            value={action.unit}
            onChange={e => onEdit(action.id, { unit: e.target.value })}
            style={{
              padding: '4px 6px', borderRadius: '6px', fontSize: '13px',
              border: `1px solid ${theme.border.medium}`, color: theme.text.primary,
              background: '#fff', outline: 'none',
            }}
          >
            {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </div>

        {/* Category chip */}
        {action.intent !== 'add_bill' && categories?.length > 0 && (
          <select
            value={action.category || ''}
            onChange={e => onEdit(action.id, { category: e.target.value })}
            style={{
              padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
              border: `1px solid ${theme.border.medium}`, background: '#fff',
              color: theme.text.secondary, outline: 'none',
            }}
          >
            {categories.map(c => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
          </select>
        )}

        {/* Expiry */}
        {action.expiry_date && (
          <input
            type="date"
            value={action.expiry_date}
            onChange={e => onEdit(action.id, { expiry_date: e.target.value })}
            style={{
              padding: '4px 6px', borderRadius: '6px', fontSize: '12px',
              border: `1px solid ${theme.border.medium}`, color: theme.text.primary,
              outline: 'none',
            }}
          />
        )}

        {/* Amount for bills */}
        {action.intent === 'add_bill' && action.amount && (
          <div style={{ fontSize: '14px', fontWeight: '700', color: theme.accent[500] }}>
            {'\u20AC'}{action.amount.toFixed(2)}
          </div>
        )}
      </div>

      {/* Confirm button */}
      <button onClick={() => onConfirm(action)} style={{
        padding: '10px',
        borderRadius: theme.radius.md,
        background: theme.gradient,
        color: '#fff',
        fontSize: '13px',
        fontWeight: '700',
        border: 'none',
        cursor: 'pointer',
      }}>
        Conferma
      </button>
    </div>
  );
}
