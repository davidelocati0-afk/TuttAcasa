import { useEffect } from 'react';
import theme from '../../styles/theme';

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [open]);

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: theme.bg.overlay,
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px 24px 0 0',
        width: '100%', maxWidth: '480px', maxHeight: '85vh',
        overflow: 'auto', WebkitOverflowScrolling: 'touch',
        animation: 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        padding: '12px 20px 28px',
        paddingBottom: 'calc(28px + env(safe-area-inset-bottom, 0px))',
      }} onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div style={{
          width: '40px', height: '5px', borderRadius: '3px',
          background: theme.primary[200], margin: '0 auto 18px',
        }} />
        {title && (
          <h2 style={{
            fontSize: '20px', fontWeight: '800', color: theme.text.primary, marginBottom: '18px',
          }}>{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
