import { useEffect } from 'react';
import theme from '../../styles/theme';

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(4px)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  modal: {
    background: '#fff',
    borderRadius: '24px 24px 0 0',
    width: '100%',
    maxWidth: '480px',
    maxHeight: '85vh',
    overflow: 'auto',
    animation: 'slideUp 0.3s ease-out',
    padding: '12px 20px 32px',
    paddingBottom: 'calc(32px + env(safe-area-inset-bottom, 0px))',
  },
  handle: {
    width: '40px',
    height: '4px',
    background: theme.border.medium,
    borderRadius: '2px',
    margin: '0 auto 16px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: theme.text.primary,
    marginBottom: '16px',
  },
};

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.handle} />
        {title && <h2 style={styles.title}>{title}</h2>}
        {children}
      </div>
    </div>
  );
}
