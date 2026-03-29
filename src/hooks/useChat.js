import { useState, useCallback, useEffect } from 'react';
import { parseMessage } from '../utils/messageParser';
import { resolveCategoryId } from '../utils/productCategoryMap';
import { format } from 'date-fns';

const STORAGE_KEY = 'tuttacasa_chat';
const MAX_MESSAGES = 50;

const INTENT_LABELS = {
  add_pantry: 'Aggiunto alla dispensa',
  remove_pantry: 'Aggiunto alla lista spesa',
  add_shopping: 'Aggiunto alla lista spesa',
  add_bill: 'Bolletta aggiunta',
};

export function useChat({ products, addProduct, decrementQuantity, addItem, addBill, categories }) {
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [pendingActions, setPendingActions] = useState([]);

  useEffect(() => {
    try {
      const toStore = messages.slice(-MAX_MESSAGES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch { /* ignore */ }
  }, [messages]);

  function addMessage(role, text) {
    const msg = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), role, text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, msg]);
    return msg;
  }

  const sendMessage = useCallback((text) => {
    if (!text?.trim()) return;
    addMessage('user', text.trim());

    const actions = parseMessage(text);
    if (actions.length === 0) {
      addMessage('system', 'Non ho capito. Prova con frasi come:\n"Ho comprato 2 latte e 3 uova"\n"Ho finito la pasta"\n"Devo comprare il detersivo"\n"Bolletta Enel 85 euro scade il 15 aprile"');
      return;
    }

    const summary = actions.map(a => {
      const icon = a.intent === 'add_pantry' ? '\u{1F4E6}' : a.intent === 'add_shopping' ? '\u{1F6D2}' : a.intent === 'remove_pantry' ? '\u{1F4E4}' : '\u{1F4B0}';
      return `${icon} ${a.product} (x${a.quantity}${a.unit !== 'pz' ? a.unit : ''})${a.category ? ' \u2192 ' + a.category : ''}`;
    }).join('\n');

    addMessage('system', `Ho trovato ${actions.length} ${actions.length === 1 ? 'elemento' : 'elementi'}:\n${summary}\n\nConferma o modifica prima di salvare.`);
    setPendingActions(actions);
  }, []);

  const confirmAction = useCallback(async (action) => {
    try {
      const categoryId = resolveCategoryId(action.category, categories);

      if (action.intent === 'add_pantry') {
        await addProduct({
          name: action.product,
          category_id: categoryId,
          quantity: action.quantity,
          unit: action.unit,
          expiry_date: action.expiry_date || null,
        });
        addMessage('system', `\u2705 ${action.product} aggiunto alla dispensa`);
      } else if (action.intent === 'remove_pantry') {
        const found = products.find(p => p.name.toLowerCase() === action.product.toLowerCase());
        if (found) {
          await decrementQuantity(found);
          addMessage('system', `\u2705 ${action.product} decrementato dalla dispensa`);
        } else {
          await addItem(action.product, action.quantity, action.unit);
          addMessage('system', `\u2705 ${action.product} aggiunto alla lista spesa (non trovato in dispensa)`);
        }
      } else if (action.intent === 'add_shopping') {
        await addItem(action.product, action.quantity, action.unit);
        addMessage('system', `\u2705 ${action.product} aggiunto alla lista spesa`);
      } else if (action.intent === 'add_bill') {
        await addBill({
          name: action.product,
          amount: action.amount,
          due_date: action.expiry_date || format(new Date(), 'yyyy-MM-dd'),
          recurring: 'none',
        });
        addMessage('system', `\u2705 Bolletta "${action.product}" aggiunta`);
      }

      setPendingActions(prev => prev.filter(a => a.id !== action.id));
    } catch (err) {
      addMessage('system', `\u274C Errore: ${err.message || 'Operazione fallita'}`);
    }
  }, [products, addProduct, decrementQuantity, addItem, addBill, categories]);

  const confirmAll = useCallback(async () => {
    for (const action of pendingActions) {
      await confirmAction(action);
    }
  }, [pendingActions, confirmAction]);

  const editAction = useCallback((actionId, updates) => {
    setPendingActions(prev => prev.map(a => a.id === actionId ? { ...a, ...updates } : a));
  }, []);

  const dismissAction = useCallback((actionId) => {
    setPendingActions(prev => prev.filter(a => a.id !== actionId));
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setPendingActions([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { messages, pendingActions, sendMessage, confirmAction, confirmAll, editAction, dismissAction, clearChat };
}
