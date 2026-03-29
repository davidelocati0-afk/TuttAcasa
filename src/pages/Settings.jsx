import { useState } from 'react';
import Header from '../components/layout/Header';
import { useAuth } from '../contexts/AuthContext';
import { useHousehold } from '../contexts/HouseholdContext';
import { requestNotificationPermission } from '../utils/notifications';
import theme from '../styles/theme';
import toast from 'react-hot-toast';

const cardStyle = {
  background: theme.bg.card,
  backdropFilter: 'blur(8px)',
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.border.light}`,
  padding: '16px',
  boxShadow: theme.shadow.sm,
};

const labelStyle = {
  fontSize: '13px',
  color: theme.text.muted,
  marginBottom: '4px',
};

export default function Settings() {
  const { user, signOut } = useAuth();
  const { household, members } = useHousehold();
  const [copied, setCopied] = useState(false);

  async function handleCopyCode() {
    if (!household?.invite_code) return;
    try {
      await navigator.clipboard.writeText(household.invite_code);
      setCopied(true);
      toast.success('Codice copiato!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Impossibile copiare');
    }
  }

  async function handleEnableNotifications() {
    const result = await requestNotificationPermission();
    if (result === 'granted') toast.success('Notifiche abilitate!');
    else if (result === 'denied') toast.error('Permesso negato. Abilitalo dalle impostazioni del browser.');
    else toast('Notifiche non supportate su questo browser');
  }

  async function handleSignOut() {
    try {
      await signOut();
      toast.success('Disconnesso');
    } catch (err) {
      toast.error('Errore');
    }
  }

  return (
    <div className="page-enter safe-bottom">
      <Header title="Impostazioni" />

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '20px' }}>
        {/* Household info */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: theme.text.primary, marginBottom: '12px' }}>
            {'\u{1F3E0}'} La tua casa
          </h3>
          <div style={labelStyle}>Nome</div>
          <div style={{ fontSize: '15px', fontWeight: '600', color: theme.text.primary, marginBottom: '12px' }}>
            {household?.name || '-'}
          </div>
          <div style={labelStyle}>Codice invito</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <code style={{
              flex: 1, padding: '10px 14px', borderRadius: theme.radius.md,
              background: theme.primary[50], fontSize: '18px', fontWeight: '700',
              letterSpacing: '3px', color: theme.primary[700], textAlign: 'center',
              fontFamily: 'monospace',
            }}>
              {household?.invite_code || '—'}
            </code>
            <button onClick={handleCopyCode} style={{
              padding: '10px 14px', borderRadius: theme.radius.md,
              background: theme.primary[100], color: theme.primary[600],
              fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer',
            }}>
              {copied ? 'Copiato!' : 'Copia'}
            </button>
          </div>
          <p style={{ fontSize: '12px', color: theme.text.muted, marginTop: '8px' }}>
            Condividi questo codice con i tuoi familiari per farli unire alla casa.
          </p>
        </div>

        {/* Members */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: theme.text.primary, marginBottom: '12px' }}>
            {'\u{1F465}'} Membri ({members.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {members.map(m => (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 0', borderBottom: `1px solid ${theme.border.light}`,
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', background: theme.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '14px', fontWeight: '700',
                }}>
                  {m.user_id === user?.id ? 'Tu' : '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: theme.text.primary }}>
                    {m.user_id === user?.id ? 'Tu' : `Membro`}
                  </span>
                  <span style={{
                    fontSize: '11px', padding: '1px 6px', borderRadius: '4px', marginLeft: '8px',
                    background: m.role === 'admin' ? theme.primary[100] : theme.border.light,
                    color: m.role === 'admin' ? theme.primary[600] : theme.text.muted,
                    fontWeight: '600',
                  }}>
                    {m.role === 'admin' ? 'Admin' : 'Membro'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: theme.text.primary, marginBottom: '12px' }}>
            {'🔔'} Notifiche
          </h3>
          <button onClick={handleEnableNotifications} style={{
            width: '100%', padding: '12px', borderRadius: theme.radius.md,
            background: theme.primary[50], border: `1.5px solid ${theme.primary[200]}`,
            color: theme.primary[600], fontSize: '14px', fontWeight: '600', cursor: 'pointer',
          }}>
            Abilita notifiche push
          </button>
          <p style={{ fontSize: '12px', color: theme.text.muted, marginTop: '8px' }}>
            Ricevi notifiche 2 giorni prima della scadenza di prodotti e bollette.
          </p>
        </div>

        {/* Account */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: theme.text.primary, marginBottom: '12px' }}>
            {'\u{1F464}'} Account
          </h3>
          <div style={labelStyle}>Nome</div>
          <div style={{ fontSize: '14px', color: theme.text.primary, marginBottom: '12px' }}>{user?.user_metadata?.display_name || '-'}</div>
          <div style={labelStyle}>Email</div>
          <div style={{ fontSize: '14px', color: theme.text.primary, marginBottom: '16px' }}>{user?.email || '-'}</div>
          <button onClick={handleSignOut} style={{
            width: '100%', padding: '12px', borderRadius: theme.radius.md,
            background: '#FEE2E2', color: theme.danger, fontSize: '14px', fontWeight: '600',
            border: 'none', cursor: 'pointer',
          }}>
            Esci dall&apos;account
          </button>
        </div>

        <p style={{ fontSize: '12px', color: theme.text.muted, textAlign: 'center', paddingTop: '12px' }}>
          TuttAcasa v1.0 — Fatto con {'\u2764\uFE0F'}
        </p>
      </div>
    </div>
  );
}
