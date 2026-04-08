import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  FormHelperText, 
  CircularProgress, 
  Alert,
  Link,
  Slide,
  Fade,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../config/apiConfig';

// Styled components
const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  maxWidth: 700,
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4),
    width: '100%',
    borderRadius: theme.shape.borderRadius,
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    transition: 'all 0.3s',
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
  }
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.shape.borderRadius * 5,
  fontSize: '1.1rem',
  fontWeight: 600,
  transition: 'all 0.3s',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&:hover': {
    transform: 'scale(1.05)',
  }
}));

const LoginLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  transition: 'all 0.3s',
  '&:hover': {
    textDecoration: 'underline',
  }
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  fontWeight: 700,
  textAlign: 'center',
  color: theme.palette.text.primary,
}));

// Form validation
const validateForm = (formData) => {
  const errors = {};
  
  if (!formData.username?.trim()) {
    errors.username = 'Username is required';
  }
  
  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
    errors.email = 'Invalid email address';
  }
  
  if (!formData.password_hash?.trim()) {
    errors.password_hash = 'Password is required';
  } else if (formData.password_hash.length < 8) {
    errors.password_hash = 'Password must be at least 8 characters';
  }
  
  if (!formData.role) {
    errors.role = 'Role selection is required';
  }
  
  return errors;
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password_hash: '',
    role: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    latitude: '',
    longitude: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Get geolocation if available
  useEffect(() => {
    setShowForm(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => console.log("Geolocation error:", error),
        { enableHighAccuracy: true }
      );
    }
  }, []);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setServerError('');
    
    try {
      // Handle the API call
      const response = await axios.post(`${API_BASE_URL}/users/register`, formData);
      // After registration, store user data using authUtils
      const userData = {
        user_id: response.data.user_id,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role,
        token: response.data.token
      };
      
      // Import auth service to store user data properly
      const { authService } = await import('../utils/authUtils');
      localStorage.setItem('user', JSON.stringify(userData));
      if (userData.token) {
        localStorage.setItem('authToken', userData.token);
      }
      
      // Set success and redirect based on user role
      setSuccess(true);
      setTimeout(() => {
        const role = userData.role?.toLowerCase();
        if (role === 'donor') {
          navigate('/donor');
        } else if (role === 'beneficiary') {
          navigate('/beneficiary');
        } else if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/'); // Fallback to home if role is unknown
        }
      }, 2000);
      
    } catch (error) {
      // Handle error response
      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError('Registration failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delay: 0.3, 
        duration: 0.5 
      }
    }
  };
  
  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: 0.2 + (custom * 0.1),
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      
      <Box component="main" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          pt: { xs: 12, sm: 14 },
          pb: 6
        }}
      >
        <Container maxWidth="lg">
          {/* Error Alert */}
          {serverError && (
            <Slide direction="down" in={Boolean(serverError)} mountOnEnter unmountOnExit>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 4, 
                  width: { xs: '100%', sm: '700px' }, 
                  mx: 'auto',
                  animation: 'shake 0.5s',
                  '@keyframes shake': {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
                    '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' }
                  }
                }}
                onClose={() => setServerError('')}
              >
                {serverError}
              </Alert>
            </Slide>
          )}
          
          {/* Success Alert */}
          {success && (
            <Slide direction="down" in={success} mountOnEnter unmountOnExit>
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 4, 
                  width: { xs: '100%', sm: '700px' }, 
                  mx: 'auto' 
                }}
              >
                Registration successful! Redirecting to your dashboard...
              </Alert>
            </Slide>
          )}
          
          <Fade in={showForm} timeout={500}>
            <Box component={motion.div}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <FormContainer>
                <FormTitle variant="h4" component="h1">
                  Create Your FoodShare Account
                </FormTitle>
                
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Grid container spacing={isMobile ? 2 : 3}>
                    {/* Username */}
                    <Grid size={12} component={motion.div} custom={0} variants={formItemVariants}>
                      <StyledTextField
                        name="username"
                        label="Username"
                        fullWidth
                        value={formData.username}
                        onChange={handleChange}
                        error={Boolean(errors.username)}
                        helperText={errors.username}
                        required
                      />
                    </Grid>
                    
                    {/* Email */}
                    <Grid size={12} component={motion.div} custom={1} variants={formItemVariants}>
                      <StyledTextField
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={formData.email}
                        onChange={handleChange}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        required
                      />
                    </Grid>
                    
                    {/* Password */}
                    <Grid size={12} component={motion.div} custom={2} variants={formItemVariants}>
                      <StyledTextField
                        name="password_hash"
                        label="Password"
                        type="password"
                        fullWidth
                        value={formData.password_hash}
                        onChange={handleChange}
                        error={Boolean(errors.password_hash)}
                        helperText={errors.password_hash || "Minimum 8 characters"}
                        required
                      />
                    </Grid>
                    
                    {/* Role Selection */}
                    <Grid size={12} component={motion.div} custom={3} variants={formItemVariants}>
                      <FormControl fullWidth error={Boolean(errors.role)}>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                          labelId="role-label"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          label="Role"
                          sx={{
                            transition: 'all 0.3s',
                            '&.Mui-focused': {
                              boxShadow: theme => `0 0 0 2px ${theme.palette.primary.main}20`,
                            },
                          }}
                          required
                        >
                          <MenuItem value="donor">Donor</MenuItem>
                          <MenuItem value="beneficiary">Beneficiary</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                        {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    
                    {/* Phone */}
                    <Grid size={{ xs: 12, sm: 6 }} component={motion.div} custom={4} variants={formItemVariants}>
                      <StyledTextField
                        name="phone"
                        label="Phone"
                        fullWidth
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </Grid>
                    
                    {/* Address */}
                    <Grid size={12} component={motion.div} custom={5} variants={formItemVariants}>
                      <StyledTextField
                        name="address"
                        label="Address"
                        fullWidth
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </Grid>
                    
                    {/* City */}
                    <Grid size={{ xs: 12, sm: 6 }} component={motion.div} custom={6} variants={formItemVariants}>
                      <StyledTextField
                        name="city"
                        label="City"
                        fullWidth
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </Grid>
                    
                    {/* State */}
                    <Grid size={{ xs: 12, sm: 6 }} component={motion.div} custom={7} variants={formItemVariants}>
                      <StyledTextField
                        name="state"
                        label="State/Province"
                        fullWidth
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </Grid>
                    
                    {/* Postal Code */}
                    <Grid size={{ xs: 12, sm: 6 }} component={motion.div} custom={8} variants={formItemVariants}>
                      <StyledTextField
                        name="postal_code"
                        label="Postal Code"
                        fullWidth
                        value={formData.postal_code}
                        onChange={handleChange}
                      />
                    </Grid>
                    
                    {/* Country */}
                    <Grid size={{ xs: 12, sm: 6 }} component={motion.div} custom={9} variants={formItemVariants}>
                      <StyledTextField
                        name="country"
                        label="Country"
                        fullWidth
                        value={formData.country}
                        onChange={handleChange}
                      />
                    </Grid>
                    
                    {/* Geolocation */}
                    <Grid size={12} component={motion.div} custom={10} variants={formItemVariants}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                        {formData.latitude && formData.longitude 
                          ? "Location detected successfully." 
                          : "We'll auto-detect your location if enabled."}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={6}>
                          <StyledTextField
                            name="latitude"
                            label="Latitude"
                            fullWidth
                            type="number"
                            value={formData.latitude}
                            onChange={handleChange}
                            InputProps={{
                              inputProps: { step: 'any' }
                            }}
                          />
                        </Grid>
                        <Grid size={6}>
                          <StyledTextField
                            name="longitude"
                            label="Longitude"
                            fullWidth
                            type="number"
                            value={formData.longitude}
                            onChange={handleChange}
                            InputProps={{
                              inputProps: { step: 'any' }
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    
                    {/* Submit Button */}
                    <Grid size={12} component={motion.div} custom={11} variants={formItemVariants}>
                      <Box textAlign="center">
                        <SubmitButton
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={loading}
                        >
                          {loading ? <CircularProgress size={24} /> : "Register"}
                        </SubmitButton>
                      </Box>
                    </Grid>
                    
                    {/* Login Link */}
                    <Grid size={12} component={motion.div} custom={12} variants={formItemVariants}>
                      <Box textAlign="center">
                        <Typography variant="body2">
                          Already have an account? <LoginLink href="/login">Login</LoginLink>
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </FormContainer>
            </Box>
          </Fade>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default RegisterPage;
