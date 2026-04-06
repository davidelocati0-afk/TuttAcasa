import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { useProducts } from '../hooks/useProducts';
import { useShoppingList } from '../hooks/useShoppingList';
import { useBills } from '../hooks/useBills';
import { useNotifications } from '../hooks/useNotifications';
import { daysUntil } from '../utils/dates';
import theme from '../styles/theme';

export default function Home() {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { items, unboughtCount } = useShoppingList();
  const { bills } = useBills();
  const { alertCount } = useNotifications(products, bills);

  const expiringProducts = products.filter(p => {
    if (!p.expiry_date) return false;
    const d = daysUntil(p.expiry_date);
    return d !== null && d <= 3;
  });

  const unpaidBills = bills.filter(b => !b.is_paid);
  const totalBillsAmount = unpaidBills.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);

  const sections = [
    {
      key: 'pantry',
      path: '/pantry',
      label: 'Dispensa',
      value: products.length,
      unit: 'prodotti',
      color: theme.primary[500],
      bgColor: theme.primary[50],
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={theme.primary[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
      ),
    },
    {
      key: 'shopping',
      path: '/shopping',
      label: 'Lista Spesa',
      value: unboughtCount,
      unit: 'da comprare',
      color: theme.accent[500],
      bgColor: '#FCE7F3',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={theme.accent[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
        </svg>
      ),
    },
    {
      key: 'planner',
      path: '/planner',
      label: 'Planner',
      value: null,
      unit: 'Menu settimanale',
      color: '#059669',
      bgColor: '#D1FAE5',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
        </svg>
      ),
    },
    {
      key: 'bills',
      path: '/bills',
      label: 'Bollette',
      value: unpaidBills.length,
      unit: totalBillsAmount > 0 ? `(${totalBillsAmount.toFixed(2)}€)` : 'da pagare',
      color: '#D97706',
      bgColor: '#FEF3C7',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      ),
    },
    {
      key: 'chat',
      path: '/chat',
      label: 'Assistente',
      value: null,
      unit: 'Chiedi aiuto',
      color: theme.primary[500],
      bgColor: theme.primary[50],
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={theme.primary[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: theme.bg.page, paddingBottom: '100px' }}>
      <Header title="TuttAcasa" subtitle="La tua casa a portata di mano" />

      <div style={{ padding: '0 16px' }}>
        {/* Alert banner */}
        {alertCount > 0 && (
          <button onClick={() => navigate('/alerts')} style={{
            width: '100%', padding: '14px 16px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)',
            border: '1px solid #FECACA',
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '16px', cursor: 'pointer',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.danger} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: theme.danger }}>
                {alertCount} {alertCount === 1 ? 'avviso' : 'avvisi'}
              </span>
              <span style={{ fontSize: '12px', color: '#991B1B', display: 'block', marginTop: '2px' }}>
                Prodotti o bollette in scadenza
              </span>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        )}

        {/* Section cards grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '12px', marginBottom: '20px',
        }}>
          {sections.map(s => (
            <button key={s.key} onClick={() => navigate(s.path)} style={{
              background: theme.bg.card,
              borderRadius: '20px',
              padding: '20px 16px',
              border: `1px solid ${theme.border.light}`,
              boxShadow: theme.shadow.sm,
              display: 'flex', flexDirection: 'column',
              alignItems: 'flex-start', gap: '12px',
              cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '16px',
                background: s.bgColor, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                {s.icon}
              </div>
              <div>
                <span style={{ fontSize: '15px', fontWeight: '700', color: theme.text.primary, display: 'block' }}>
                  {s.label}
                </span>
                <span style={{ fontSize: '13px', color: theme.text.muted, marginTop: '4px', display: 'block' }}>
                  {s.value !== null && (
                    <span style={{ fontWeight: '800', color: s.color, fontSize: '18px', marginRight: '4px' }}>
                      {s.value}
                    </span>
                  )}
                  {s.unit}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Expiring products section */}
        {expiringProducts.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: theme.text.primary, marginBottom: '12px', paddingLeft: '4px' }}>
              In scadenza
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {expiringProducts.slice(0, 5).map(p => {
                const days = daysUntil(p.expiry_date);
                const isExpired = days < 0;
                const isToday = days === 0;
                const color = isExpired || isToday ? theme.danger : theme.warning;
                const label = isExpired ? 'Scaduto' : isToday ? 'Oggi' : days === 1 ? 'Domani' : `${days}gg`;
                return (
                  <button key={p.id} onClick={() => navigate('/pantry')} style={{
                    background: theme.bg.card,
                    borderRadius: '14px',
                    padding: '12px 16px',
                    border: `1px solid ${theme.border.light}`,
                    boxShadow: theme.shadow.sm,
                    display: 'flex', alignItems: 'center', gap: '12px',
                    cursor: 'pointer',
                  }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: `${color}15`, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                      </svg>
                    </div>
                    <span style={{ flex: 1, fontSize: '14px', fontWeight: '600', color: theme.text.primary, textAlign: 'left' }}>
                      {p.name}
                    </span>
                    <span style={{
                      fontSize: '11px', fontWeight: '700', padding: '4px 10px',
                      borderRadius: '8px', background: `${color}15`, color,
                    }}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick stats */}
        <div style={{
          background: theme.bg.card,
          borderRadius: '20px',
          padding: '20px',
          border: `1px solid ${theme.border.light}`,
          boxShadow: theme.shadow.sm,
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: theme.text.primary, marginBottom: '16px' }}>
            Riepilogo
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {[
              { value: products.length, label: 'In dispensa', color: theme.primary[500] },
              { value: unboughtCount, label: 'Da comprare', color: theme.accent[500] },
              { value: unpaidBills.length, label: 'Da pagare', color: '#D97706' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '28px', fontWeight: '800', color: stat.color, display: 'block', fontVariantNumeric: 'tabular-nums' }}>
                  {stat.value}
                </span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: theme.text.muted }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
