import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';

const HouseholdContext = createContext(null);

export function HouseholdProvider({ children }) {
  const { user } = useAuth();
  const [household, setHousehold] = useState(null);
  const [members, setMembers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHousehold(null);
      setMembers([]);
      setCategories([]);
      setLoading(false);
      return;
    }
    loadHousehold();
  }, [user]);

  async function loadHousehold() {
    setLoading(true);
    try {
      const { data: memberData } = await supabase
        .from('household_members')
        .select('household_id, role')
        .eq('user_id', user.id)
        .single();

      if (!memberData) {
        setHousehold(null);
        setLoading(false);
        return;
      }

      const { data: hh } = await supabase
        .from('households')
        .select('*')
        .eq('id', memberData.household_id)
        .single();

      setHousehold(hh);

      const { data: mems } = await supabase
        .from('household_members')
        .select('*')
        .eq('household_id', hh.id);

      setMembers(mems || []);

      const { data: cats } = await supabase
        .from('categories')
        .select('*')
        .eq('household_id', hh.id)
        .order('sort_order');

      setCategories(cats || []);
    } catch (err) {
      console.error('Error loading household:', err);
    }
    setLoading(false);
  }

  async function createHousehold(name) {
    const { data, error } = await supabase.rpc('create_household_with_defaults', {
      household_name: name,
      owner_id: user.id,
    });
    if (error) throw error;
    await loadHousehold();
    return data;
  }

  async function joinHousehold(code) {
    const { data, error } = await supabase.rpc('join_household', {
      code,
      joining_user_id: user.id,
    });
    if (error) throw error;
    await loadHousehold();
    return data;
  }

  return (
    <HouseholdContext.Provider value={{
      household, members, categories, loading,
      createHousehold, joinHousehold, reload: loadHousehold,
    }}>
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  const context = useContext(HouseholdContext);
  if (!context) throw new Error('useHousehold must be used within HouseholdProvider');
  return context;
}
