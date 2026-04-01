import { useEffect } from 'react';
import theme from '../../styles/theme';

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '20px 20px 0 0',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '85vh',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          animation: 'slideUp 0.3s ease-out',
          padding: '12px 16px 24px',
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          width: '36px',
          height: '4px',
          background: theme.border.medium,
          borderRadius: '2px',
          margin: '0 auto 14px',
        }} />
        {title && (
          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: theme.text.primary,
            marginBottom: '14px',
          }}>{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
