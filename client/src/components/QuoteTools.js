import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`quote-tabpanel-${index}`}
      aria-labelledby={`quote-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function NestedTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nested-tabpanel-${index}`}
      aria-labelledby={`nested-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const steps = ['Customer Info', 'Services', 'Pricing', 'Summary'];

export default function QuoteTools() {
  // Top-level tabs
  const [tab, setTab] = useState(0);
  // Nested tabs for Detailed Quote
  const [nestedTab, setNestedTab] = useState(0);
  // Stepper for Detailed Quote
  const [activeStep, setActiveStep] = useState(0);

  // Notification state
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  // Form states (simplified for demo)
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [services, setServices] = useState([{ name: '', qty: 1, price: '' }]);
  const [pricing, setPricing] = useState({ discount: '', tax: '', total: '' });

  // Quote history (sample data)
  const [history] = useState([
    { id: 1, customer: 'John Doe', date: '2025-05-01', total: '$1200', status: 'Sent' },
    { id: 2, customer: 'Jane Smith', date: '2025-04-15', total: '$1800', status: 'Accepted' }
  ]);

  // Handlers
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleNestedTabChange = (event, newValue) => {
    setNestedTab(newValue);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const handleCustomerChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (idx, e) => {
    const updated = [...services];
    updated[idx][e.target.name] = e.target.value;
    setServices(updated);
  };

  const addService = () => {
    setServices([...services, { name: '', qty: 1, price: '' }]);
  };

  const removeService = (idx) => {
    setServices(services.filter((_, i) => i !== idx));
  };

  const handlePricingChange = (e) => {
    setPricing({ ...pricing, [e.target.name]: e.target.value });
  };

  const handleQuickQuote = (e) => {
    e.preventDefault();
    setNotification({
      open: true,
      message: 'Quick quote generated (demo).',
      severity: 'success'
    });
  };

  const handleDetailedQuote = (e) => {
    e.preventDefault();
    setNotification({
      open: true,
      message: 'Detailed quote saved (demo).',
      severity: 'success'
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ maxWidth: 1300, mx: 'auto', mt: 2 }}>
      <Paper elevation={2} sx={{ mb: 2 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Quote Tools Tabs"
        >
          <Tab label="Quick Quote" />
          <Tab label="Detailed Quote" />
          <Tab label="Quote History" />
          <Tab label="Settings" />
        </Tabs>
      </Paper>

      {/* Quick Quote Tab */}
      <TabPanel value={tab} index={0}>
        <Card>
          <CardContent>
            <form onSubmit={handleQuickQuote}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Customer Name"
                    name="name"
                    value={customer.name}
                    onChange={handleCustomerChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    value={customer.email}
                    onChange={handleCustomerChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    name="phone"
                    value={customer.phone}
                    onChange={handleCustomerChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Service"
                    name="service"
                    value={services[0].name}
                    onChange={e => handleServiceChange(0, e)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price"
                    name="price"
                    value={services[0].price}
                    onChange={e => handleServiceChange(0, e)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Generate Quote
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Detailed Quote Tab */}
      <TabPanel value={tab} index={1}>
        <Paper elevation={1} sx={{ mb: 2 }}>
          <Tabs
            value={nestedTab}
            onChange={handleNestedTabChange}
            indicatorColor="secondary"
            textColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Detailed Quote Tabs"
          >
            <Tab label="Stepper" />
            <Tab label="Accordion" />
          </Tabs>
        </Paper>
        {/* Stepper-based UI */}
        <NestedTabPanel value={nestedTab} index={0}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
            {steps.map((label, idx) => (
              <Step key={label} onClick={() => handleStepChange(idx)}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === 0 && (
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Customer Name"
                      name="name"
                      value={customer.name}
                      onChange={handleCustomerChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email"
                      name="email"
                      value={customer.email}
                      onChange={handleCustomerChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone"
                      name="phone"
                      value={customer.phone}
                      onChange={handleCustomerChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
          {activeStep === 1 && (
            <Card>
              <CardContent>
                <List>
                  {services.map((svc, idx) => (
                    <ListItem key={idx} alignItems="flex-start" sx={{ mb: 1 }}>
                      <Grid container spacing={1}>
                        <Grid item xs={5}>
                          <TextField
                            label="Service Name"
                            name="name"
                            value={svc.name}
                            onChange={e => handleServiceChange(idx, e)}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            label="Qty"
                            name="qty"
                            type="number"
                            value={svc.qty}
                            onChange={e => handleServiceChange(idx, e)}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            label="Price"
                            name="price"
                            value={svc.price}
                            onChange={e => handleServiceChange(idx, e)}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Button
                            color="error"
                            onClick={() => removeService(idx)}
                            disabled={services.length === 1}
                          >
                            Remove
                          </Button>
                        </Grid>
                      </Grid>
                    </ListItem>
                  ))}
                </List>
                <Button variant="outlined" onClick={addService}>
                  Add Service
                </Button>
              </CardContent>
            </Card>
          )}
          {activeStep === 2 && (
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Discount"
                      name="discount"
                      value={pricing.discount}
                      onChange={handlePricingChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Tax"
                      name="tax"
                      value={pricing.tax}
                      onChange={handlePricingChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Total"
                      name="total"
                      value={pricing.total}
                      onChange={handlePricingChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
          {activeStep === 3 && (
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Review your quote before saving.
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2"><b>Customer:</b> {customer.name}</Typography>
                <Typography variant="body2"><b>Email:</b> {customer.email}</Typography>
                <Typography variant="body2"><b>Phone:</b> {customer.phone}</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2"><b>Services:</b></Typography>
                <List>
                  {services.map((svc, idx) => (
                    <ListItem key={idx}>
                      <ListItemText
                        primary={`${svc.name} (x${svc.qty})`}
                        secondary={`$${svc.price}`}
                      />
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2"><b>Discount:</b> {pricing.discount}</Typography>
                <Typography variant="body2"><b>Tax:</b> {pricing.tax}</Typography>
                <Typography variant="body2"><b>Total:</b> {pricing.total}</Typography>
                <Box mt={2}>
                  <Button variant="contained" color="primary" onClick={handleDetailedQuote}>
                    Save Quote
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
            >
              Back
            </Button>
            <Button
              disabled={activeStep === steps.length - 1}
              onClick={() => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))}
            >
              Next
            </Button>
          </Box>
        </NestedTabPanel>
        {/* Accordion-based UI */}
        <NestedTabPanel value={nestedTab} index={1}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Customer Info</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Customer Name"
                    name="name"
                    value={customer.name}
                    onChange={handleCustomerChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    value={customer.email}
                    onChange={handleCustomerChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    name="phone"
                    value={customer.phone}
                    onChange={handleCustomerChange}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Services</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {services.map((svc, idx) => (
                  <ListItem key={idx} alignItems="flex-start" sx={{ mb: 1 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={5}>
                        <TextField
                          label="Service Name"
                          name="name"
                          value={svc.name}
                          onChange={e => handleServiceChange(idx, e)}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <TextField
                          label="Qty"
                          name="qty"
                          type="number"
                          value={svc.qty}
                          onChange={e => handleServiceChange(idx, e)}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          label="Price"
                          name="price"
                          value={svc.price}
                          onChange={e => handleServiceChange(idx, e)}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          color="error"
                          onClick={() => removeService(idx)}
                          disabled={services.length === 1}
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  </ListItem>
                ))}
              </List>
              <Button variant="outlined" onClick={addService}>
                Add Service
              </Button>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Pricing</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Discount"
                    name="discount"
                    value={pricing.discount}
                    onChange={handlePricingChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Tax"
                    name="tax"
                    value={pricing.tax}
                    onChange={handlePricingChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Total"
                    name="total"
                    value={pricing.total}
                    onChange={handlePricingChange}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Summary</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle1" gutterBottom>
                Review your quote before saving.
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2"><b>Customer:</b> {customer.name}</Typography>
              <Typography variant="body2"><b>Email:</b> {customer.email}</Typography>
              <Typography variant="body2"><b>Phone:</b> {customer.phone}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2"><b>Services:</b></Typography>
              <List>
                {services.map((svc, idx) => (
                  <ListItem key={idx}>
                    <ListItemText
                      primary={`${svc.name} (x${svc.qty})`}
                      secondary={`$${svc.price}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2"><b>Discount:</b> {pricing.discount}</Typography>
              <Typography variant="body2"><b>Tax:</b> {pricing.tax}</Typography>
              <Typography variant="body2"><b>Total:</b> {pricing.total}</Typography>
              <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleDetailedQuote}>
                  Save Quote
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        </NestedTabPanel>
      </TabPanel>

      {/* Quote History Tab */}
      <TabPanel value={tab} index={2}>
        <Card>
          <CardContent>
            <List>
              {history.map((q) => (
                <ListItem key={q.id} divider>
                  <ListItemText
                    primary={`${q.customer} - ${q.date}`}
                    secondary={`Total: ${q.total} | Status: ${q.status}`}
                  />
                  <Button variant="outlined" size="small" sx={{ ml: 2 }}>
                    View
                  </Button>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Settings Tab */}
      <TabPanel value={tab} index={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Settings and preferences for quote tools will go here.
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Notification Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
