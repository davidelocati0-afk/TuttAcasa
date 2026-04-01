import { useState, useRef, useEffect } from 'react';
import theme from '../../styles/theme';
import { useProducts } from '../../hooks/useProducts';
import { useBills } from '../../hooks/useBills';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDate } from '../../utils/dates';

export default function NotifBell() {
  const { products } = useProducts();
  const { bills } = useBills();
  const { alerts, alertCount } = useNotifications(products, bills);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '40px', height: '40px', borderRadius: '12px',
          background: alertCount > 0 ? '#FEE2E2' : theme.primary[50],
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke={alertCount > 0 ? theme.danger : theme.primary[500]}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {alertCount > 0 && (
          <span style={{
            position: 'absolute', top: '-2px', right: '-2px',
            background: theme.danger, color: '#fff',
            fontSize: '10px', fontWeight: '700',
            minWidth: '18px', height: '18px', borderRadius: '9px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 4px', border: '2px solid #fff',
          }}>
            {alertCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: '48px',
          right: 0,
          width: '300px',
          maxHeight: '400px',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          border: `1px solid ${theme.border.light}`,
          zIndex: 200,
          animation: 'fadeIn 0.2s ease-out',
        }}>
          <div style={{
            padding: '14px 16px 10px',
            borderBottom: `1px solid ${theme.border.light}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: theme.text.primary }}>
              Notifiche
            </span>
            {alertCount > 0 && (
              <span style={{
                fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '8px',
                background: '#FEE2E2', color: theme.danger,
              }}>
                {alertCount} avvisi
              </span>
            )}
          </div>

          {alerts.length === 0 ? (
            <div style={{ padding: '30px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: theme.text.primary }}>Tutto in ordine!</p>
              <p style={{ fontSize: '12px', color: theme.text.muted, marginTop: '4px' }}>Nessuna scadenza imminente</p>
            </div>
          ) : (
            <div style={{ padding: '8px' }}>
              {alerts.map(a => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  padding: '10px 8px',
                  borderRadius: '10px',
                  background: a.level === 'danger' ? '#FEF2F2' : '#FFFBEB',
                  marginBottom: '6px',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '1px' }}>{a.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: '13px', fontWeight: '600',
                      color: a.level === 'danger' ? theme.danger : '#D97706',
                      wordBreak: 'break-word',
                    }}>
                      {a.message}
                    </p>
                    <p style={{ fontSize: '11px', color: theme.text.muted, marginTop: '2px' }}>
                      {a.type === 'product_expiry' ? '📦 Prodotto' : '💰 Bolletta'} — {formatDate(a.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
