import { useState } from 'react';
import { useHousehold } from '../contexts/HouseholdContext';
import theme from '../styles/theme';
import toast from 'react-hot-toast';

export default function JoinHousehold() {
  const { createHousehold, joinHousehold } = useHousehold();
  const [mode, setMode] = useState(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createHousehold(name.trim());
      toast.success('Casa creata!');
    } catch (err) {
      toast.error(err.message || 'Errore nella creazione');
    }
    setLoading(false);
  }

  async function handleJoin(e) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    try {
      await joinHousehold(code.trim());
      toast.success('Ti sei unito alla casa!');
    } catch (err) {
      toast.error(err.message || 'Codice invito non valido');
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
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>{'🏠'}</div>
      <h1 style={{ fontSize: '24px', fontWeight: '800', color: theme.text.primary, marginBottom: '8px' }}>
        Benvenuto in TuttAcasa!
      </h1>
      <p style={{ fontSize: '14px', color: theme.text.muted, marginBottom: '32px', textAlign: 'center' }}>
        Crea una nuova casa o unisciti a una esistente
      </p>

      {!mode && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '320px' }}>
          <button onClick={() => setMode('create')} style={{
            padding: '18px', borderRadius: theme.radius.lg,
            background: theme.gradient, color: '#fff', fontSize: '16px', fontWeight: '700',
            border: 'none', cursor: 'pointer', boxShadow: theme.shadow.md,
          }}>
            Crea una nuova casa
          </button>
          <button onClick={() => setMode('join')} style={{
            padding: '18px', borderRadius: theme.radius.lg,
            background: '#fff', color: theme.primary[600], fontSize: '16px', fontWeight: '700',
            border: `2px solid ${theme.primary[300]}`, cursor: 'pointer',
          }}>
            Ho un codice invito
          </button>
        </div>
      )}

      {mode === 'create' && (
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '320px' }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nome della casa (es. Casa Rossi)"
            required
            style={{
              padding: '14px 16px', borderRadius: theme.radius.md,
              border: `1.5px solid ${theme.border.medium}`, fontSize: '15px',
              color: theme.text.primary, background: '#fff', outline: 'none', width: '100%',
            }}
          />
          <button type="submit" disabled={loading} style={{
            padding: '14px', borderRadius: theme.radius.md,
            background: theme.gradient, color: '#fff', fontSize: '16px', fontWeight: '700',
            border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Creazione...' : 'Crea casa'}
          </button>
          <button type="button" onClick={() => setMode(null)} style={{
            fontSize: '14px', color: theme.text.muted, background: 'none', border: 'none', cursor: 'pointer',
          }}>Indietro</button>
        </form>
      )}

      {mode === 'join' && (
        <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '320px' }}>
          <input
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Codice invito"
            required
            style={{
              padding: '14px 16px', borderRadius: theme.radius.md,
              border: `1.5px solid ${theme.border.medium}`, fontSize: '15px',
              color: theme.text.primary, background: '#fff', outline: 'none', width: '100%',
              textAlign: 'center', letterSpacing: '2px', fontFamily: 'monospace',
            }}
          />
          <button type="submit" disabled={loading} style={{
            padding: '14px', borderRadius: theme.radius.md,
            background: theme.gradient, color: '#fff', fontSize: '16px', fontWeight: '700',
            border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Verifica...' : 'Unisciti'}
          </button>
          <button type="button" onClick={() => setMode(null)} style={{
            fontSize: '14px', color: theme.text.muted, background: 'none', border: 'none', cursor: 'pointer',
          }}>Indietro</button>
        </form>
      )}
    </div>
  );
}
