import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import CalculateIcon from '@mui/icons-material/Calculate';

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    submissions: 0,
    scheduledEvents: 0,
    pendingEvents: 0,
    completedEvents: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats from API
        const statsResponse = await fetch('/api/dashboard/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
        
        // Fetch recent submissions
        const submissionsResponse = await fetch('/api/submissions?limit=3');
        if (submissionsResponse.ok) {
          const submissionsData = await submissionsResponse.json();
          setRecentSubmissions(submissionsData);
        }
        
        // Fetch upcoming events
        const eventsResponse = await fetch('/api/calendar/events?upcoming=true&limit=3');
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setUpcomingEvents(eventsData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: color }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography variant="h6" component="div" ml={1}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" component="div">
          {value}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions>
        <Button size="small" onClick={onClick}>View Details</Button>
      </CardActions>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Submissions" 
            value={stats.submissions} 
            icon={<PeopleIcon />} 
            color="#f3f9ff"
            onClick={() => navigate('/manage-subs')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Scheduled Events" 
            value={stats.scheduledEvents} 
            icon={<EventIcon />}
            color="#f5fff3"
            onClick={() => navigate('/scheduler-manage')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Pending Events" 
            value={stats.pendingEvents} 
            icon={<EventIcon />}
            color="#fffaf3"
            onClick={() => navigate('/scheduler-ongoing')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Completed Events" 
            value={stats.completedEvents} 
            icon={<EventIcon />}
            color="#fff3f3"
            onClick={() => navigate('/scheduler-manage')}
          />
        </Grid>
      </Grid>
      
      {/* Quick Actions */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => navigate('/add-sub')}
            >
              New Submission
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              startIcon={<EventIcon />}
              onClick={() => navigate('/scheduler-create')}
            >
              Schedule Event
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              startIcon={<CalculateIcon />}
              onClick={() => navigate('/quote-tools')}
            >
              Quote Tool
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Recent Submissions and Upcoming Events */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Recent Submissions
            </Typography>
            <List>
              {recentSubmissions.map((submission) => (
                <React.Fragment key={submission.id}>
                  <ListItem>
                    <ListItemText 
                      primary={submission.name} 
                      secondary={`${submission.date} - ${submission.service}`} 
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                size="small" 
                onClick={() => navigate('/manage-subs')}
              >
                View All
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Upcoming Events
            </Typography>
            <List>
              {upcomingEvents.map((event) => (
                <React.Fragment key={event.id}>
                  <ListItem>
                    <ListItemText 
                      primary={event.title} 
                      secondary={`${event.date} - ${event.client}`} 
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                size="small" 
                onClick={() => navigate('/scheduler-manage')}
              >
                View All
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
