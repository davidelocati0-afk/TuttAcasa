import Header from '../components/layout/Header';
import NotifItem from '../components/notifications/NotifItem';
import EmptyState from '../components/ui/EmptyState';

export default function Alerts({ alerts = [] }) {
  return (
    <div className="page-enter safe-bottom">
      <Header title="Avvisi" subtitle={alerts.length > 0 ? `${alerts.length} avvisi attivi` : 'Tutto sotto controllo'} />

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '20px' }}>
        {alerts.length === 0 ? (
          <EmptyState icon="\u2705" title="Nessun avviso" subtitle="Non ci sono scadenze imminenti" />
        ) : (
          alerts.map(a => <NotifItem key={a.id} alert={a} />)
        )}
      </div>
    </div>
  );
}
