import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

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

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    h5: {
      fontWeight: 500,
    },
  },
});

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Header handleDrawerToggle={handleDrawerToggle} />
        <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-sub" element={<AddSub />} />
            <Route path="/manage-subs" element={<ManageSubs />} />
            <Route path="/scheduler-create" element={<SchedulerCreate />} />
            <Route path="/scheduler-manage" element={<SchedulerManage />} />
            <Route path="/scheduler-ongoing" element={<SchedulerOngoing />} />
            <Route path="/quote-tools" element={<QuoteTools />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
