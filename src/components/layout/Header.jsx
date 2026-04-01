import theme from '../../styles/theme';

export default function Header({ title, subtitle, right }) {
  return (
    <div style={{
      padding: '12px 16px 10px',
      paddingTop: 'max(12px, env(safe-area-inset-top, 12px))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '800',
          background: theme.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '13px', color: theme.text.muted, marginTop: '2px' }}>{subtitle}</p>
        )}
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
  );
}
