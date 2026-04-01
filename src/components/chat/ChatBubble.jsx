import theme from '../../styles/theme';
import { format, parseISO } from 'date-fns';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  const time = format(parseISO(message.timestamp), 'HH:mm');

  return (
    <div style={{
      display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
      padding: '2px 0',
    }}>
      {!isUser && (
        <div style={{
          width: '28px', height: '28px', borderRadius: '10px', flexShrink: 0,
          background: theme.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginRight: '8px', marginTop: '4px',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"/>
          </svg>
        </div>
      )}
      <div style={{
        maxWidth: '78%', padding: '12px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser ? theme.gradient : theme.bg.card,
        color: isUser ? '#fff' : theme.text.primary,
        border: isUser ? 'none' : `1px solid ${theme.border.light}`,
        boxShadow: isUser ? theme.shadow.glow : theme.shadow.sm,
        fontSize: '14px', lineHeight: 1.5, whiteSpace: 'pre-line',
      }}>
        {message.text}
        <div style={{
          fontSize: '10px', marginTop: '4px', opacity: 0.6,
          textAlign: isUser ? 'right' : 'left',
        }}>{time}</div>
      </div>
    </div>
  );
}
