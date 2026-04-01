import Header from '../components/layout/Header';
import QuickAdd from '../components/shopping/QuickAdd';
import ShoppingItem from '../components/shopping/ShoppingItem';
import EmptyState from '../components/ui/EmptyState';
import { useShoppingList } from '../hooks/useShoppingList';
import theme from '../styles/theme';
import toast from 'react-hot-toast';

export default function ShoppingList() {
  const { items, loading, addItem, toggleBought, deleteItem, clearBought } = useShoppingList();

  const unbought = items.filter(i => !i.is_bought);
  const bought = items.filter(i => i.is_bought);

  async function handleAdd(name) {
    try {
      await addItem(name);
      toast.success('Aggiunto alla lista');
    } catch (err) {
      toast.error('Errore');
    }
  }

  async function handleToggle(item) {
    try {
      await toggleBought(item);
    } catch (err) {
      toast.error('Errore');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteItem(id);
    } catch (err) {
      toast.error('Errore');
    }
  }

  async function handleClearBought() {
    try {
      await clearBought();
      toast.success('Lista pulita');
    } catch (err) {
      toast.error('Errore');
    }
  }

  return (
    <div className="page-enter safe-bottom">
      <Header title="Lista spesa" subtitle={`${unbought.length} da comprare`} />
      <QuickAdd onAdd={handleAdd} />

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {loading ? (
          <EmptyState icon="⏳" title="Caricamento..." />
        ) : items.length === 0 ? (
          <EmptyState icon="🛒" title="Lista vuota" subtitle="Aggiungi articoli o svuota un prodotto dalla dispensa" />
        ) : (
          <>
            {unbought.map(item => (
              <ShoppingItem key={item.id} item={item} onToggle={handleToggle} onDelete={handleDelete} />
            ))}

            {bought.length > 0 && (
              <>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 0 4px',
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: theme.text.muted }}>
                    Comprati ({bought.length})
                  </span>
                  <button onClick={handleClearBought} style={{
                    fontSize: '12px', fontWeight: '600', color: theme.danger,
                    background: 'none', border: 'none', cursor: 'pointer',
                  }}>
                    Rimuovi acquistati
                  </button>
                </div>
                {bought.map(item => (
                  <ShoppingItem key={item.id} item={item} onToggle={handleToggle} onDelete={handleDelete} />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
