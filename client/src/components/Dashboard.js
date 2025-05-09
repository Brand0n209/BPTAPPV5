import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent 
} from '@mui/material';

// Import FontAwesome icons
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
  faLink
} from '@fortawesome/free-solid-svg-icons';

// Import our custom components
import { LoadingContext, NotificationContext } from '../App';

function Dashboard() {
  const navigate = useNavigate();
  const { setLoading } = useContext(LoadingContext);
  const { showNotification } = useContext(NotificationContext);
  const [updateText, setUpdateText] = useState('Loading updates...');
  const [statsText, setStatsText] = useState('Coming soon...');
  const [systemStatus, setSystemStatus] = useState('Checking...');
  const [usageStats, setUsageStats] = useState({
    users: 0,
    jobs: 0,
    invoices: 0,
    revenue: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [envInfo, setEnvInfo] = useState({
    version: '1.0.0',
    build: '2025-05-07',
    node: ''
  });

  useEffect(() => {
    // Simulate fetching system status
    setTimeout(() => setSystemStatus('All systems operational'), 500);

    // Simulate fetching usage stats
    setTimeout(() => setUsageStats({
      users: 42,
      jobs: 128,
      invoices: 87,
      revenue: 24500
    }), 700);

    // Simulate fetching recent activity
    setTimeout(() => setRecentActivity([
      { type: 'Job', desc: 'Created event for John Doe', time: '2 min ago' },
      { type: 'Invoice', desc: 'Generated invoice #1023', time: '10 min ago' },
      { type: 'User', desc: 'Added new sub Alice Smith', time: '1 hour ago' }
    ]), 900);

    // Fetch environment info from backend
    fetch('/api/dashboard/env')
      .then(async res => {
        if (!res.ok) {
          setEnvInfo({ error: `Failed to load environment info (status ${res.status})` });
          return;
        }
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          setEnvInfo({ error: 'Failed to load environment info (not JSON response)' });
          return;
        }
        try {
          const data = await res.json();
          setEnvInfo(data);
        } catch (e) {
          setEnvInfo({ error: 'Failed to load environment info (invalid JSON)' });
        }
      })
      .catch(() => setEnvInfo({ error: 'Failed to load environment info (network error)' }));

    // Simulate fetching updates
    setLoading(true);
    setTimeout(() => {
      setUpdateText('Welcome to the new dashboard! All systems are running smoothly.');
      setLoading(false);
    }, 1200);
  }, [setLoading]);

  // Handle navigation to different modules
  const handleNavigation = (module, action = null) => {
    let path = '/';
    switch (module) {
      case 'dash':
        path = '/';
        break;
      case 'scheduler':
        if (action === 'create') path = '/scheduler-create';
        else if (action === 'manage') path = '/scheduler-manage';
        else if (action === 'ongoing') path = '/scheduler-ongoing';
        break;
      case 'add-sub':
        path = '/add-sub';
        break;
      case 'manage-subs':
        path = '/manage-subs';
        break;
      case 'invoice-create':
        path = '/invoice-create';
        break;
      case 'quote-tools':
        path = '/quote-tools';
        break;
      case 'settings':
        path = '/settings';
        break;
      default:
        path = '/';
    }
    navigate(path);
  };

  // Quick Nav Button component for consistent styling
  const QuickNavButton = ({ icon, title, description, onClick }) => (
    <Button 
      variant="outlined" 
      color="primary"
      onClick={onClick}
      sx={{
        minWidth: '180px',
        maxWidth: '180px',
        width: '180px',
        textAlign: 'center',
        whiteSpace: 'normal',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px 5px',
        gap: '5px',
        borderRadius: '7px'
      }}
    >
      <FontAwesomeIcon icon={icon} style={{ fontSize: '2em' }} />
      <Typography variant="button" sx={{ mt: 1 }}>
        {title}
      </Typography>
      <Typography variant="caption" sx={{ 
        fontSize: '0.85em', 
        color: '#6c757d', 
        lineHeight: 1.2 
      }}>
        {description}
      </Typography>
    </Button>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Quick Navigation at the top */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Quick Navigation
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem'
            }}
          >
            <QuickNavButton
              icon={faGauge}
              title="Dash"
              description="Overview and latest updates"
              onClick={() => handleNavigation('dash')}
            />
            <QuickNavButton
              icon={faCalendarPlus}
              title="Create Event"
              description="Schedule a new job"
              onClick={() => handleNavigation('scheduler', 'create')}
            />
            <QuickNavButton
              icon={faLink}
              title="Ongoing Jobs"
              description="Continue / split an existing job"
              onClick={() => handleNavigation('scheduler', 'ongoing')}
            />
            <QuickNavButton
              icon={faCalendarAlt}
              title="Manage Events"
              description="View / edit / delete all scheduled events"
              onClick={() => handleNavigation('scheduler', 'manage')}
            />
            <QuickNavButton
              icon={faUserPlus}
              title="Add Sub"
              description="Add a new sub"
              onClick={() => handleNavigation('add-sub')}
            />
            <QuickNavButton
              icon={faUsersCog}
              title="Manage Subs"
              description="Edit or remove subs"
              onClick={() => handleNavigation('manage-subs')}
            />
            <QuickNavButton
              icon={faFileInvoiceDollar}
              title="Invoices"
              description="Create / download invoices"
              onClick={() => handleNavigation('invoice-create')}
            />
            <QuickNavButton
              icon={faCog}
              title="Settings"
              description="Configure app preferences"
              onClick={() => handleNavigation('settings')}
            />
            <QuickNavButton
              icon={faTools}
              title="Quote Tools"
              description="Access quoting tools and customer search"
              onClick={() => handleNavigation('quote-tools')}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Technical Dashboard Information */}
      <Grid container spacing={3}>
        {/* System Status */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>System Status</Typography>
              <Typography variant="body2">{systemStatus}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Usage Stats */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Usage Stats</Typography>
              <Typography variant="body2">Active Users: {usageStats.users}</Typography>
              <Typography variant="body2">Jobs/Events: {usageStats.jobs}</Typography>
              <Typography variant="body2">Invoices: {usageStats.invoices}</Typography>
              <Typography variant="body2">Revenue: ${usageStats.revenue.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Recent Activity */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Recent Activity</Typography>
              {recentActivity.length === 0 ? (
                <Typography variant="body2" color="text.secondary">Loading...</Typography>
              ) : (
                recentActivity.map((act, idx) => (
                  <Typography key={idx} variant="body2">
                    <b>{act.type}:</b> {act.desc} <span style={{ color: '#888', fontSize: '0.9em' }}>({act.time})</span>
                  </Typography>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
        {/* Environment Info */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Environment</Typography>
              <Typography variant="body2">App Version: {envInfo.version}</Typography>
              <Typography variant="body2">Build: {envInfo.build}</Typography>
              <Typography variant="body2">Node: {envInfo.node}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Updates Section */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Updates</Typography>
          <Typography variant="body2">{updateText}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Dashboard;
