import { useState, useRef } from 'react';
import ExpiryBadge from '../ui/ExpiryBadge';
import theme from '../../styles/theme';

export default function ProductCard({ product, onDecrement, onSendToCart, onEdit, onDelete }) {
  const cat = product.categories;
  const catColor = cat?.color || theme.primary[400];

  const [swiped, setSwiped] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const touchStart = useRef(null);
  const touchDelta = useRef(0);

  function handleTouchStart(e) {
    touchStart.current = e.touches[0].clientX;
    touchDelta.current = 0;
  }

  function handleTouchMove(e) {
    if (touchStart.current === null) return;
    touchDelta.current = e.touches[0].clientX - touchStart.current;
  }

  function handleTouchEnd() {
    if (touchDelta.current < -60) setSwiped(true);
    else if (touchDelta.current > 40) setSwiped(false);
    touchStart.current = null;
  }

  function handleDelete() {
    setShowConfirm(true);
  }

  function confirmDelete() {
    setShowConfirm(false);
    setSwiped(false);
    onDelete(product.id);
  }

  return (
    <>
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '18px' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Delete action behind */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '72px',
          background: theme.danger, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '0 18px 18px 0',
        }}>
          <button onClick={handleDelete} aria-label="Elimina" style={{
            width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#fff',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
            <span style={{ fontSize: '10px', fontWeight: '700' }}>Elimina</span>
          </button>
        </div>

        {/* Card front */}
        <div
          onClick={() => !swiped && onEdit(product)}
          style={{
            background: theme.bg.card,
            borderRadius: '18px',
            boxShadow: theme.shadow.sm,
            display: 'flex',
            border: `1px solid ${theme.border.light}`,
            position: 'relative',
            zIndex: 1,
            transform: swiped ? 'translateX(-72px)' : 'translateX(0)',
            transition: 'transform 0.25s cubic-bezier(0.32, 0.72, 0, 1)',
            cursor: 'pointer',
          }}
        >
          {/* Color bar left */}
          <div style={{ width: '5px', background: catColor, flexShrink: 0, borderRadius: '18px 0 0 18px' }} />

          <div style={{ flex: 1, padding: '14px 16px', display: 'flex', gap: '14px', alignItems: 'center' }}>
            {/* Icon */}
            <div style={{
              width: '46px', height: '46px', borderRadius: '14px',
              background: `${catColor}12`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, overflow: 'hidden',
            }}>
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} style={{ width: '46px', height: '46px', objectFit: 'cover' }} />
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={catColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: '16px', fontWeight: '700', color: theme.text.primary, wordBreak: 'break-word', display: 'block' }}>
                {product.name}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '5px', flexWrap: 'wrap' }}>
                {cat && (
                  <span style={{
                    fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '8px',
                    background: `${catColor}15`, color: catColor,
                  }}>{cat.name}</span>
                )}
                <ExpiryBadge date={product.expiry_date} />
              </div>
            </div>

            {/* Quantity + Cart */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0,
            }} onClick={e => e.stopPropagation()}>
              <button onClick={() => onDecrement(product)} aria-label="Riduci quantita" style={{
                width: '36px', height: '36px', borderRadius: '11px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                background: theme.primary[50], color: theme.primary[600],
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/></svg>
              </button>

              <span style={{
                minWidth: '28px', textAlign: 'center', fontSize: '17px', fontWeight: '800',
                color: theme.text.primary, fontVariantNumeric: 'tabular-nums',
              }}>
                {product.quantity}
              </span>

              <button onClick={() => onSendToCart(product)} aria-label="Aggiungi alla spesa" style={{
                width: '40px', height: '40px', borderRadius: '12px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                background: theme.accent[500], color: '#fff',
                boxShadow: '0 2px 8px rgba(236,72,153,0.3)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm delete popup */}
      {showConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: theme.bg.overlay,
          backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
          zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px', animation: 'fadeIn 0.15s ease-out',
        }} onClick={() => { setShowConfirm(false); setSwiped(false); }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '28px 24px',
            maxWidth: '320px', width: '100%', textAlign: 'center',
            boxShadow: theme.shadow.lg, animation: 'scaleIn 0.2s ease-out',
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px', background: '#FEF2F2',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={theme.danger} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: theme.text.primary, marginBottom: '8px' }}>
              Eliminare {product.name}?
            </h3>
            <p style={{ fontSize: '14px', color: theme.text.muted, marginBottom: '20px' }}>
              Il prodotto verrà rimosso dalla dispensa.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setShowConfirm(false); setSwiped(false); }} style={{
                flex: 1, padding: '14px', borderRadius: '14px', fontSize: '15px', fontWeight: '700',
                background: theme.primary[50], color: theme.text.primary,
              }}>Annulla</button>
              <button onClick={confirmDelete} style={{
                flex: 1, padding: '14px', borderRadius: '14px', fontSize: '15px', fontWeight: '700',
                background: theme.danger, color: '#fff',
              }}>Elimina</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
