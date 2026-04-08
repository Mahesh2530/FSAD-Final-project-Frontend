import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Grid, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  FormHelperText, 
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  InputAdornment
} from '@mui/material';
import { 
  CalendarMonth as CalendarIcon, 
  Room as RoomIcon,
  PhotoCamera as PhotoIcon 
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';

const DonationForm = ({ onSubmit }) => {
  // Form state
  const [formData, setFormData] = useState({
    food_name: '',
    quantity: '',
    quantity_unit: 'kg',
    food_type: '',
    expiry_date: null,
    pickup_address: '',
    image_url: ''
  });
  
  // Other state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // Fetch food categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories/food`);
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching food categories:', err);
        // Fallback to default categories if API fails
        setCategories([
          { value: 'fruits_vegetables', label: 'Fruits & Vegetables' },
          { value: 'grains_cereals', label: 'Grains & Cereals' },
          { value: 'dairy', label: 'Dairy Products' },
          { value: 'bakery', label: 'Bakery Items' },
          { value: 'cooked_meals', label: 'Cooked Meals' },
          { value: 'canned_food', label: 'Canned Food' },
          { value: 'beverages', label: 'Beverages' },
          { value: 'other', label: 'Other' }
        ]);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle date change
  const handleDateChange = (newDate) => {
    setFormData({
      ...formData,
      expiry_date: newDate
    });
    
    // Clear error for this field
    if (errors.expiry_date) {
      setErrors({
        ...errors,
        expiry_date: ''
      });
    }
  };
  
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = {};
    if (!formData.food_name.trim()) validationErrors.food_name = 'Food name is required';
    if (!formData.quantity) validationErrors.quantity = 'Quantity is required';
    if (!formData.food_type) validationErrors.food_type = 'Food type is required';
    if (!formData.expiry_date) validationErrors.expiry_date = 'Expiry date is required';
    if (!formData.pickup_address.trim()) validationErrors.pickup_address = 'Pickup address is required';
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      // Format the data
      const formattedData = {
        ...formData,
        expiry_date: formData.expiry_date ? format(formData.expiry_date, "yyyy-MM-dd'T'HH:mm:ss'Z'") : null
      };
      
      // Submit the form
      const result = await onSubmit(formattedData);
      
      if (result.success) {
        // Reset form on success
        setFormData({
          food_name: '',
          quantity: '',
          quantity_unit: 'kg',
          food_type: '',
          expiry_date: null,
          pickup_address: '',
          image_url: ''
        });
        
        setSuccess(true);
      } else {
        setErrors({ submit: result.error || 'Failed to submit donation. Please try again.' });
      }
    } catch (err) {
      setErrors({ submit: err.message || 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSuccess(false);
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={3}>
        {/* Main form error */}
        {errors.submit && (
          <Grid size={12}>
            <Alert severity="error">{errors.submit}</Alert>
          </Grid>
        )}
        
        {/* Success message */}
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            Donation created successfully!
          </Alert>
        </Snackbar>
        
        {/* Food Name */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="food_name"
            label="Food Name"
            value={formData.food_name}
            onChange={handleChange}
            fullWidth
            required
            error={Boolean(errors.food_name)}
            helperText={errors.food_name}
            placeholder="E.g., Fresh Vegetables Assortment"
          />
        </Grid>
        
        {/* Food Type */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth required error={Boolean(errors.food_type)}>
            <InputLabel>Food Type</InputLabel>
            <Select
              name="food_type"
              value={formData.food_type}
              onChange={handleChange}
              label="Food Type"
            >
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
            {errors.food_type && <FormHelperText>{errors.food_type}</FormHelperText>}
          </FormControl>
        </Grid>
        
        {/* Quantity */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="quantity"
            label="Quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            fullWidth
            required
            error={Boolean(errors.quantity)}
            helperText={errors.quantity}
            inputProps={{ min: 0, step: 0.1 }}
          />
        </Grid>
        
        {/* Quantity Unit */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Unit</InputLabel>
            <Select
              name="quantity_unit"
              value={formData.quantity_unit}
              onChange={handleChange}
              label="Unit"
            >
              <MenuItem value="kg">Kilograms (kg)</MenuItem>
              <MenuItem value="items">Items</MenuItem>
              <MenuItem value="cartons">Cartons</MenuItem>
              <MenuItem value="packages">Packages</MenuItem>
              <MenuItem value="liters">Liters</MenuItem>
              <MenuItem value="cans">Cans</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        {/* Expiry Date */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Expiry Date"
              value={formData.expiry_date}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: Boolean(errors.expiry_date),
                  helperText: errors.expiry_date
                }
              }}
            />
          </LocalizationProvider>
        </Grid>
        
        {/* Image URL */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="image_url"
            label="Image URL (Optional)"
            value={formData.image_url}
            onChange={handleChange}
            fullWidth
            placeholder="https://example.com/image.jpg"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <PhotoIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        {/* Pickup Address */}
        <Grid size={12}>
          <TextField
            name="pickup_address"
            label="Pickup Address"
            value={formData.pickup_address}
            onChange={handleChange}
            fullWidth
            required
            error={Boolean(errors.pickup_address)}
            helperText={errors.pickup_address}
            placeholder="Enter full address for pickup"
            multiline
            rows={2}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RoomIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        {/* Submit Button */}
        <Grid size={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{ 
                px: 4, 
                py: 1.5,
                borderRadius: 50,
                fontSize: '1.1rem'
              }}
            >
              {loading ? 'Creating...' : 'Create Donation'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DonationForm;
