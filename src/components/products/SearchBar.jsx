import theme from '../../styles/theme';

export default function SearchBar({ value, onChange, placeholder = 'Cerca...' }) {
  return (
    <div style={{ padding: '0 20px 8px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: theme.bg.card,
        border: `1px solid ${theme.border.light}`,
        borderRadius: theme.radius.md,
        padding: '10px 14px',
        backdropFilter: 'blur(8px)',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.text.muted} strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            border: 'none',
            background: 'none',
            outline: 'none',
            flex: 1,
            fontSize: '15px',
            color: theme.text.primary,
          }}
        />
        {value && (
          <button onClick={() => onChange('')} style={{ padding: '4px', color: theme.text.muted, fontSize: '16px' }}>
            x
          </button>
        )}
      </div>
    </div>
  );
}
