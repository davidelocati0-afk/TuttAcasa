import theme from '../../styles/theme';

export default function CategoryFilter({ categories, selected, onSelect }) {
  const all = [{ id: 'all', name: 'Tutti', color: theme.primary[500] }, ...categories];

  return (
    <div style={{
      display: 'flex', gap: '8px', padding: '0 16px 12px',
      overflowX: 'auto', WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none', msOverflowStyle: 'none',
    }}>
      {all.map(cat => {
        const active = selected === cat.id;
        return (
          <button key={cat.id} onClick={() => onSelect(cat.id)} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '20px', border: 'none',
            background: active ? theme.gradient : theme.bg.card,
            color: active ? '#fff' : theme.text.secondary,
            fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap',
            minHeight: '38px',
            boxShadow: active ? theme.shadow.glow : theme.shadow.sm,
            transition: 'all 0.2s ease',
          }}>
            {cat.icon && <span>{cat.icon}</span>}
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
