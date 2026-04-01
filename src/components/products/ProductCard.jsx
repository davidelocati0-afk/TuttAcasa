import ExpiryBadge from '../ui/ExpiryBadge';
import theme from '../../styles/theme';

export default function ProductCard({ product, onDecrement, onSendToCart, onEdit, onDelete }) {
  const cat = product.categories;
  return (
    <div style={{
      background: theme.bg.card,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderRadius: '14px',
      border: `1px solid ${theme.border.light}`,
      padding: '12px',
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      boxShadow: theme.shadow.sm,
    }}>
      {product.image_url ? (
        <img src={product.image_url} alt="" style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
      ) : (
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px',
          background: cat?.color ? `${cat.color}20` : theme.primary[100],
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0,
        }}>
          {cat?.icon || '📦'}
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '15px', fontWeight: '600', color: theme.text.primary, wordBreak: 'break-word' }}>{product.name}</span>
          {cat && (
            <span style={{
              fontSize: '10px', fontWeight: '600', padding: '2px 6px', borderRadius: '6px',
              background: `${cat.color}18`, color: cat.color,
            }}>{cat.name}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
          <ExpiryBadge date={product.expiry_date} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <button onClick={() => onDecrement(product)} style={{
          width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: theme.primary[100], color: theme.primary[700], fontWeight: '700', fontSize: '18px',
          WebkitTapHighlightColor: 'transparent',
        }}>-</button>
        <span style={{
          minWidth: '28px', textAlign: 'center', fontSize: '14px', fontWeight: '700', color: theme.text.primary,
        }}>
          {product.quantity}{product.unit !== 'pz' ? product.unit : ''}
        </span>
        <button onClick={() => onSendToCart(product)} style={{
          width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: theme.accent[500] + '18', color: theme.accent[500], fontSize: '16px',
          WebkitTapHighlightColor: 'transparent',
        }}>🛒</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
        <button onClick={() => onEdit(product)} style={{
          width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: theme.primary[50], color: theme.text.muted,
          WebkitTapHighlightColor: 'transparent',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button onClick={() => onDelete(product.id)} style={{
          width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#FEE2E2', color: theme.danger,
          WebkitTapHighlightColor: 'transparent',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
        </button>
      </div>
    </div>
  );
}
