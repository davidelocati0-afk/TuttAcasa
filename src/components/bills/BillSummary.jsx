import theme from '../../styles/theme';

export default function BillSummary({ unpaidCount, totalDue }) {
  return (
    <div style={{ display: 'flex', gap: '12px', padding: '0 20px 16px' }}>
      <div style={{
        flex: 1, padding: '14px', borderRadius: theme.radius.lg,
        background: theme.bg.card, backdropFilter: 'blur(8px)',
        border: `1px solid ${theme.border.light}`, textAlign: 'center',
      }}>
        <div style={{ fontSize: '24px', fontWeight: '800', color: theme.primary[600] }}>{unpaidCount}</div>
        <div style={{ fontSize: '12px', color: theme.text.muted, marginTop: '2px' }}>Da pagare</div>
      </div>
      <div style={{
        flex: 1, padding: '14px', borderRadius: theme.radius.lg,
        background: theme.bg.card, backdropFilter: 'blur(8px)',
        border: `1px solid ${theme.border.light}`, textAlign: 'center',
      }}>
        <div style={{ fontSize: '24px', fontWeight: '800', color: theme.accent[500] }}>\u20AC{totalDue.toFixed(2)}</div>
        <div style={{ fontSize: '12px', color: theme.text.muted, marginTop: '2px' }}>Totale dovuto</div>
      </div>
    </div>
  );
}
