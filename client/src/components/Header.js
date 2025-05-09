import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGauge,
  faCalendarPlus,
  faLink,
  faCalendarAlt,
  faUserPlus,
  faUsersCog,
  faFileInvoiceDollar,
  faCog,
  faTools,
  faSlidersH,
  faFileSignature
} from '@fortawesome/free-solid-svg-icons';

// Map routes to page names and icons
const PAGE_META = {
  '/': { title: 'Dashboard', icon: faGauge },
  '/scheduler-create': { title: 'Create Event', icon: faCalendarPlus },
  '/scheduler-ongoing': { title: 'Ongoing Jobs', icon: faLink },
  '/scheduler-manage': { title: 'Manage Events', icon: faCalendarAlt },
  '/add-sub': { title: 'Add Sub', icon: faUserPlus },
  '/manage-subs': { title: 'Manage Subs', icon: faUsersCog },
  '/invoice-create': { title: 'Invoices', icon: faFileInvoiceDollar },
  '/settings': { title: 'Quick Settings', icon: faCog },
  '/quote-tools': { title: 'Quote Tools', icon: faTools }
};

function Header() {
  const location = useLocation();
  const meta = PAGE_META[location.pathname] || {};
  const pageTitle = meta.title || '';
  const pageIcon = meta.icon || faSlidersH;

  // Date and time state
  const [dateTime, setDateTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = dateTime.toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });
  const formattedTime = dateTime.toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <Box
      sx={{
        width: '100%',
        height: '54px',
        background: '#6cb6f5',
        color: '#222',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2.1em',
        fontWeight: 700,
        letterSpacing: '0.02em',
        zIndex: 10,
        fontFamily: `'Inter', 'Segoe UI', Arial, sans-serif`,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        px: 2
      }}
      className="app-header"
    >
      {/* Left: Brand */}
      <Box
        sx={{
          flex: '0 0 auto',
          minWidth: 140,
          textAlign: 'left',
          fontWeight: 900,
          color: '#111',
          fontSize: '0.95em',
          lineHeight: 1,
          letterSpacing: '0.01em',
          fontFamily: `'Inter', 'Segoe UI', Arial, sans-serif`
        }}
      >
        Bright Prodigy
      </Box>
      {/* Center: Page Icon + Title */}
      <Box
        sx={{
          flex: '1 1 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '1em',
          color: '#111'
        }}
      >
        <FontAwesomeIcon icon={pageIcon} style={{ marginRight: 18, color: '#111', fontSize: '0.85em', verticalAlign: 'middle' }} />
        {pageTitle}
      </Box>
      {/* Right: Date and Time */}
      <Box
        sx={{
          flex: '0 0 auto',
          minWidth: 220,
          textAlign: 'right',
          fontWeight: 500,
          fontSize: '0.65em',
          color: '#222',
          fontFamily: `'Inter', 'Segoe UI', Arial, sans-serif`
        }}
      >
        <span>{formattedDate}</span>
        <span style={{ marginLeft: 12 }}>{formattedTime}</span>
      </Box>
    </Box>
  );
}

export default Header;
