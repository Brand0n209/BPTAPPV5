import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function ManageSubs() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/submissions');
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load submissions. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleDeleteClick = (submission) => {
    setSelectedSubmission(submission);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSubmission) return;

    try {
      const response = await fetch(`/api/submissions/${selectedSubmission.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete submission');
      }

      setSubmissions(submissions.filter(sub => sub.id !== selectedSubmission.id));
      setSnackbar({
        open: true,
        message: 'Submission deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting submission:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete submission. Please try again.',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedSubmission(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedSubmission(null);
  };

  const handleScheduleClick = (submission) => {
    // Navigate to scheduler with submission data
    console.log('Schedule for submission:', submission);
  };

  const handleEmailClick = (submission) => {
    // Send email to customer
    console.log('Email to customer:', submission);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Filter submissions based on search term
  const filteredSubmissions = submissions.filter(submission => {
    const searchString = searchTerm.toLowerCase();
    const fullName = `${submission.firstName} ${submission.lastName}`.toLowerCase();
    return fullName.includes(searchString) || 
           submission.email?.toLowerCase().includes(searchString) ||
           submission.phone?.includes(searchString) ||
           submission.service?.toLowerCase().includes(searchString);
  });

  // Paginate submissions
  const paginatedSubmissions = filteredSubmissions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
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
        Manage Submissions
      </Typography>
      
      <Box mb={3}>
        <TextField
          fullWidth
          label="Search Submissions"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name, email, phone, or service"
          sx={{ mb: 2 }}
        />
      </Box>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="submissions table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSubmissions.length > 0 ? (
              paginatedSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    {submission.firstName} {submission.lastName}
                  </TableCell>
                  <TableCell>
                    <div>{submission.email}</div>
                    <div>{submission.phone}</div>
                  </TableCell>
                  <TableCell>{submission.service}</TableCell>
                  <TableCell>
                    {submission.installationDate ? new Date(submission.installationDate).toLocaleDateString() : 'Not set'}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      aria-label="edit submission"
                      onClick={() => console.log('Edit:', submission.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      aria-label="delete submission"
                      onClick={() => handleDeleteClick(submission)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      color="info"
                      aria-label="email customer"
                      onClick={() => handleEmailClick(submission)}
                    >
                      <EmailIcon />
                    </IconButton>
                    <IconButton
                      color="success"
                      aria-label="schedule appointment"
                      onClick={() => handleScheduleClick(submission)}
                    >
                      <CalendarMonthIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No submissions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredSubmissions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the submission for {selectedSubmission ? `${selectedSubmission.firstName} ${selectedSubmission.lastName}` : ''}? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
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

export default ManageSubs;
