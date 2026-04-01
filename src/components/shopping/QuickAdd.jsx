import { useState, useRef } from 'react';
import theme from '../../styles/theme';

export default function QuickAdd({ onAdd }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) {
      inputRef.current?.focus();
      return;
    }
    onAdd(text.trim());
    setText('');
  }

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex', gap: '10px', padding: '0 16px 12px',
    }}>
      <input
        ref={inputRef}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Aggiungi articolo..."
        style={{
          flex: 1,
          padding: '14px 16px',
          borderRadius: '14px',
          border: `1.5px solid ${theme.border.medium}`,
          fontSize: '16px',
          color: theme.text.primary,
          background: '#fff',
          outline: 'none',
          WebkitAppearance: 'none',
          minHeight: '48px',
        }}
      />
      <button type="submit" style={{
        padding: '0',
        borderRadius: '14px',
        background: theme.gradient,
        color: '#fff',
        fontWeight: '600',
        fontSize: '22px',
        border: 'none',
        cursor: 'pointer',
        minWidth: '48px',
        minHeight: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        WebkitTapHighlightColor: 'transparent',
      }}>+</button>
    </form>
  );
}
