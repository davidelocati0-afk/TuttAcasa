import { useLocation, useNavigate } from 'react-router-dom';
import theme from '../../styles/theme';
import { useShoppingList } from '../../hooks/useShoppingList';

const tabs = [
  { path: '/', label: 'Dispensa', icon: (c,f) => <svg width="22" height="22" viewBox="0 0 24 24" fill={f?"currentColor":"none"} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"/></svg> },
  { path: '/shopping', label: 'Spesa', icon: (c,f) => <svg width="22" height="22" viewBox="0 0 24 24" fill={f?"currentColor":"none"} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg> },
  { path: '/bills', label: 'Bollette', icon: (c,f) => <svg width="22" height="22" viewBox="0 0 24 24" fill={f?"currentColor":"none"} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg> },
  { path: '/chat', label: 'Chat', icon: (c,f) => <svg width="22" height="22" viewBox="0 0 24 24" fill={f?"currentColor":"none"} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg> },
  { path: '/settings', label: 'Altro', icon: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg> },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { unboughtCount } = useShoppingList();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 24px)',
      maxWidth: '456px',
      background: '#FFFFFF',
      borderRadius: '22px',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 4px',
      zIndex: 50,
      boxShadow: theme.shadow.float,
    }} role="navigation" aria-label="Navigazione principale">
      {tabs.map(tab => {
        const active = location.pathname === tab.path;
        const badge = tab.path === '/shopping' ? unboughtCount : 0;
        const color = active ? theme.primary[600] : theme.text.muted;
        return (
          <button key={tab.path} onClick={() => navigate(tab.path)}
            aria-label={tab.label} aria-current={active ? 'page' : undefined}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '3px', padding: '6px 10px', minWidth: '52px', minHeight: '44px',
              position: 'relative', borderRadius: '14px',
              background: active ? theme.primary[50] : 'transparent',
              transition: 'background 0.2s',
            }}>
            <div style={{ position: 'relative' }}>
              {tab.icon(color, active)}
              {badge > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-8px',
                  background: theme.danger, color: '#fff', fontSize: '9px', fontWeight: '800',
                  minWidth: '16px', height: '16px', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px',
                }}>{badge}</span>
              )}
            </div>
            <span style={{
              fontSize: '10px', fontWeight: active ? '800' : '600', color, lineHeight: 1,
            }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
