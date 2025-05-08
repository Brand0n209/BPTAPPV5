import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardActions,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CalculateIcon from '@mui/icons-material/Calculate';
import SaveIcon from '@mui/icons-material/Save';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EmailIcon from '@mui/icons-material/Email';

function QuoteTools() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [quoteItems, setQuoteItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [quoteDetails, setQuoteDetails] = useState({
    jobType: '',
    description: '',
    discount: 0,
    notes: '',
    validUntil: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Available services/products for the quote
  const availableItems = [
    { id: 1, name: 'Govee Installation - Per Foot', price: 15, unit: 'ft' },
    { id: 2, name: 'LED Strip Installation - Per Foot', price: 20, unit: 'ft' },
    { id: 3, name: 'Permanent Lighting - Per Foot', price: 25, unit: 'ft' },
    { id: 4, name: 'Holiday Lights Installation', price: 350, unit: 'job' },
    { id: 5, name: 'Maintenance Visit', price: 150, unit: 'visit' },
    { id: 6, name: 'Controller Installation', price: 75, unit: 'unit' },
    { id: 7, name: 'Power Supply Installation', price: 100, unit: 'unit' },
    { id: 8, name: 'Govee Light Strip', price: 25, unit: 'unit' },
    { id: 9, name: 'Color Changing LED Strip', price: 35, unit: 'unit' },
    { id: 10, name: 'Mounting Clips (Pack of 20)', price: 15, unit: 'pack' },
  ];

  const jobTypes = [
    'Residential - New Installation',
    'Residential - Upgrade',
    'Residential - Maintenance',
    'Commercial - New Installation',
    'Commercial - Upgrade',
    'Commercial - Maintenance',
    'Holiday Lighting',
    'Special Event'
  ];

  useEffect(() => {
    // Calculate total
    calculateTotal();
  }, [quoteItems, quoteDetails.discount]);

  const handleSearch = async () => {
    if (!searchQuery || searchQuery.trim() === '') return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/quote-tools/customers?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Failed to search customers');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching customers:', error);
      setSnackbar({
        open: true,
        message: 'Failed to search customers. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleAddItem = () => {
    setQuoteItems([
      ...quoteItems,
      {
        id: Date.now(),
        itemId: '',
        name: '',
        price: 0,
        quantity: 1,
        unit: '',
        total: 0
      }
    ]);
  };

  const handleRemoveItem = (id) => {
    setQuoteItems(quoteItems.filter(item => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setQuoteItems(quoteItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // If changing the itemId, update name, price, unit from the selected item
        if (field === 'itemId' && value) {
          const selectedItem = availableItems.find(i => i.id === parseInt(value));
          if (selectedItem) {
            updatedItem.name = selectedItem.name;
            updatedItem.price = selectedItem.price;
            updatedItem.unit = selectedItem.unit;
          }
        }
        
        // Recalculate total for this item
        updatedItem.total = updatedItem.price * updatedItem.quantity;
        
        return updatedItem;
      }
      return item;
    }));
  };

  const handleQuoteDetailChange = (e) => {
    const { name, value } = e.target;
    setQuoteDetails({
      ...quoteDetails,
      [name]: value
    });
  };

  const calculateTotal = () => {
    const subtotal = quoteItems.reduce((sum, item) => sum + item.total, 0);
    const discount = parseFloat(quoteDetails.discount) || 0;
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal - discountAmount;
    
    setTotalAmount(total);
  };

  const handleCreateQuote = async () => {
    setLoading(true);
    try {
      // Prepare quote data
      const quoteData = {
        customerId: selectedCustomer.id,
        jobType: quoteDetails.jobType,
        description: quoteDetails.description,
        items: quoteItems,
        subtotal: quoteItems.reduce((sum, item) => sum + item.total, 0),
        discount: parseFloat(quoteDetails.discount) || 0,
        total: totalAmount,
        notes: quoteDetails.notes,
        validUntil: quoteDetails.validUntil
      };
      
      // Send to API
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create quote');
      }
      
      const result = await response.json();
      
      setSnackbar({
        open: true,
        message: 'Quote created successfully!',
        severity: 'success'
      });
      
      // Reset form or redirect to quote detail
      // For now, just reset form
      resetForm();
      
    } catch (error) {
      console.error('Error creating quote:', error);
      setSnackbar({
        open: true,
        message: 'Failed to create quote. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCustomer(null);
    setQuoteItems([]);
    setQuoteDetails({
      jobType: '',
      description: '',
      discount: 0,
      notes: '',
      validUntil: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]
    });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Quote Tool
      </Typography>
      
      {/* Customer Selection */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Customer Information
        </Typography>
        
        {!selectedCustomer ? (
          <>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <TextField
                fullWidth
                label="Search Customer"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="Enter name, email, or phone"
                sx={{ mr: 1 }}
              />
              <Button 
                variant="contained" 
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Search'}
              </Button>
            </Box>
            
            {searchResults.length > 0 && (
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchResults.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.firstName} {customer.lastName}</TableCell>
                        <TableCell>
                          <div>{customer.email}</div>
                          <div>{customer.phone}</div>
                        </TableCell>
                        <TableCell>{customer.address}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleSelectCustomer(customer)}
                          >
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        ) : (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" component="div">
                {selectedCustomer.firstName} {selectedCustomer.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {selectedCustomer.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone: {selectedCustomer.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Address: {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state} {selectedCustomer.zipCode}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => setSelectedCustomer(null)}>
                Change Customer
              </Button>
            </CardActions>
          </Card>
        )}
      </Paper>
      
      {/* Quote Details */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quote Details
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="job-type-label">Job Type</InputLabel>
              <Select
                labelId="job-type-label"
                name="jobType"
                value={quoteDetails.jobType}
                label="Job Type"
                onChange={handleQuoteDetailChange}
              >
                {jobTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Valid Until"
              name="validUntil"
              type="date"
              value={quoteDetails.validUntil}
              onChange={handleQuoteDetailChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Project Description"
              name="description"
              multiline
              rows={2}
              value={quoteDetails.description}
              onChange={handleQuoteDetailChange}
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Quote Items */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Quote Items
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddItem}
          >
            Add Item
          </Button>
        </Box>
        
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="35%">Item</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Total</TableCell>
                <TableCell width="10%">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quoteItems.length > 0 ? (
                quoteItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={item.itemId}
                          onChange={(e) => handleItemChange(item.id, 'itemId', e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>Select an item</MenuItem>
                          {availableItems.map((availableItem) => (
                            <MenuItem key={availableItem.id} value={availableItem.id}>
                              {availableItem.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        value={item.price}
                        onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </TableCell>
                    <TableCell>
                      {item.unit}
                    </TableCell>
                    <TableCell>
                      ${item.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No items added yet. Click "Add Item" to start building your quote.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              multiline
              rows={4}
              value={quoteDetails.notes}
              onChange={handleQuoteDetailChange}
              placeholder="Add any special notes, terms, or conditions..."
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Quote Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${quoteItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ flexGrow: 1 }}>Discount:</Typography>
                <TextField
                  size="small"
                  name="discount"
                  type="number"
                  value={quoteDetails.discount}
                  onChange={handleQuoteDetailChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  sx={{ width: '80px', mr: 1 }}
                />
                <Typography>
                  ${((quoteItems.reduce((sum, item) => sum + item.total, 0) * quoteDetails.discount) / 100).toFixed(2)}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">${totalAmount.toFixed(2)}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={resetForm}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CalculateIcon />}
          onClick={() => calculateTotal()}
        >
          Recalculate
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<SaveIcon />}
          onClick={handleCreateQuote}
          disabled={loading || !selectedCustomer || quoteItems.length === 0}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Quote'}
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PictureAsPdfIcon />}
          disabled={!selectedCustomer || quoteItems.length === 0}
        >
          Preview PDF
        </Button>
        <Button
          variant="contained"
          color="info"
          startIcon={<EmailIcon />}
          disabled={!selectedCustomer || quoteItems.length === 0}
        >
          Email Quote
        </Button>
      </Box>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default QuoteTools;
