import theme from '../../styles/theme';

export default function ShoppingItem({ item, onToggle, onDelete }) {
  const bought = item.is_bought;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '14px 16px',
      background: bought ? '#FAFAFE' : theme.bg.card,
      borderRadius: '16px', border: `1px solid ${theme.border.light}`,
      boxShadow: bought ? 'none' : theme.shadow.sm,
      transition: 'all 0.25s ease',
    }}>
      <button onClick={() => onToggle(item)} aria-label={bought ? 'Segna da comprare' : 'Segna comprato'} style={{
        width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
        border: bought ? 'none' : `2.5px solid ${theme.primary[300]}`,
        background: bought ? theme.success : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s ease',
        minWidth: '44px', minHeight: '44px',
      }}>
        {bought && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        )}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          fontSize: '15px', fontWeight: '600', color: bought ? theme.text.muted : theme.text.primary,
          textDecoration: bought ? 'line-through' : 'none',
          transition: 'all 0.2s', wordBreak: 'break-word',
        }}>
          {item.name}
        </span>
        <span style={{ fontSize: '12px', color: theme.text.muted, marginLeft: '8px', fontWeight: '500' }}>
          x{item.quantity}{item.unit !== 'pz' ? ' ' + item.unit : ''}
        </span>
        {item.is_auto && (
          <span style={{
            fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '6px', marginLeft: '6px',
            background: theme.accent[500] + '15', color: theme.accent[500], verticalAlign: 'middle',
          }}>AUTO</span>
        )}
      </div>

      <button onClick={() => onDelete(item.id)} aria-label="Rimuovi" style={{
        width: '44px', height: '44px', borderRadius: '12px', display: 'flex',
        alignItems: 'center', justifyContent: 'center', color: theme.text.muted, flexShrink: 0,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
  );
}
