import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HouseholdProvider, useHousehold } from './contexts/HouseholdContext';
import BottomNav from './components/layout/BottomNav';
import Login from './pages/Login';
import JoinHousehold from './pages/JoinHousehold';
import Pantry from './pages/Pantry';
import ShoppingList from './pages/ShoppingList';
import Bills from './pages/Bills';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import { useProducts } from './hooks/useProducts';
import { useBills } from './hooks/useBills';
import { useShoppingList } from './hooks/useShoppingList';
import { useNotifications } from './hooks/useNotifications';
import theme from './styles/theme';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { household, loading: hhLoading } = useHousehold();

  if (authLoading || (user && hhLoading)) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: theme.bg.page,
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{'\u{1F3E0}'}</div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', background: theme.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          TuttAcasa
        </h1>
        <p style={{ color: theme.text.muted, marginTop: '8px' }}>Caricamento...</p>
      </div>
    );
  }

  if (!user) return <Login />;
  if (!household) return <JoinHousehold />;

  return <AuthenticatedApp />;
}

function AuthenticatedApp() {
  const { products } = useProducts();
  const { bills } = useBills();
  const { unboughtCount } = useShoppingList();
  const { alerts, alertCount } = useNotifications(products, bills);

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Pantry />} />
        <Route path="/shopping" element={<ShoppingList />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/alerts" element={<Alerts alerts={alerts} />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav alertCount={alertCount} shoppingCount={unboughtCount} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <HouseholdProvider>
          <AppContent />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: theme.gradient,
                color: '#fff',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '14px',
              },
              duration: 2500,
            }}
          />
        </HouseholdProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
