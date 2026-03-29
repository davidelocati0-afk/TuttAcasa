import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';
import toast from 'react-hot-toast';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        toast.success('Account creato! Controlla la tua email per confermare.');
      } else {
        await signIn(email, password);
        toast.success('Benvenuto!');
      }
    } catch (err) {
      toast.error(err.message || 'Errore di autenticazione');
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: theme.bg.page,
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '56px', marginBottom: '12px' }}>{'\u{1F3E0}'}</div>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          background: theme.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          TuttAcasa
        </h1>
        <p style={{ fontSize: '14px', color: theme.text.muted, marginTop: '6px' }}>
          La tua casa, sempre in ordine
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{
        width: '100%',
        maxWidth: '360px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{
            padding: '14px 16px',
            borderRadius: theme.radius.md,
            border: `1.5px solid ${theme.border.medium}`,
            fontSize: '15px',
            color: theme.text.primary,
            background: '#fff',
            outline: 'none',
            width: '100%',
          }}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          minLength={6}
          style={{
            padding: '14px 16px',
            borderRadius: theme.radius.md,
            border: `1.5px solid ${theme.border.medium}`,
            fontSize: '15px',
            color: theme.text.primary,
            background: '#fff',
            outline: 'none',
            width: '100%',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '14px',
            borderRadius: theme.radius.md,
            background: theme.gradient,
            color: '#fff',
            fontSize: '16px',
            fontWeight: '700',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            boxShadow: theme.shadow.md,
          }}
        >
          {loading ? 'Caricamento...' : isSignUp ? 'Registrati' : 'Accedi'}
        </button>
      </form>

      <button
        onClick={() => setIsSignUp(!isSignUp)}
        style={{
          marginTop: '20px',
          fontSize: '14px',
          color: theme.text.secondary,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
      >
        {isSignUp ? 'Hai gia\u0300 un account? Accedi' : 'Non hai un account? Registrati'}
      </button>
    </div>
  );
}
