import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGauge,
  faCalendarPlus,
  faCalendarAlt,
  faUserPlus,
  faUsersCog,
  faFileInvoiceDollar,
  faTools,
  faCog,
  faCompressArrowsAlt
} from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';

// Sidebar width constants
const DRAWER_WIDTH_EXPANDED = 180;
const DRAWER_WIDTH_COLLAPSED = 60;

// Styled components
const StyledDrawer = styled(Drawer)(({ collapsed }) => ({
  width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  overflowX: 'hidden',
  transition: 'width 0.18s cubic-bezier(0.4,0,0.2,1)',
  '& .MuiDrawer-paper': {
    width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED,
    background: '#6cb6f5',
    color: '#222',
    borderRight: 'none',
    boxShadow: 'none',
    overflowX: 'hidden',
    transition: 'width 0.18s cubic-bezier(0.4,0,0.2,1)',
    padding: '10px 0 0 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '54px',
    borderRadius: 0,
    paddingBottom: '54px',
  },
}));

const NavScrollArea = styled(Box)(({ collapsed }) => ({
  width: '100%',
  flex: '1 1 auto',
  overflowY: 'auto',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
}));

const NavGroup = styled(Box)({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: 0,
});

const NavGroupSpace = styled(Box)({
  height: 10,
  minHeight: 10,
  width: '100%',
  display: 'block',
  background: 'transparent',
  border: 'none',
  margin: 0,
  padding: 0,
});

const NavItem = styled(Box)(({ active, collapsed, expanded }) => ({
  padding: collapsed ? '10px 0' : '10px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: 0,
  cursor: 'pointer',
  borderRadius: 7,
  margin: collapsed ? '2px auto' : '2px 8px',
  color: active ? '#111' : '#fff',
  fontWeight: 500,
  fontSize: '0.98em',
  transition: 'background 0.13s, color 0.13s',
  background: active ? 'rgba(255,255,255,0.85)' : 'transparent',
  border: 'none',
  outline: 'none',
  letterSpacing: '0.01em',
  width: collapsed ? '44px' : 'auto',
  justifyContent: collapsed ? 'center' : 'left',
  position: 'relative',
  '&:hover': {
    background: 'rgba(255,255,255,0.85)',
    color: '#111',
    boxShadow: 'none',
    '& .nav-icon': {
      color: '#111',
    }
  },
  '& .nav-icon': {
    fontSize: '1.25em',
    width: 44,
    minWidth: 44,
    maxWidth: 44,
    textAlign: 'center',
    color: active ? '#111' : '#fff',
    transition: 'color 0.13s',
    flexShrink: 0,
    flexGrow: 0,
    left: 0,
    position: expanded ? 'sticky' : 'relative',
    top: expanded ? 0 : 'auto',
    zIndex: expanded ? 2 : 'auto',
    display: 'inline-block',
    background: 'transparent',
  },
  '& .nav-text': {
    display: collapsed ? 'none' : 'inline-block',
    marginLeft: 0,
    paddingLeft: 8,
    flex: '1 1 auto',
    textAlign: 'left',
    fontSize: '0.97em',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    transition: 'opacity 0.18s, width 0.18s',
    opacity: collapsed ? 0 : 1,
  }
}));

