import { useState } from 'react';
import theme from '../../styles/theme';

export default function QuickAdd({ onAdd }) {
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  }

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex', gap: '8px', padding: '0 20px 12px',
    }}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Aggiungi articolo..."
        style={{
          flex: 1,
          padding: '12px 14px',
          borderRadius: theme.radius.md,
          border: `1.5px solid ${theme.border.medium}`,
          fontSize: '15px',
          color: theme.text.primary,
          background: '#fff',
          outline: 'none',
        }}
      />
      <button type="submit" style={{
        padding: '12px 18px',
        borderRadius: theme.radius.md,
        background: theme.gradient,
        color: '#fff',
        fontWeight: '700',
        fontSize: '18px',
        border: 'none',
        cursor: 'pointer',
        minWidth: '48px',
      }}>+</button>
    </form>
  );
}
