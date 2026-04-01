import theme from '../../styles/theme';

export default function Fab({ onClick, icon = '+' }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: 'calc(76px + env(safe-area-inset-bottom, 0px))',
        right: 'max(16px, calc((100vw - 480px) / 2 + 16px))',
        width: '54px',
        height: '54px',
        borderRadius: '16px',
        background: theme.gradient,
        color: '#fff',
        fontSize: '26px',
        fontWeight: '300',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        boxShadow: theme.shadow.lg,
        zIndex: 40,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
      }}
    >
      {icon}
    </button>
  );
}
