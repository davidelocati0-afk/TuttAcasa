import theme from '../../styles/theme';

export default function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.text.primary, marginBottom: '8px' }}>{title}</h3>
      {subtitle && <p style={{ fontSize: '14px', color: theme.text.muted, maxWidth: '260px' }}>{subtitle}</p>}
    </div>
  );
}
