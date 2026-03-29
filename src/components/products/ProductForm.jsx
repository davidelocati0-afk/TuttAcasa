import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import theme from '../../styles/theme';
import { UNITS } from '../../utils/constants';
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
  transition: 'border-color 0.2s',
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: theme.text.secondary,
  marginBottom: '6px',
};

export default function ProductForm({ open, onClose, onSubmit, categories, initialData, onScanBarcode }) {
  const [form, setForm] = useState({
    name: '', category_id: '', quantity: 1, unit: 'pz', expiry_date: '', notes: '', barcode: '', image_url: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        category_id: initialData.category_id || '',
        quantity: initialData.quantity || 1,
        unit: initialData.unit || 'pz',
        expiry_date: toInputDate(initialData.expiry_date) || '',
        notes: initialData.notes || '',
        barcode: initialData.barcode || '',
        image_url: initialData.image_url || '',
      });
    } else {
      setForm({ name: '', category_id: categories[0]?.id || '', quantity: 1, unit: 'pz', expiry_date: '', notes: '', barcode: '', image_url: '' });
    }
  }, [initialData, open, categories]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit({
      ...form,
      name: form.name.trim(),
      quantity: parseInt(form.quantity) || 1,
      expiry_date: form.expiry_date || null,
      category_id: form.category_id || categories[0]?.id,
    });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Modifica prodotto' : 'Aggiungi prodotto'}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={labelStyle}>Nome *</label>
          <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome prodotto" required />
        </div>

        {onScanBarcode && (
          <button type="button" onClick={() => onScanBarcode(info => {
            if (info) setForm(f => ({ ...f, name: info.name || f.name, barcode: info.barcode, image_url: info.image_url || f.image_url }));
          })} style={{
            padding: '10px',
            borderRadius: theme.radius.md,
            border: `1.5px dashed ${theme.primary[300]}`,
            background: theme.primary[50],
            color: theme.primary[600],
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h.01M7 12h.01M7 17h.01M12 7h.01M12 12h.01M12 17h.01M17 7h.01M17 12h.01M17 17h.01"/></svg>
            Scansiona barcode
          </button>
        )}

        <div>
          <label style={labelStyle}>Categoria</label>
          <select style={inputStyle} value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Quantita\u0300</label>
            <input type="number" min="1" style={inputStyle} value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Unita\u0300</label>
            <select style={inputStyle} value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
              {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Scadenza</label>
          <input type="date" style={inputStyle} value={form.expiry_date} onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value }))} />
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
          {initialData ? 'Salva modifiche' : 'Aggiungi prodotto'}
        </button>
      </form>
    </Modal>
  );
}
