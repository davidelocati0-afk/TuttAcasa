import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useHousehold } from '../contexts/HouseholdContext';
import { useAuth } from '../contexts/AuthContext';
import { getNextDueDate } from '../utils/dates';
import { format } from 'date-fns';

export function useBills() {
  const { household } = useHousehold();
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBills = useCallback(async () => {
    if (!household) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('household_id', household.id)
      .order('is_paid', { ascending: true })
      .order('due_date', { ascending: true });

    if (!error) setBills(data || []);
    setLoading(false);
  }, [household]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  useEffect(() => {
    if (!household) return;
    const channel = supabase
      .channel('bills-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bills',
        filter: `household_id=eq.${household.id}`,
      }, () => {
        fetchBills();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [household, fetchBills]);

  async function addBill(bill) {
    const { error } = await supabase.from('bills').insert({
      ...bill,
      household_id: household.id,
      added_by: user.id,
    });
    if (error) throw error;
  }

  async function updateBill(id, updates) {
    const { error } = await supabase
      .from('bills')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
  }

  async function togglePaid(bill) {
    const nowPaid = !bill.is_paid;
    const { error } = await supabase
      .from('bills')
      .update({
        is_paid: nowPaid,
        paid_at: nowPaid ? new Date().toISOString() : null,
        paid_by: nowPaid ? user.id : null,
      })
      .eq('id', bill.id);
    if (error) throw error;

    if (nowPaid && bill.recurring !== 'none') {
      const nextDate = getNextDueDate(bill.due_date, bill.recurring);
      if (nextDate) {
        await supabase.from('bills').insert({
          household_id: household.id,
          name: bill.name,
          amount: bill.amount,
          due_date: format(nextDate, 'yyyy-MM-dd'),
          recurring: bill.recurring,
          notes: bill.notes,
          added_by: user.id,
          is_paid: false,
        });
      }
    }
  }

  async function deleteBill(id) {
    const { error } = await supabase
      .from('bills')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  const unpaidBills = bills.filter(b => !b.is_paid);
  const totalDue = unpaidBills.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);

  return { bills, loading, addBill, updateBill, togglePaid, deleteBill, unpaidBills, totalDue, refresh: fetchBills };
}
