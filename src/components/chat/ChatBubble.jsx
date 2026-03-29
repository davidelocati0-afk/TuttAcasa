import theme from '../../styles/theme';
import { format, parseISO } from 'date-fns';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  const time = format(parseISO(message.timestamp), 'HH:mm');

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      padding: '2px 0',
    }}>
      <div style={{
        maxWidth: '82%',
        padding: '10px 14px',
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        background: isUser ? theme.gradient : theme.bg.card,
        color: isUser ? '#fff' : theme.text.primary,
        border: isUser ? 'none' : `1px solid ${theme.border.light}`,
        backdropFilter: isUser ? 'none' : 'blur(8px)',
        fontSize: '14px',
        lineHeight: '1.45',
        whiteSpace: 'pre-line',
        boxShadow: theme.shadow.sm,
      }}>
        {message.text}
        <div style={{
          fontSize: '10px',
          marginTop: '4px',
          opacity: 0.6,
          textAlign: isUser ? 'right' : 'left',
          color: isUser ? 'rgba(255,255,255,0.7)' : theme.text.muted,
        }}>
          {time}
        </div>
      </div>
    </div>
  );
}
