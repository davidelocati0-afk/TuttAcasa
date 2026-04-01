import { useEffect, useRef } from 'react';
import Header from '../components/layout/Header';
import ChatBubble from '../components/chat/ChatBubble';
import ChatInput from '../components/chat/ChatInput';
import ParsedActionCard from '../components/chat/ParsedActionCard';
import { useProducts } from '../hooks/useProducts';
import { useShoppingList } from '../hooks/useShoppingList';
import { useBills } from '../hooks/useBills';
import { useHousehold } from '../contexts/HouseholdContext';
import { useChat } from '../hooks/useChat';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import theme from '../styles/theme';
import toast from 'react-hot-toast';

const EXAMPLE_PHRASES = [
  'Ho comprato 2 latte e 3 uova',
  'Ho finito la pasta',
  'Devo comprare il detersivo',
  'Bolletta Enel 85 euro scade il 15 aprile',
  'Comprato pollo, mozzarella e insalata',
];

export default function Chat() {
  const { products, addProduct, decrementQuantity } = useProducts();
  const { addItem } = useShoppingList();
  const { addBill } = useBills();
  const { categories } = useHousehold();
  const { isListening, isSupported, transcript, startListening, stopListening, error: micError } = useSpeechRecognition();

  const { messages, pendingActions, sendMessage, confirmAction, confirmAll, editAction, dismissAction } = useChat({
    products, addProduct, decrementQuantity, addItem, addBill, categories,
  });

  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingActions]);

  useEffect(() => {
    if (micError) toast.error(micError);
  }, [micError]);

  function handleMicToggle() {
    if (isListening) stopListening();
    else startListening();
  }

  async function handleConfirm(action) {
    await confirmAction(action);
    toast.success('Salvato!');
  }

  async function handleConfirmAll() {
    await confirmAll();
    toast.success('Tutto salvato!');
  }

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header title="Chat" subtitle="Parla con TuttAcasa" />

      {/* Messages area */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '0 16px',
        paddingBottom: pendingActions.length > 0 ? '16px' : 'calc(130px + env(safe-area-inset-bottom, 0px))',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}>
        {/* Welcome state */}
        {messages.length === 0 && pendingActions.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '40px 16px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
          }}>
            <div style={{ fontSize: '48px' }}>{'💬'}</div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: theme.text.primary }}>
              Dimmi cosa hai comprato!
            </h3>
            <p style={{ fontSize: '13px', color: theme.text.muted, maxWidth: '280px' }}>
              Scrivi o usa il microfono per aggiungere prodotti, segnalare cose finite o aggiungere bollette.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '320px' }}>
              {EXAMPLE_PHRASES.map((phrase, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(phrase)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: theme.radius.md,
                    border: `1.5px solid ${theme.border.light}`,
                    background: theme.bg.card,
                    color: theme.text.secondary,
                    fontSize: '13px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {'💡'} {phrase}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {/* Pending actions */}
        {pendingActions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            {pendingActions.map(action => (
              <ParsedActionCard
                key={action.id}
                action={action}
                categories={categories}
                onConfirm={handleConfirm}
                onEdit={editAction}
                onDismiss={dismissAction}
              />
            ))}
            {pendingActions.length > 1 && (
              <button onClick={handleConfirmAll} style={{
                padding: '12px',
                borderRadius: theme.radius.md,
                background: theme.gradient,
                color: '#fff',
                fontSize: '15px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                boxShadow: theme.shadow.md,
              }}>
                Conferma tutto ({pendingActions.length})
              </button>
            )}
          </div>
        )}

        <div ref={scrollRef} style={{ height: '140px', flexShrink: 0 }} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        isListening={isListening}
        onMicToggle={handleMicToggle}
        isSupported={isSupported}
        transcript={transcript}
      />
    </div>
  );
}
