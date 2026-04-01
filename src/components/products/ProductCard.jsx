import ExpiryBadge from '../ui/ExpiryBadge';
import theme from '../../styles/theme';

export default function ProductCard({ product, onDecrement, onSendToCart, onEdit, onDelete }) {
  const cat = product.categories;
  return (
    <div style={{
      background: theme.bg.card,
      borderRadius: '16px',
      border: `1px solid ${theme.border.light}`,
      padding: '14px',
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      boxShadow: theme.shadow.sm,
    }}>
      <div style={{
        width: '42px', height: '42px', borderRadius: '12px',
        background: cat?.color ? `${cat.color}15` : theme.primary[50],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, overflow: 'hidden',
      }}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} style={{ width: '42px', height: '42px', objectFit: 'cover' }} />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={cat?.color || theme.primary[400]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '15px', fontWeight: '700', color: theme.text.primary, wordBreak: 'break-word' }}>{product.name}</span>
          {cat && (
            <span style={{
              fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '6px',
              background: `${cat.color}12`, color: cat.color, letterSpacing: '0.02em',
            }}>{cat.name}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
          <ExpiryBadge date={product.expiry_date} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <button onClick={() => onDecrement(product)} aria-label={`Riduci ${product.name}`} style={{
          width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: theme.primary[50], color: theme.primary[700], fontWeight: '700', fontSize: '18px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/></svg>
        </button>
        <span style={{
          minWidth: '28px', textAlign: 'center', fontSize: '15px', fontWeight: '700', color: theme.text.primary,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {product.quantity}{product.unit !== 'pz' ? product.unit : ''}
        </span>
        <button onClick={() => onSendToCart(product)} aria-label={`Aggiungi ${product.name} alla spesa`} style={{
          width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: theme.accent[500] + '12', color: theme.accent[500],
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
        <button onClick={() => onEdit(product)} aria-label={`Modifica ${product.name}`} style={{
          width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: theme.primary[50], color: theme.text.muted,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button onClick={() => onDelete(product.id)} aria-label={`Elimina ${product.name}`} style={{
          width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#FEF2F2', color: theme.danger,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
        </button>
      </div>
    </div>
  );
}
