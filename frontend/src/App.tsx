import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

// Create a beautiful, professional theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#1976d2',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#333333',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#333333',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <AppHeader />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

const AppHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = (path?: string) => {
    // simple navigate using window.location to avoid importing router here
    if (path) window.location.href = path;
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 20px', background: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/logo192.png" alt="InsureMithra" style={{ height: 36, marginRight: 12 }} />
        <h3 style={{ margin: 0, color: '#1976d2' }}>InsureMithra</h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <>
            <div style={{ textAlign: 'right', marginRight: 8 }}>
              <div style={{ fontSize: 14, color: '#333' }}>{user.firstName} {user.lastName}</div>
              <div style={{ fontSize: 12, color: '#666' }}>Role: {user.role}</div>
            </div>
            <div>
              <button onClick={handleMenuOpen} style={{ padding: 6, borderRadius: 6, border: '1px solid #ddd', background: '#fff' }}>
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </button>
              {anchorEl && (
                <div style={{ position: 'absolute', right: 20, top: 56, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.12)', borderRadius: 8 }}>
                  <div style={{ padding: 8 }}>
                    <div style={{ cursor: 'pointer', padding: '8px 12px' }} onClick={() => { handleMenuClose(); navigate('/profile'); }}>Profile</div>
                    {user.role === 'admin' && (
                      <div style={{ cursor: 'pointer', padding: '8px 12px' }} onClick={() => { handleMenuClose(); navigate('/admin'); }}>Admin Panel</div>
                    )}
                    <div style={{ cursor: 'pointer', padding: '8px 12px' }} onClick={() => { handleMenuClose(); logout(); navigate('/login'); }}>Logout</div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div />
        )}
      </div>
    </header>
  );
};
