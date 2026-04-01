import theme from '../../styles/theme';
import NotifBell from '../notifications/NotifBell';
import { useAuth } from '../../contexts/AuthContext';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buongiorno';
  if (h < 18) return 'Buon pomeriggio';
  return 'Buonasera';
}

export default function Header({ title, subtitle, right }) {
  const { user } = useAuth();
  const name = user?.user_metadata?.display_name;

  return (
    <div style={{
      padding: '16px 16px 14px',
      paddingTop: 'max(16px, env(safe-area-inset-top, 16px))',
      background: 'linear-gradient(180deg, #EDE9FE 0%, #F8F5FF 100%)',
      borderRadius: '0 0 24px 24px',
      marginBottom: '8px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {name && (
            <p style={{ fontSize: '13px', color: theme.text.muted, fontWeight: '600', marginBottom: '2px' }}>
              {getGreeting()}, {name}
            </p>
          )}
          <h1 style={{
            fontSize: '26px', fontWeight: '800',
            background: theme.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>{title}</h1>
          {subtitle && (
            <p style={{ fontSize: '13px', color: theme.text.muted, marginTop: '2px' }}>{subtitle}</p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {right}
          <NotifBell />
        </div>
      </div>
    </div>
  );
}
