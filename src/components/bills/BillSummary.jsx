import theme from '../../styles/theme';

export default function BillSummary({ unpaidCount, totalDue }) {
  return (
    <div style={{ display: 'flex', gap: '12px', padding: '0 16px 16px' }}>
      <div style={{
        flex: 1, padding: '16px', borderRadius: '16px',
        background: theme.bg.card, border: `1px solid ${theme.border.light}`,
        boxShadow: theme.shadow.sm, textAlign: 'center',
      }}>
        <div style={{ fontSize: '28px', fontWeight: '800', color: theme.primary[600], fontVariantNumeric: 'tabular-nums' }}>{unpaidCount}</div>
        <div style={{ fontSize: '12px', fontWeight: '600', color: theme.text.muted, marginTop: '4px' }}>Da pagare</div>
      </div>
      <div style={{
        flex: 1, padding: '16px', borderRadius: '16px',
        background: theme.bg.card, border: `1px solid ${theme.border.light}`,
        boxShadow: theme.shadow.sm, textAlign: 'center',
      }}>
        <div style={{ fontSize: '28px', fontWeight: '800', color: theme.accent[500], fontVariantNumeric: 'tabular-nums' }}>
          {'\u20AC'}{totalDue.toFixed(2)}
        </div>
        <div style={{ fontSize: '12px', fontWeight: '600', color: theme.text.muted, marginTop: '4px' }}>Totale dovuto</div>
      </div>
    </div>
  );
}
