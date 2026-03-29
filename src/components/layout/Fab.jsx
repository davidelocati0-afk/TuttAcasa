import theme from '../../styles/theme';

export default function Fab({ onClick, icon = '+' }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
        right: 'max(20px, calc((100vw - 480px) / 2 + 20px))',
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: theme.gradient,
        color: '#fff',
        fontSize: '28px',
        fontWeight: '300',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        boxShadow: theme.shadow.lg,
        zIndex: 40,
        cursor: 'pointer',
        transition: 'transform 0.2s',
      }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      onTouchStart={e => e.currentTarget.style.transform = 'scale(0.92)'}
      onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {icon}
    </button>
  );
}
