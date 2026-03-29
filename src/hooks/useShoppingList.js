import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useHousehold } from '../contexts/HouseholdContext';
import { useAuth } from '../contexts/AuthContext';

export function useShoppingList() {
  const { household } = useHousehold();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!household) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('shopping_list')
      .select('*, categories(name, icon, color)')
      .eq('household_id', household.id)
      .order('is_bought', { ascending: true })
      .order('created_at', { ascending: false });

    if (!error) setItems(data || []);
    setLoading(false);
  }, [household]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    if (!household) return;
    const channel = supabase
      .channel('shopping-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'shopping_list',
        filter: `household_id=eq.${household.id}`,
      }, () => {
        fetchItems();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [household, fetchItems]);

  async function addItem(name, quantity = 1, unit = 'pz') {
    const { error } = await supabase.from('shopping_list').insert({
      household_id: household.id,
      name,
      quantity,
      unit,
      is_auto: false,
      added_by: user.id,
    });
    if (error) throw error;
    await fetchItems();
  }

  async function toggleBought(item) {
    const updates = {
      is_bought: !item.is_bought,
      bought_at: !item.is_bought ? new Date().toISOString() : null,
      bought_by: !item.is_bought ? user.id : null,
    };
    const { error } = await supabase
      .from('shopping_list')
      .update(updates)
      .eq('id', item.id);
    if (error) throw error;
    await fetchItems();
  }

  async function deleteItem(id) {
    const { error } = await supabase
      .from('shopping_list')
      .delete()
      .eq('id', id);
    if (error) throw error;
    await fetchItems();
  }

  async function clearBought() {
    const { error } = await supabase
      .from('shopping_list')
      .delete()
      .eq('household_id', household.id)
      .eq('is_bought', true);
    if (error) throw error;
    await fetchItems();
  }

  const unboughtCount = items.filter(i => !i.is_bought).length;

  return { items, loading, addItem, toggleBought, deleteItem, clearBought, unboughtCount, refresh: fetchItems };
}
