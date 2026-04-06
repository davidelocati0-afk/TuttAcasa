import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../config/supabase';
import { useHousehold } from '../contexts/HouseholdContext';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from './useProducts';
import { useShoppingList } from './useShoppingList';

export function useMealPlanner() {
  const { household } = useHousehold();
  const { user } = useAuth();
  const { products } = useProducts();
  const { items: shoppingItems, addItem: addShoppingItem } = useShoppingList();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeals = useCallback(async () => {
    if (!household) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('household_id', household.id)
      .order('day_of_week')
      .order('meal_type');

    if (!error) setMeals(data || []);
    setLoading(false);
  }, [household]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  useEffect(() => {
    if (!household) return;
    const channel = supabase
      .channel('meals-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'meal_plans',
        filter: `household_id=eq.${household.id}`,
      }, () => {
        fetchMeals();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [household, fetchMeals]);

  async function addMeal(dayOfWeek, mealType, itemName, productId = null) {
    const fromPantry = !!productId || products.some(p => p.name.toLowerCase() === itemName.toLowerCase());
    const matchedProduct = productId ? products.find(p => p.id === productId) : products.find(p => p.name.toLowerCase() === itemName.toLowerCase());

    const { error } = await supabase.from('meal_plans').insert({
      household_id: household.id,
      day_of_week: dayOfWeek,
      meal_type: mealType,
      item_name: itemName,
      from_pantry: !!matchedProduct,
      product_id: matchedProduct?.id || null,
      added_by: user.id,
    });
    if (error) throw error;
    await fetchMeals();
  }

  async function removeMeal(id) {
    const { error } = await supabase
      .from('meal_plans')
      .delete()
      .eq('id', id);
    if (error) throw error;
    await fetchMeals();
  }

  async function updateMeal(id, updates) {
    const { error } = await supabase
      .from('meal_plans')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    await fetchMeals();
  }

  // Find items in the meal plan that are NOT in the pantry and NOT already in shopping list
  const missingItems = useMemo(() => {
    const productNames = new Set(products.map(p => p.name.toLowerCase()));
    const shoppingNames = new Set(shoppingItems.map(i => i.name.toLowerCase()));
    const seen = new Set();
    const missing = [];

    meals.forEach(m => {
      const lower = m.item_name.toLowerCase();
      if (!productNames.has(lower) && !seen.has(lower)) {
        seen.add(lower);
        missing.push({
          ...m,
          inShoppingList: shoppingNames.has(lower),
        });
      }
    });
    return missing;
  }, [meals, products, shoppingItems]);

  async function addMissingToShoppingList(itemName) {
    await addShoppingItem(itemName, 1, 'pz');
  }

  function getMealsForDay(dayOfWeek) {
    return {
      pranzo: meals.filter(m => m.day_of_week === dayOfWeek && m.meal_type === 'pranzo'),
      cena: meals.filter(m => m.day_of_week === dayOfWeek && m.meal_type === 'cena'),
    };
  }

  return {
    meals, loading, addMeal, removeMeal, updateMeal,
    missingItems, addMissingToShoppingList, getMealsForDay,
    products, refresh: fetchMeals,
  };
}
