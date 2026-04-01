import Header from '../components/layout/Header';
import NotifItem from '../components/notifications/NotifItem';
import EmptyState from '../components/ui/EmptyState';
import { useProducts } from '../hooks/useProducts';
import { useBills } from '../hooks/useBills';
import { useNotifications } from '../hooks/useNotifications';

export default function Alerts() {
  const { products } = useProducts();
  const { bills } = useBills();
  const { alerts } = useNotifications(products, bills);

  return (
    <div className="page-enter safe-bottom">
      <Header title="Avvisi" subtitle={alerts.length > 0 ? `${alerts.length} avvisi attivi` : 'Tutto sotto controllo'} />

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '20px' }}>
        {alerts.length === 0 ? (
          <EmptyState icon="check" title="Nessun avviso" subtitle="Non ci sono scadenze imminenti" />
        ) : (
          alerts.map(a => <NotifItem key={a.id} alert={a} />)
        )}
      </div>
    </div>
  );
}
