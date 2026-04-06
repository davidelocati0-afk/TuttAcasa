import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HouseholdProvider, useHousehold } from './contexts/HouseholdContext';
import BottomNav from './components/layout/BottomNav';
import Login from './pages/Login';
import JoinHousehold from './pages/JoinHousehold';
import Home from './pages/Home';
import Pantry from './pages/Pantry';
import ShoppingList from './pages/ShoppingList';
import Bills from './pages/Bills';
import MealPlanner from './pages/MealPlanner';
import Chat from './pages/Chat';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
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
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
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
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pantry" element={<Pantry />} />
        <Route path="/shopping" element={<ShoppingList />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/planner" element={<MealPlanner />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
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