const NavSettings = styled(Box)({
  marginTop: 'auto',
  marginBottom: 18,
  width: '100%',
  position: 'sticky',
  bottom: 0,
  zIndex: 10,
  background: '#6cb6f5',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 60,
});

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const isMobile = useMediaQuery('(max-width:900px)');
  const expanded = !collapsed;

  useEffect(() => {
    setCollapsed(!isMobile);
  }, [isMobile]);

  // Sidebar hover expand/collapse (desktop only)
  const handleMouseEnter = () => {
    if (!isMobile) setCollapsed(false);
  };
  const handleMouseLeave = () => {
    if (!isMobile) setCollapsed(true);
  };

  // Nav items: order and grouping matches Apps Script main.html
  const navItems = [
    // Dash group
    { type: 'item', text: 'Dash', icon: faGauge, path: '/', group: 'dash' },
    { type: 'space', group: 'dash' },

    // Scheduler group
    { type: 'item', text: 'Create Event', icon: faCalendarPlus, path: '/scheduler-create', group: 'scheduler' },
    { type: 'item', text: 'Ongoing Jobs', icon: faLink, path: '/scheduler-ongoing', group: 'scheduler' },
    { type: 'item', text: 'Manage Events', icon: faCalendarAlt, path: '/scheduler-manage', group: 'scheduler' },
    { type: 'space', group: 'scheduler' },

    // Subs group
    { type: 'item', text: 'Manage Subs', icon: faUsersCog, path: '/manage-subs', group: 'subs' },
    { type: 'item', text: 'Add Sub', icon: faUserPlus, path: '/add-sub', group: 'subs' },
    { type: 'space', group: 'subs' },

    // Invoices group
    { type: 'item', text: 'Create Invoice', icon: faFileInvoiceDollar, path: '/invoice-create', group: 'invoices' },
    { type: 'space', group: 'invoices' },

    // Quote Tools
    { type: 'item', text: 'Quote Tools', icon: faTools, path: '/quote-tools', group: 'tools' }
  ];

  // Group nav items for rendering
  const groupedNavItems = [];
  let lastGroup = null;
  navItems.forEach((item, idx) => {
    if (item.type === 'space') {
      groupedNavItems.push(<NavGroupSpace key={`space-${idx}`} />);
    } else {
      if (!lastGroup || lastGroup !== item.group) {
        lastGroup = item.group;
      }
      groupedNavItems.push(
        <NavItem
          key={item.text}
          onClick={() => navigate(item.path)}
          active={location.pathname === item.path}
          collapsed={collapsed}
          expanded={expanded}
        >
          <span className="nav-icon">
            <FontAwesomeIcon icon={item.icon} />
          </span>
          <span className="nav-text">{item.text}</span>
        </NavItem>
      );
    }
  });

  // Desktop sidebar content
  const desktopDrawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <NavScrollArea collapsed={collapsed}>
        <NavGroup>
          {/* Hidden title for accessibility */}
          <div className="visually-hidden" style={{ height: 0, width: 0, overflow: 'hidden' }}>Bright Prodigy</div>
          {groupedNavItems}
        </NavGroup>
      </NavScrollArea>
      {/* Settings at the bottom, always visible and sticky */}
      <NavSettings>
        <NavItem
          onClick={() => navigate('/settings')}
          active={location.pathname === '/settings'}
          collapsed={collapsed}
          expanded={expanded}
        >
          <span className="nav-icon">
            <FontAwesomeIcon icon={faCog} />
          </span>
          <span className="nav-text">Quick Settings</span>
        </NavItem>
      </NavSettings>
      {/* Shrink/Expand Button (visual only) */}
      <Box
        sx={{
          textAlign: 'center',
          color: '#a5b4fc',
          padding: '5px 0',
          fontSize: '0.9rem',
          display: collapsed ? 'none' : 'block'
        }}
      >
        <FontAwesomeIcon icon={faCompressArrowsAlt} />
      </Box>
    </Box>
  );

  // Mobile nav: horizontal bar at bottom
  const mobileDrawerContent = (
    <Box sx={{ width: '100vw' }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        padding: '5px 0'
      }}>
        {navItems.filter(item => item.type === 'item').map((item, index) => (
          <NavItem
            key={index}
            onClick={() => navigate(item.path)}
            active={location.pathname === item.path}
            sx={{
              margin: '0',
              padding: '8px 0',
              borderRadius: 0,
              flexDirection: 'column',
              gap: 1
            }}
          >
            <span className="nav-icon">
              <FontAwesomeIcon icon={item.icon} />
            </span>
            <Typography variant="caption" className="nav-text" sx={{ display: 'block !important', fontSize: '0.7rem' }}>
              {item.text}
            </Typography>
          </NavItem>
        ))}
        <NavItem
          onClick={() => navigate('/settings')}
          active={location.pathname === '/settings'}
          sx={{
            margin: '0',
            padding: '8px 0',
            borderRadius: 0,
            flexDirection: 'column',
            gap: 1
          }}
        >
          <span className="nav-icon">
            <FontAwesomeIcon icon={faCog} />
          </span>
          <Typography variant="caption" className="nav-text" sx={{ display: 'block !important', fontSize: '0.7rem' }}>
            Quick Settings
          </Typography>
        </NavItem>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: 0,
        display: 'flex',
      }}
      aria-label="main navigation"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isMobile ? (
        <Box
          sx={{
            width: '100vw',
            height: '56px',
            position: 'fixed',
            bottom: 0,
            left: 0,
            zIndex: 1000,
            background: 'linear-gradient(180deg, #23272f 0%, #1e293b 100%)',
            display: { xs: 'block', sm: 'none' }
          }}
        >
          {mobileDrawerContent}
        </Box>
      ) : (
        <StyledDrawer
          variant="permanent"
          collapsed={collapsed ? 1 : 0}
          sx={{
            display: { xs: 'none', sm: 'block' },
          }}
          open
        >
          {desktopDrawerContent}
        </StyledDrawer>
      )}
    </Box>
  );
}

export default Sidebar;
