import theme from '../../styles/theme';

export default function ShoppingItem({ item, onToggle, onDelete }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 14px',
      background: theme.bg.card,
      backdropFilter: 'blur(8px)',
      borderRadius: theme.radius.lg,
      border: `1px solid ${theme.border.light}`,
      opacity: item.is_bought ? 0.5 : 1,
      transition: 'all 0.2s',
    }}>
      <button onClick={() => onToggle(item)} style={{
        width: '24px', height: '24px', borderRadius: '50%',
        border: `2px solid ${item.is_bought ? theme.success : theme.primary[300]}`,
        background: item.is_bought ? theme.success : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, cursor: 'pointer',
      }}>
        {item.is_bought && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
        )}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          fontSize: '15px', fontWeight: '500', color: theme.text.primary,
          textDecoration: item.is_bought ? 'line-through' : 'none',
        }}>
          {item.name}
        </span>
        <span style={{ fontSize: '12px', color: theme.text.muted, marginLeft: '6px' }}>
          x{item.quantity} {item.unit !== 'pz' ? item.unit : ''}
        </span>
        {item.is_auto && (
          <span style={{
            fontSize: '10px', fontWeight: '600', padding: '1px 6px', borderRadius: '4px', marginLeft: '6px',
            background: theme.accent[500] + '18', color: theme.accent[500],
          }}>auto</span>
        )}
      </div>

      <button onClick={() => onDelete(item.id)} style={{
        width: '32px', height: '32px', borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'none', color: theme.text.muted, border: 'none', flexShrink: 0,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
  );
}
