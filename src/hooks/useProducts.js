import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useHousehold } from '../contexts/HouseholdContext';
import { useAuth } from '../contexts/AuthContext';

export function useProducts() {
  const { household } = useHousehold();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!household) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name, icon, color)')
      .eq('household_id', household.id)
      .order('expiry_date', { ascending: true, nullsFirst: false });

    if (!error) setProducts(data || []);
    setLoading(false);
  }, [household]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (!household) return;
    const channel = supabase
      .channel('products-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'products',
        filter: `household_id=eq.${household.id}`,
      }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [household, fetchProducts]);

  async function addProduct(product) {
    const { error } = await supabase.from('products').insert({
      ...product,
      household_id: household.id,
      added_by: user.id,
    });
    if (error) throw error;
    await fetchProducts();
  }

  async function updateProduct(id, updates) {
    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
    await fetchProducts();
  }

  async function deleteProduct(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
    await fetchProducts();
  }

  async function decrementQuantity(product) {
    const newQty = product.quantity - 1;
    const { error } = await supabase
      .from('products')
      .update({ quantity: newQty })
      .eq('id', product.id);
    if (error) throw error;
    await fetchProducts();
  }

  async function sendToShoppingList(product) {
    const { error } = await supabase.from('shopping_list').insert({
      household_id: household.id,
      name: product.name,
      quantity: 1,
      unit: product.unit,
      category_id: product.category_id,
      is_auto: false,
      source_product_id: product.id,
      added_by: user.id,
    });
    if (error) throw error;
  }

  return { products, loading, addProduct, updateProduct, deleteProduct, decrementQuantity, sendToShoppingList, refresh: fetchProducts };
}
