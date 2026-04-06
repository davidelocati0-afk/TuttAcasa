import { useState, useRef, useEffect } from 'react';
import Header from '../components/layout/Header';
import { useMealPlanner } from '../hooks/useMealPlanner';
import theme from '../styles/theme';
import toast from 'react-hot-toast';

const DAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
const MEAL_LABELS = { pranzo: 'Pranzo', cena: 'Cena' };
const MEAL_ICONS = {
  pranzo: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20"/><path d="M2 12h20"/></svg>,
  cena: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.primary[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
};

function getTodayIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1; // Monday=0, Sunday=6
}

export default function MealPlanner() {
  const { meals, loading, addMeal, removeMeal, missingItems, addMissingToShoppingList, getMealsForDay, products } = useMealPlanner();
  const [selectedDay, setSelectedDay] = useState(getTodayIndex());
  const [addingFor, setAddingFor] = useState(null); // { day, mealType }
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMissing, setShowMissing] = useState(false);
  const inputRef = useRef(null);
  const daysRef = useRef(null);

  const todayIndex = getTodayIndex();
  const dayMeals = getMealsForDay(selectedDay);

  // Scroll to today on mount
  useEffect(() => {
    if (daysRef.current) {
      const btn = daysRef.current.children[todayIndex];
      if (btn) btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [todayIndex]);

  // Focus input when adding
  useEffect(() => {
    if (addingFor && inputRef.current) inputRef.current.focus();
  }, [addingFor]);

  // Filter pantry products for suggestions
  const suggestions = inputValue.length >= 2
    ? products.filter(p => p.name.toLowerCase().includes(inputValue.toLowerCase())).slice(0, 6)
    : [];

  function handleAdd(mealType) {
    setAddingFor({ day: selectedDay, mealType });
    setInputValue('');
    setShowSuggestions(false);
  }

  async function submitItem(productId = null, name = null) {
    const itemName = name || inputValue.trim();
    if (!itemName || !addingFor) return;
    try {
      await addMeal(addingFor.day, addingFor.mealType, itemName, productId);
      toast.success(`${itemName} aggiunto`);
    } catch {
      toast.error('Errore');
    }
    setAddingFor(null);
    setInputValue('');
    setShowSuggestions(false);
  }

  async function handleRemove(meal) {
    try {
      await removeMeal(meal.id);
      toast.success('Rimosso');
    } catch {
      toast.error('Errore');
    }
  }

  async function handleAddToShopping(item) {
    try {
      await addMissingToShoppingList(item.item_name);
      toast.success(`${item.item_name} aggiunto alla spesa`);
    } catch {
      toast.error('Errore');
    }
  }

  const missingNotInList = missingItems.filter(m => !m.inShoppingList);

  return (
    <div style={{ minHeight: '100vh', background: theme.bg.page, paddingBottom: '100px' }}>
      <Header title="Planner" subtitle="Menu settimanale" />

      <div style={{ padding: '0 16px' }}>
        {/* Missing items banner */}
        {missingNotInList.length > 0 && (
          <button onClick={() => setShowMissing(!showMissing)} style={{
            width: '100%', padding: '12px 16px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
            border: '1px solid #FCD34D',
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '14px', cursor: 'pointer',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
            </svg>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#92400E' }}>
                {missingNotInList.length} {missingNotInList.length === 1 ? 'prodotto mancante' : 'prodotti mancanti'}
              </span>
              <span style={{ fontSize: '11px', color: '#A16207', display: 'block' }}>
                Non presenti in dispensa
              </span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: showMissing ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        )}

        {/* Missing items list */}
        {showMissing && missingNotInList.length > 0 && (
          <div style={{
            background: theme.bg.card, borderRadius: '16px', padding: '12px',
            border: `1px solid ${theme.border.light}`, marginBottom: '14px',
            boxShadow: theme.shadow.sm,
          }}>
            {missingNotInList.map(item => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 4px',
                borderBottom: `1px solid ${theme.border.light}`,
              }}>
                <span style={{ flex: 1, fontSize: '14px', fontWeight: '600', color: theme.text.primary }}>
                  {item.item_name}
                </span>
                <button onClick={() => handleAddToShopping(item)} style={{
                  padding: '6px 12px', borderRadius: '10px',
                  background: theme.accent[500], color: '#fff',
                  fontSize: '11px', fontWeight: '700',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Spesa
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Day selector - horizontal scroll */}
        <div ref={daysRef} style={{
          display: 'flex', gap: '8px', overflowX: 'auto',
          paddingBottom: '4px', marginBottom: '16px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}>
          {DAYS.map((day, i) => {
            const isToday = i === todayIndex;
            const isSelected = i === selectedDay;
            const dayMealsCount = getMealsForDay(i);
            const count = dayMealsCount.pranzo.length + dayMealsCount.cena.length;
            return (
              <button key={i} onClick={() => setSelectedDay(i)} style={{
                minWidth: '72px', padding: '10px 8px', borderRadius: '14px',
                background: isSelected ? theme.gradient : theme.bg.card,
                border: isToday && !isSelected ? `2px solid ${theme.primary[300]}` : `1px solid ${isSelected ? 'transparent' : theme.border.light}`,
                boxShadow: isSelected ? theme.shadow.glow : theme.shadow.sm,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                flexShrink: 0, cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                <span style={{
                  fontSize: '11px', fontWeight: '700',
                  color: isSelected ? '#fff' : theme.text.muted,
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                  {day.slice(0, 3)}
                </span>
                {count > 0 && (
                  <span style={{
                    fontSize: '9px', fontWeight: '800',
                    color: isSelected ? 'rgba(255,255,255,0.8)' : theme.primary[400],
                  }}>
                    {count} {count === 1 ? 'piatto' : 'piatti'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Day title */}
        <h2 style={{
          fontSize: '20px', fontWeight: '800', color: theme.text.primary,
          marginBottom: '14px', paddingLeft: '4px',
        }}>
          {DAYS[selectedDay]}
          {selectedDay === todayIndex && (
            <span style={{ fontSize: '12px', fontWeight: '600', color: theme.primary[400], marginLeft: '8px' }}>
              Oggi
            </span>
          )}
        </h2>

        {/* Meal sections */}
        {['pranzo', 'cena'].map(mealType => {
          const mealItems = dayMeals[mealType];
          return (
            <div key={mealType} style={{
              background: theme.bg.card, borderRadius: '18px',
              padding: '16px', marginBottom: '12px',
              border: `1px solid ${theme.border.light}`,
              boxShadow: theme.shadow.sm,
            }}>
              {/* Meal header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '10px',
                  background: mealType === 'pranzo' ? '#FEF3C7' : theme.primary[50],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {MEAL_ICONS[mealType]}
                </div>
                <span style={{ fontSize: '16px', fontWeight: '700', color: theme.text.primary, flex: 1 }}>
                  {MEAL_LABELS[mealType]}
                </span>
                <button onClick={() => handleAdd(mealType)} style={{
                  width: '34px', height: '34px', borderRadius: '10px',
                  background: theme.primary[50],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.primary[500]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </button>
              </div>

              {/* Meal items */}
              {mealItems.length === 0 && !(addingFor?.day === selectedDay && addingFor?.mealType === mealType) && (
                <p style={{ fontSize: '13px', color: theme.text.muted, fontStyle: 'italic', padding: '4px 0' }}>
                  Nessun piatto aggiunto
                </p>
              )}

              {mealItems.map(item => {
                const inPantry = products.some(p => p.name.toLowerCase() === item.item_name.toLowerCase());
                return (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 4px',
                    borderTop: `1px solid ${theme.border.light}`,
                  }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: inPantry ? theme.success : theme.warning,
                      flexShrink: 0,
                    }} />
                    <span style={{ flex: 1, fontSize: '14px', fontWeight: '600', color: theme.text.primary }}>
                      {item.item_name}
                    </span>
                    {!inPantry && (
                      <span style={{
                        fontSize: '9px', fontWeight: '700', padding: '3px 8px',
                        borderRadius: '6px', background: '#FEF3C7', color: '#D97706',
                      }}>
                        Mancante
                      </span>
                    )}
                    <button onClick={() => handleRemove(item)} style={{
                      width: '28px', height: '28px', borderRadius: '8px',
                      background: 'rgba(220,38,38,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', flexShrink: 0,
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.danger} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                );
              })}

              {/* Add input */}
              {addingFor?.day === selectedDay && addingFor?.mealType === mealType && (
                <div style={{ paddingTop: '8px', borderTop: `1px solid ${theme.border.light}`, position: 'relative' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      ref={inputRef}
                      value={inputValue}
                      onChange={e => {
                        setInputValue(e.target.value);
                        setShowSuggestions(e.target.value.length >= 2);
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') submitItem();
                        if (e.key === 'Escape') { setAddingFor(null); setInputValue(''); }
                      }}
                      placeholder="Scrivi un piatto o prodotto..."
                      style={{
                        flex: 1, padding: '10px 14px', borderRadius: '12px',
                        border: `2px solid ${theme.primary[200]}`,
                        fontSize: '14px', fontWeight: '500',
                        outline: 'none',
                      }}
                    />
                    <button onClick={() => submitItem()} disabled={!inputValue.trim()} style={{
                      padding: '10px 16px', borderRadius: '12px',
                      background: inputValue.trim() ? theme.gradient : theme.border.light,
                      color: inputValue.trim() ? '#fff' : theme.text.muted,
                      fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                    }}>
                      Aggiungi
                    </button>
                    <button onClick={() => { setAddingFor(null); setInputValue(''); }} style={{
                      width: '42px', borderRadius: '12px',
                      background: 'rgba(220,38,38,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.danger} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>

                  {/* Suggestions from pantry */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div style={{
                      position: 'absolute', left: 0, right: 0, top: '100%',
                      background: '#fff', borderRadius: '12px',
                      boxShadow: theme.shadow.lg, border: `1px solid ${theme.border.light}`,
                      marginTop: '4px', zIndex: 20, maxHeight: '200px', overflowY: 'auto',
                    }}>
                      <div style={{ padding: '6px 12px', borderBottom: `1px solid ${theme.border.light}` }}>
                        <span style={{ fontSize: '10px', fontWeight: '700', color: theme.primary[400], textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Dalla dispensa
                        </span>
                      </div>
                      {suggestions.map(p => (
                        <button key={p.id} onClick={() => submitItem(p.id, p.name)} style={{
                          width: '100%', padding: '10px 12px',
                          display: 'flex', alignItems: 'center', gap: '10px',
                          borderBottom: `1px solid ${theme.border.light}`,
                          cursor: 'pointer', textAlign: 'left',
                        }}>
                          <div style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: theme.success, flexShrink: 0,
                          }} />
                          <span style={{ fontSize: '14px', fontWeight: '600', color: theme.text.primary, flex: 1 }}>
                            {p.name}
                          </span>
                          {p.quantity && (
                            <span style={{ fontSize: '11px', color: theme.text.muted }}>
                              {p.quantity} {p.unit || 'pz'}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
