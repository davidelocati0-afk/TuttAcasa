import theme from '../../styles/theme';

export default function Fab({ onClick, icon = '+' }) {
  return (
    <button onClick={onClick} aria-label="Aggiungi" style={{
      position: 'fixed',
      bottom: 'calc(90px + env(safe-area-inset-bottom, 0px))',
      right: 'max(20px, calc((100vw - 480px) / 2 + 20px))',
      width: '56px',
      height: '56px',
      borderRadius: '18px',
      background: theme.gradient,
      color: '#fff',
      fontSize: '28px',
      fontWeight: '300',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: theme.shadow.glow,
      zIndex: 40,
      transition: 'transform 0.15s ease',
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    </button>
  );
}
