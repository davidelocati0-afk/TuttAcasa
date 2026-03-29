import { useState, useEffect } from 'react';
import theme from '../../styles/theme';

export default function ChatInput({ onSend, isListening, onMicToggle, isSupported, transcript }) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (transcript) setText(transcript);
  }, [transcript]);

  useEffect(() => {
    if (!isListening && transcript) {
      // Auto-send after voice stops if there's content
      const timer = setTimeout(() => {
        if (transcript.trim()) {
          onSend(transcript.trim());
          setText('');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isListening, transcript, onSend]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  }

  return (
    <form onSubmit={handleSubmit} style={{
      position: 'fixed',
      bottom: 'calc(66px + env(safe-area-inset-bottom, 0px))',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '480px',
      padding: '8px 16px',
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(12px)',
      borderTop: `1px solid ${theme.border.light}`,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      zIndex: 45,
    }}>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={isListening ? 'Sto ascoltando...' : 'Scrivi cosa hai comprato...'}
        style={{
          flex: 1,
          padding: '12px 16px',
          borderRadius: '24px',
          border: `1.5px solid ${isListening ? theme.primary[400] : theme.border.medium}`,
          fontSize: '15px',
          color: theme.text.primary,
          background: isListening ? theme.primary[50] : '#fff',
          outline: 'none',
          transition: 'all 0.2s',
        }}
      />

      {isSupported && (
        <button
          type="button"
          onClick={onMicToggle}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: 'none',
            background: isListening ? theme.gradient : theme.primary[100],
            color: isListening ? '#fff' : theme.primary[600],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            animation: isListening ? 'pulse 1.5s ease-in-out infinite' : 'none',
            boxShadow: isListening ? theme.shadow.md : 'none',
            transition: 'all 0.2s',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>
      )}

      <button
        type="submit"
        disabled={!text.trim()}
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          border: 'none',
          background: text.trim() ? theme.gradient : theme.primary[100],
          color: text.trim() ? '#fff' : theme.text.muted,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: text.trim() ? 'pointer' : 'default',
          flexShrink: 0,
          opacity: text.trim() ? 1 : 0.4,
          transition: 'all 0.2s',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </form>
  );
}
