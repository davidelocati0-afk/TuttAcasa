import { useLocation, useNavigate } from 'react-router-dom';
import theme from '../../styles/theme';

const tabs = [
  { path: '/', label: 'Dispensa', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
  { path: '/shopping', label: 'Spesa', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z' },
  { path: '/bills', label: 'Bollette', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { path: '/chat', label: 'Chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { path: '/settings', label: 'Altro', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

export default function BottomNav({ alertCount = 0, shoppingCount = 0 }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '480px',
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(12px)',
      borderTop: `1px solid ${theme.border.light}`,
      display: 'flex',
      justifyContent: 'space-around',
      paddingTop: '8px',
      paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
      zIndex: 50,
    }}>
      {tabs.map(tab => {
        const active = location.pathname === tab.path;
        const badge = tab.path === '/alerts' ? alertCount : tab.path === '/shopping' ? shoppingCount : 0;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              padding: '4px 12px',
              minWidth: '60px',
              minHeight: '44px',
              background: 'none',
              border: 'none',
              position: 'relative',
            }}
          >
            {active && (
              <div style={{
                position: 'absolute',
                top: '-8px',
                width: '20px',
                height: '3px',
                borderRadius: '2px',
                background: theme.gradient,
              }} />
            )}
            <div style={{ position: 'relative' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? theme.primary[600] : theme.text.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={tab.icon} />
              </svg>
              {badge > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-10px',
                  background: theme.danger,
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: '700',
                  minWidth: '16px',
                  height: '16px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                }}>
                  {badge}
                </span>
              )}
            </div>
            <span style={{
              fontSize: '10px',
              fontWeight: active ? '600' : '500',
              color: active ? theme.primary[600] : theme.text.muted,
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
