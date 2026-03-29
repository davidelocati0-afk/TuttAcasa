import theme from '../../styles/theme';

export default function Header({ title, subtitle, right }) {
  return (
    <div style={{
      padding: '16px 20px 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '800',
          background: theme.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '13px', color: theme.text.muted, marginTop: '2px' }}>{subtitle}</p>
        )}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}
