import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';
import toast from 'react-hot-toast';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, name.trim());
        toast.success('Account creato!');
      } else {
        await signIn(email, password);
        toast.success('Benvenuto!');
      }
    } catch (err) {
      toast.error(err.message || 'Errore di autenticazione');
    }
    setLoading(false);
  }

  const inputStyle = {
    padding: '16px 18px',
    borderRadius: '14px',
    border: 'none',
    fontSize: '16px',
    color: theme.text.primary,
    background: 'rgba(255,255,255,0.9)',
    outline: 'none',
    width: '100%',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  };

  return (
    <div className="mesh-bg" style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Floating circles decoration */}
      <div style={{
        position: 'absolute', top: '10%', left: '10%', width: '120px', height: '120px',
        borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
        animation: 'float 6s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '8%', width: '80px', height: '80px',
        borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
        animation: 'float 8s ease-in-out infinite 1s',
      }} />

      <div className="glass-card" style={{
        width: '100%', maxWidth: '380px', padding: '36px 28px',
        animation: 'scaleIn 0.4s ease-out',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: theme.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: theme.shadow.glow,
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: '28px', fontWeight: '800',
            background: theme.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>TuttAcasa</h1>
          <p style={{ fontSize: '14px', color: theme.text.muted, marginTop: '4px' }}>
            La tua casa, sempre in ordine
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isSignUp && (
            <input style={inputStyle} type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Il tuo nome" required />
          )}
          <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email" required />
          <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" required minLength={6} />
          <button type="submit" disabled={loading} style={{
            padding: '16px', borderRadius: '14px', background: theme.gradient,
            color: '#fff', fontSize: '16px', fontWeight: '700', border: 'none',
            boxShadow: theme.shadow.glow, opacity: loading ? 0.7 : 1, marginTop: '4px',
            transition: 'transform 0.15s, opacity 0.15s',
          }}>
            {loading ? 'Caricamento...' : isSignUp ? 'Registrati' : 'Accedi'}
          </button>
        </form>

        <button onClick={() => setIsSignUp(!isSignUp)} style={{
          marginTop: '20px', fontSize: '14px', color: theme.primary[600],
          background: 'none', border: 'none', width: '100%', textAlign: 'center',
          fontWeight: '600',
        }}>
          {isSignUp ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
        </button>
      </div>
    </div>
  );
}
