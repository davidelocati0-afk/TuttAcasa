import { useState } from 'react';
import Header from '../components/layout/Header';
import Fab from '../components/layout/Fab';
import BillCard from '../components/bills/BillCard';
import BillForm from '../components/bills/BillForm';
import BillSummary from '../components/bills/BillSummary';
import EmptyState from '../components/ui/EmptyState';
import { useBills } from '../hooks/useBills';
import toast from 'react-hot-toast';

export default function Bills() {
  const { bills, loading, addBill, updateBill, togglePaid, deleteBill, unpaidBills, totalDue } = useBills();
  const [formOpen, setFormOpen] = useState(false);
  const [editBill, setEditBill] = useState(null);

  async function handleSubmit(data) {
    try {
      if (editBill) {
        await updateBill(editBill.id, data);
        toast.success('Bolletta aggiornata');
      } else {
        await addBill(data);
        toast.success('Bolletta aggiunta');
      }
    } catch (err) {
      toast.error(err.message || 'Errore');
    }
    setEditBill(null);
  }

  async function handleToggle(bill) {
    try {
      await togglePaid(bill);
      if (!bill.is_paid) {
        toast.success('Segnata come pagata');
        if (bill.recurring !== 'none') toast('Prossima scadenza creata automaticamente');
      }
    } catch (err) {
      toast.error('Errore');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteBill(id);
      toast.success('Bolletta eliminata');
    } catch (err) {
      toast.error('Errore');
    }
  }

  return (
    <div className="page-enter safe-bottom">
      <Header title="Bollette" subtitle={`${unpaidBills.length} da pagare`} />

      {bills.length > 0 && <BillSummary unpaidCount={unpaidBills.length} totalDue={totalDue} />}

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '20px' }}>
        {loading ? (
          <EmptyState icon="⏳" title="Caricamento..." />
        ) : bills.length === 0 ? (
          <EmptyState icon="💰" title="Nessuna bolletta" subtitle="Aggiungi le tue bollette e scadenze" />
        ) : (
          bills.map(bill => (
            <BillCard
              key={bill.id}
              bill={bill}
              onTogglePaid={handleToggle}
              onEdit={b => { setEditBill(b); setFormOpen(true); }}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <Fab onClick={() => { setEditBill(null); setFormOpen(true); }} />

      <BillForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditBill(null); }}
        onSubmit={handleSubmit}
        initialData={editBill}
      />
    </div>
  );
}
