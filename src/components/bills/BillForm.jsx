import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import theme from '../../styles/theme';
import { RECURRING_OPTIONS } from '../../utils/constants';
import { toInputDate } from '../../utils/dates';

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: theme.radius.md,
  border: `1.5px solid ${theme.border.medium}`,
  fontSize: '15px',
  color: theme.text.primary,
  background: '#fff',
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: theme.text.secondary,
  marginBottom: '6px',
};

export default function BillForm({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    name: '', amount: '', due_date: '', recurring: 'none', notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        amount: initialData.amount || '',
        due_date: toInputDate(initialData.due_date) || '',
        recurring: initialData.recurring || 'none',
        notes: initialData.notes || '',
      });
    } else {
      setForm({ name: '', amount: '', due_date: '', recurring: 'none', notes: '' });
    }
  }, [initialData, open]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.due_date) return;
    onSubmit({
      name: form.name.trim(),
      amount: form.amount ? parseFloat(form.amount) : null,
      due_date: form.due_date,
      recurring: form.recurring,
      notes: form.notes || null,
    });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Modifica bolletta' : 'Aggiungi bolletta'}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={labelStyle}>Nome *</label>
          <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Es. Enel Energia" required />
        </div>

        <div>
          <label style={labelStyle}>Importo (\u20AC)</label>
          <input type="number" step="0.01" min="0" style={inputStyle} value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" />
        </div>

        <div>
          <label style={labelStyle}>Scadenza *</label>
          <input type="date" style={inputStyle} value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} required />
        </div>

        <div>
          <label style={labelStyle}>Ricorrenza</label>
          <select style={inputStyle} value={form.recurring} onChange={e => setForm(f => ({ ...f, recurring: e.target.value }))}>
            {RECURRING_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Note</label>
          <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Note opzionali" />
        </div>

        <button type="submit" style={{
          padding: '14px',
          borderRadius: theme.radius.md,
          background: theme.gradient,
          color: '#fff',
          fontSize: '16px',
          fontWeight: '700',
          border: 'none',
          boxShadow: theme.shadow.md,
          cursor: 'pointer',
          marginTop: '4px',
        }}>
          {initialData ? 'Salva modifiche' : 'Aggiungi bolletta'}
        </button>
      </form>
    </Modal>
  );
}
