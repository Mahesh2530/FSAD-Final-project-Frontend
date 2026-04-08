import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Chip, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  useTheme,
  Collapse,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  Grid,
  Badge,
  useMediaQuery
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Visibility as ViewIcon,
  Check as ApprovedIcon,
  Close as RejectedIcon,
  Replay as PendingIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const MyRequests = ({ requests = [], onCancel, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for confirmation dialog
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsExpanded, setDetailsExpanded] = useState({});
  
  // State for filtering
  const [tabValue, setTabValue] = useState('all');
  
  // State for notifications
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  // Handle request cancellation
  const handleOpenCancel = (request) => {
    setSelectedRequest(request);
    setConfirmCancel(true);
  };
  
  const handleCloseCancel = () => {
    setConfirmCancel(false);
  };
  
  const handleCancelRequest = async () => {
    if (!selectedRequest) return;
    
    try {
      const result = await onCancel(selectedRequest.request_id);
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Failed to cancel request. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while cancelling the request.');
    } finally {
      handleCloseCancel();
    }
  };
  
  // Toggle expanded details for a request
  const toggleDetails = (requestId) => {
    setDetailsExpanded({
      ...detailsExpanded,
      [requestId]: !detailsExpanded[requestId]
    });
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSuccess(false);
    setError(null);
  };
  
  // Filter requests based on tab value
  const filteredRequests = tabValue === 'all' 
    ? requests 
    : requests.filter(request => request.status === tabValue);
  
  // Count requests by status
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;
  
  return (
    <Box>
      {/* Success alert */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          elevation={6} 
          variant="filled" 
          onClose={handleSnackbarClose} 
          severity="success"
          sx={{ width: '100%' }}
        >
          Request cancelled successfully!
        </Alert>
      </Snackbar>
      
      {/* Error alert */}
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          elevation={6} 
          variant="filled" 
          onClose={handleSnackbarClose} 
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
      
      {/* Status Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            elevation={2} 
            sx={{ borderRadius: 2 }}
          >
            <CardContent sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              px: 3,
              py: 2
            }}>
              <Badge 
                badgeContent={pendingCount} 
                color="primary"
                max={99}
                sx={{ '& .MuiBadge-badge': { fontSize: 14, height: 20, minWidth: 20 } }}
              >
                <PendingIcon 
                  color="primary" 
                  sx={{ 
                    fontSize: 40, 
                    mb: 1,
                    animation: pendingCount > 0 ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { opacity: 1 },
                      '50%': { opacity: 0.6 },
                      '100%': { opacity: 1 }
                    }
                  }} 
                />
              </Badge>
              <Typography variant="h6" align="center">Pending</Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Awaiting donor response
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            elevation={2} 
            sx={{ borderRadius: 2 }}
          >
            <CardContent sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              px: 3,
              py: 2
            }}>
              <Badge 
                badgeContent={approvedCount} 
                color="success"
                max={99}
                sx={{ '& .MuiBadge-badge': { fontSize: 14, height: 20, minWidth: 20 } }}
              >
                <ApprovedIcon 
                  color="success" 
                  sx={{ fontSize: 40, mb: 1 }} 
                />
              </Badge>
              <Typography variant="h6" align="center">Approved</Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Ready for pickup
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            elevation={2} 
            sx={{ borderRadius: 2 }}
          >
            <CardContent sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              px: 3,
              py: 2
            }}>
              <Badge 
                badgeContent={rejectedCount} 
                color="error"
                max={99}
                sx={{ '& .MuiBadge-badge': { fontSize: 14, height: 20, minWidth: 20 } }}
              >
                <RejectedIcon 
                  color="error" 
                  sx={{ fontSize: 40, mb: 1 }} 
                />
              </Badge>
              <Typography variant="h6" align="center">Rejected</Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Not available anymore
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Filter Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          aria-label="request status tabs"
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile}
          allowScrollButtonsMobile
          centered={!isMobile}
        >
          <Tab 
            label="All Requests" 
            value="all" 
            icon={<Badge badgeContent={requests.length} color="primary" max={99} />} 
            iconPosition="end" 
          />
          <Tab 
            label="Pending" 
            value="pending" 
            icon={<Badge badgeContent={pendingCount} color="primary" max={99} />} 
            iconPosition="end" 
          />
          <Tab 
            label="Approved" 
            value="approved" 
            icon={<Badge badgeContent={approvedCount} color="success" max={99} />} 
            iconPosition="end" 
          />
          <Tab 
            label="Rejected" 
            value="rejected" 
            icon={<Badge badgeContent={rejectedCount} color="error" max={99} />} 
            iconPosition="end" 
          />
        </Tabs>
      </Box>
      
      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={50} />
        </Box>
      )}
      
      {/* No requests message */}
      {!loading && filteredRequests.length === 0 && (
        <Box 
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          sx={{ 
            py: 6, 
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No {tabValue !== 'all' ? tabValue : ''} requests found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {tabValue === 'all' 
              ? "You haven't made any donation requests yet." 
              : `You have no ${tabValue} requests.`}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => window.location.href = '#/browse'}
          >
            Browse Available Donations
          </Button>
        </Box>
      )}
      
      {/* Requests Table */}
      {!loading && filteredRequests.length > 0 && (
        <TableContainer 
          component={Paper} 
          elevation={2}
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            animation: 'fadeIn 0.5s',
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 }
            }
          }}
        >
          <Table aria-label="requests table">
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.primary.main }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Donation</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date Requested</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Expiry Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filteredRequests.map((request) => (
                  <React.Fragment key={request.request_id}>
                    <TableRow 
                      component={motion.tr}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      sx={{
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                        cursor: 'pointer'
                      }}
                      onClick={() => toggleDetails(request.request_id)}
                    >
                      <TableCell>
                        <Typography variant="body1">
                          {request.donation?.food_description || 'Food Donation'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {formatDate(request.created_at)}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={request.status.charAt(0).toUpperCase() + request.status.slice(1)} 
                          color={
                            request.status === 'approved' ? 'success' : 
                            request.status === 'rejected' ? 'error' : 
                            'primary'
                          }
                          icon={
                            request.status === 'approved' ? <ApprovedIcon /> : 
                            request.status === 'rejected' ? <RejectedIcon /> : 
                            <PendingIcon />
                          }
                          sx={{ width: 110 }}
                        />
                      </TableCell>
                      <TableCell>
                        {formatDate(request.donation?.expiry_date || new Date())}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton 
                            color="primary" 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDetails(request.request_id);
                            }}
                          >
                            {detailsExpanded[request.request_id] ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                          
                          {request.status === 'pending' && (
                            <IconButton 
                              color="error" 
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenCancel(request);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Details */}
                    <TableRow>
                      <TableCell colSpan={5} sx={{ p: 0, border: 0 }}>
                        <Collapse in={detailsExpanded[request.request_id]} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 3, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                            <Typography variant="h6" gutterBottom>
                              Request Details
                            </Typography>
                            
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2">Donation Information:</Typography>
                                <Typography variant="body2">
                                  <strong>Description:</strong> {request.donation?.food_description || 'N/A'}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Category:</strong> {request.donation?.food_category || 'N/A'}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Quantity:</strong> {request.donation?.quantity_kg || 'N/A'} kg
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Expiry Date:</strong> {formatDate(request.donation?.expiry_date || new Date())}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2">Request Information:</Typography>
                                <Typography variant="body2">
                                  <strong>Request ID:</strong> {request.request_id}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Date Requested:</strong> {formatDate(request.created_at)}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Last Updated:</strong> {formatDate(request.updated_at || request.created_at)}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Status:</strong> {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </Typography>
                              </Grid>
                            </Grid>
                            
                            {request.status === 'approved' && (
                              <Alert severity="success" sx={{ mt: 2 }}>
                                <Typography variant="subtitle2">
                                  Pickup Information
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Pickup Location:</strong> {request.donation?.pickup_location || 'Contact donor for details'}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Available for pickup:</strong> {formatDate(request.donation?.pickup_window_start || new Date())} to {formatDate(request.donation?.pickup_window_end || new Date())}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Notes:</strong> {request.donation?.notes || 'No additional notes provided'}
                                </Typography>
                              </Alert>
                            )}
                            
                            {request.status === 'rejected' && (
                              <Alert severity="info" sx={{ mt: 2 }}>
                                This donation request was rejected by the donor. This could be because the item is no longer available or has been assigned to another recipient.
                              </Alert>
                            )}
                            
                            {request.status === 'pending' && (
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  startIcon={<DeleteIcon />}
                                  onClick={() => handleOpenCancel(request)}
                                >
                                  Cancel Request
                                </Button>
                              </Box>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={confirmCancel}
        onClose={handleCloseCancel}
        aria-labelledby="cancel-dialog-title"
      >
        <DialogTitle id="cancel-dialog-title">Cancel Donation Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this donation request? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancel} color="primary">
            No, Keep Request
          </Button>
          <Button onClick={handleCancelRequest} color="error" variant="contained">
            Yes, Cancel Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyRequests;
