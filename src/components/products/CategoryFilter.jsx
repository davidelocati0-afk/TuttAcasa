import theme from '../../styles/theme';

export default function CategoryFilter({ categories, selected, onSelect }) {
  const all = [{ id: 'all', name: 'Tutti', icon: '\u{1F4CB}', color: theme.primary[500] }, ...categories];

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      padding: '0 20px 12px',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
      {all.map(cat => {
        const active = selected === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '20px',
              border: `1.5px solid ${active ? cat.color : theme.border.light}`,
              background: active ? `${cat.color}18` : theme.bg.card,
              color: active ? cat.color : theme.text.secondary,
              fontSize: '13px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              minHeight: '36px',
              transition: 'all 0.2s',
            }}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
