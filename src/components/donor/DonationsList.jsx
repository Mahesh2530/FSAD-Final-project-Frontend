import { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Grid, 
  Chip, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  useTheme, 
  useMediaQuery,
  Divider,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  LocalShipping as LocalShippingIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';

// Donation status colors
const statusColors = {
  available: 'primary',
  claimed: 'secondary',
  completed: 'success',
  expired: 'error'
};

// Donation status labels
const statusLabels = {
  available: 'Available',
  claimed: 'Claimed',
  completed: 'Completed',
  expired: 'Expired'
};

const DonationsList = ({ donations, onUpdate, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [error, setError] = useState(null);
  
  // Open delete confirmation dialog
  const handleOpenDelete = (donation) => {
    setSelectedDonation(donation);
    setConfirmDelete(true);
  };
  
  // Close delete confirmation dialog
  const handleCloseDelete = () => {
    setConfirmDelete(false);
    setSelectedDonation(null);
  };
  
  // Handle donation deletion
  const handleDelete = async () => {
    if (!selectedDonation) return;
    
    try {
      const result = await onDelete(selectedDonation.donation_id);
      
      if (!result.success) {
        setError(result.error || 'Failed to delete donation. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while deleting the donation.');
    } finally {
      handleCloseDelete();
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  // If no donations to display
  if (!donations || donations.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No donations found.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create a new donation to get started.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {donations.map((donation) => (
          <Grid item xs={12} key={donation.donation_id}>
            <Card 
              component={motion.div}
              whileHover={{ 
                scale: 1.01,
                boxShadow: '0 8px 15px rgba(0,0,0,0.1)' 
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                overflow: 'hidden',
                borderRadius: 3,
                position: 'relative'
              }}
            >
              {/* Status indicator */}
              <Chip
                label={statusLabels[donation.status]}
                color={statusColors[donation.status]}
                size="small"
                sx={{ 
                  position: 'absolute', 
                  top: 12, 
                  right: 12, 
                  zIndex: 1,
                  fontWeight: 'bold',
                }}
              />
              
              {/* Food image */}
              <CardMedia
                component="img"
                sx={{ 
                  width: isMobile ? '100%' : 200, 
                  height: isMobile ? 140 : 200,
                  objectFit: 'cover'
                }}
                image={donation.image_url || 'https://images.unsplash.com/photo-1506484381205-f7945653044d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D'}
                alt={donation.food_name}
              />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {/* Donation details */}
                <CardContent sx={{ flex: '1 0 auto', pb: 2 }}>
                  <Typography variant="h6" component="div">
                    {donation.food_name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <LocalShippingIcon fontSize="small" color="primary" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {`${donation.quantity} ${donation.quantity_unit} of ${donation.food_type}`}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TimeIcon fontSize="small" color="primary" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      Expires on {formatDate(donation.expiry_date)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {donation.pickup_address}
                  </Typography>
                </CardContent>
                
                <Divider />
                
                {/* Action buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  px: 2,
                  py: 1
                }}>
                  <Typography variant="caption" color="text.secondary">
                    Created: {formatDate(donation.created_at)}
                  </Typography>
                  
                  <Box>
                    {donation.status === 'available' && (
                      <>
                        <IconButton 
                          size="small" 
                          color="primary"
                          aria-label="edit donation"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        
                        <IconButton 
                          size="small" 
                          color="error"
                          aria-label="delete donation"
                          onClick={() => handleOpenDelete(donation)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                    
                    {donation.status === 'claimed' && (
                      <Chip
                        icon={<InfoIcon />}
                        label="Claimed by beneficiary"
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    )}
                    
                    {donation.status === 'completed' && (
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Donation completed"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete}
        onClose={handleCloseDelete}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the donation "{selectedDonation?.food_name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DonationsList;
