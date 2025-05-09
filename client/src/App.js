import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// Import components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AddSub from './components/AddSub';
import ManageSubs from './components/ManageSubs';
import SchedulerCreate from './components/SchedulerCreate';
import SchedulerManage from './components/SchedulerManage';
import SchedulerOngoing from './components/SchedulerOngoing';
import QuoteTools from './components/QuoteTools';
import Settings from './components/Settings';
import InvoiceCreate from './components/InvoiceCreate';

// Create context for notifications and loading state
export const NotificationContext = createContext();
export const LoadingContext = createContext();

// Create theme to match original
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f7f9fb',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Arial", sans-serif',
    fontSize: 13,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h5: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '0.98rem',
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.85rem',
      letterSpacing: '0.01em',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(30,41,59,0.05)',
          borderRadius: '7px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(30,41,59,0.05)',
          height: 38,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 38,
          height: 38,
          paddingLeft: 14,
          paddingRight: 14,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 7,
        },
      },
    },
  },
});

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(false);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const showNotification = (severity, message) => {
    setNotification({
      open: true,
      severity,
      message
    });
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, open: false }));
    }, 5000);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      <LoadingContext.Provider value={{ loading, setLoading }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ display: 'flex', height: '100vh' }}>
            <Header handleDrawerToggle={handleDrawerToggle} />
            <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
            <Box 
              component="main" 
              sx={{ 
                flexGrow: 1, 
                p: '1.1rem', 
                mt: '38px', 
                overflowY: 'auto',
                background: '#f7f9fb',
                position: 'relative'
              }}
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/add-sub" element={<AddSub />} />
                <Route path="/manage-subs" element={<ManageSubs />} />
                <Route path="/scheduler-create" element={<SchedulerCreate />} />
                <Route path="/scheduler-manage" element={<SchedulerManage />} />
                <Route path="/scheduler-ongoing" element={<SchedulerOngoing />} />
                <Route path="/quote-tools" element={<QuoteTools />} />
                <Route path="/invoice-create" element={<InvoiceCreate />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Box>
          </Box>
          
          {/* Notification System */}
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={notification.open}
            onClose={handleCloseNotification}
            sx={{
              top: '70px',
              right: '24px',
              maxWidth: '350px',
              '& .MuiPaper-root': {
                borderRadius: '7px',
                boxShadow: '0 4px 16px rgba(30,41,59,0.10)',
                fontSize: '0.98em',
              }
            }}
          >
            <Alert 
              onClose={handleCloseNotification} 
              severity={notification.severity} 
              sx={{ width: '100%' }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
          
          {/* Loading Overlay */}
          <Backdrop
            sx={{ 
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: 'rgba(255,255,255,0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            open={loading}
          >
            <CircularProgress size={50} />
          </Backdrop>
        </ThemeProvider>
      </LoadingContext.Provider>
    </NotificationContext.Provider>
  );
}

export default App;
