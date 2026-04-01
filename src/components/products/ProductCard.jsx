import ExpiryBadge from '../ui/ExpiryBadge';
import theme from '../../styles/theme';

export default function ProductCard({ product, onDecrement, onSendToCart, onEdit, onDelete }) {
  const cat = product.categories;
  const catColor = cat?.color || theme.primary[400];

  return (
    <div style={{
      background: theme.bg.card,
      borderRadius: '18px',
      boxShadow: theme.shadow.sm,
      overflow: 'hidden',
      display: 'flex',
      border: `1px solid ${theme.border.light}`,
    }}>
      {/* Color bar left */}
      <div style={{ width: '5px', background: catColor, flexShrink: 0 }} />

      <div style={{ flex: 1, padding: '14px 12px 14px 14px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        {/* Icon */}
        <div style={{
          width: '44px', height: '44px', borderRadius: '14px',
          background: `${catColor}12`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, overflow: 'hidden',
        }}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} style={{ width: '44px', height: '44px', objectFit: 'cover' }} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={catColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '16px', fontWeight: '700', color: theme.text.primary, wordBreak: 'break-word', display: 'block' }}>
            {product.name}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
            {cat && (
              <span style={{
                fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '8px',
                background: `${catColor}15`, color: catColor,
              }}>{cat.name}</span>
            )}
            <ExpiryBadge date={product.expiry_date} />
          </div>
        </div>

        {/* Quantity chip */}
        <div style={{
          background: theme.primary[50], borderRadius: '12px', padding: '6px 4px',
          display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0,
        }}>
          <button onClick={() => onDecrement(product)} aria-label="Riduci" style={{
            width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: theme.primary[600], fontWeight: '700',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/></svg>
          </button>
          <span style={{
            minWidth: '24px', textAlign: 'center', fontSize: '15px', fontWeight: '800',
            color: theme.text.primary, fontVariantNumeric: 'tabular-nums',
          }}>
            {product.quantity}
          </span>
          <button onClick={() => onSendToCart(product)} aria-label="Alla spesa" style={{
            width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: theme.accent[500],
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4m6.6 16a2 2 0 100-4 2 2 0 000 4zm6 0a2 2 0 100-4 2 2 0 000 4z"/></svg>
          </button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
          <button onClick={() => onEdit(product)} aria-label="Modifica" style={{
            width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: theme.text.muted, background: theme.primary[50],
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button onClick={() => onDelete(product.id)} aria-label="Elimina" style={{
            width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: theme.danger, background: '#FEF2F2',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
