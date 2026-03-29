import theme from '../../styles/theme';

export default function NotifItem({ alert }) {
  const bgMap = { danger: '#FEE2E2', warning: '#FEF3C7' };
  const borderMap = { danger: '#FECACA', warning: '#FDE68A' };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px',
      borderRadius: theme.radius.lg,
      background: bgMap[alert.level] || theme.bg.card,
      border: `1px solid ${borderMap[alert.level] || theme.border.light}`,
    }}>
      <span style={{ fontSize: '24px', flexShrink: 0 }}>{alert.icon}</span>
      <span style={{ fontSize: '14px', fontWeight: '500', color: theme.text.primary, flex: 1 }}>
        {alert.message}
      </span>
    </div>
  );
}
