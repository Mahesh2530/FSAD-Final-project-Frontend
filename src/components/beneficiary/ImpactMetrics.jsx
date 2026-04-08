import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CircularProgress,
  Divider,
  useTheme,
  LinearProgress,
  Alert,
  Link,
  Chip
} from '@mui/material';
import { 
  Restaurant as FoodIcon,
  Co2 as CarbonIcon,
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  Bolt as EnergyIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';

const ImpactMetrics = ({ data }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(!data);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  
  const colorPalette = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.info.main,
    theme.palette.warning.main
  ];
  
  // Add a helper function to safely access metrics properties
  const getMetricValue = (key, defaultValue = 0) => {
    if (!metrics || metrics[key] === undefined || metrics[key] === null) {
      return defaultValue;
    }
    return metrics[key];
  };
    useEffect(() => {
    if (data) {
      // Make sure data has all required properties with fallbacks
      const safeData = {
        totalFoodReceived: data.totalFoodReceived || data.total_food_received_kg || 0,
        carbonFootprintReduced: data.carbonFootprintReduced || data.carbon_footprint_saved_kg || 0,
        mealsProvided: data.mealsProvided || data.total_meals_received || 0,
        donationsReceived: data.donationsReceived || data.total_requests || 0,
        avgResponseTime: data.avgResponseTime || 0,
        wasteReduction: data.wasteReduction || data.total_food_received_kg || 0,
        impactOverTime: data.impactOverTime || data.monthly_stats || [],
        categoryBreakdown: data.categoryBreakdown || []
      };
      
      setMetrics(safeData);
      setLoading(false);
    } else {
      // If no data is provided, use mock data for demo purposes
      setTimeout(() => {
        setMetrics({
          totalFoodReceived: 125.5, // kg
          carbonFootprintReduced: 215.4, // kg CO2
          mealsProvided: 580,
          donationsReceived: 18,
          avgResponseTime: 1.2, // days
          wasteReduction: 110.2, // kg
          impactOverTime: [
            { month: 'Jan', foodReceived: 10.2, carbonSaved: 15.3 },
            { month: 'Feb', foodReceived: 15.5, carbonSaved: 21.2 },
            { month: 'Mar', foodReceived: 20.3, carbonSaved: 30.5 },
            { month: 'Apr', foodReceived: 18.7, carbonSaved: 28.1 },
            { month: 'May', foodReceived: 22.1, carbonSaved: 35.2 },
            { month: 'Jun', foodReceived: 38.7, carbonSaved: 85.1 },
          ],
          categoryBreakdown: [
            { name: 'Perishable', value: 45 },
            { name: 'Non-Perishable', value: 30 },
            { name: 'Prepared Food', value: 20 },
            { name: 'Other', value: 5 }
          ]
        });
        setLoading(false);
      }, 1500);
    }
  }, [data]);
  
  // Add this helper function to safely access metrics properties with a default value
  const getMetricsValue = (propertyPath, defaultValue = 0) => {
    if (!metrics) return defaultValue;
    
    const parts = propertyPath.split('.');
    let value = metrics;
    
    for (const part of parts) {
      if (value === null || value === undefined) return defaultValue;
      value = value[part];
    }
    
    return value !== null && value !== undefined ? value : defaultValue;
  };
  
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: 400 
      }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6" color="text.secondary">
          Loading impact data...
        </Typography>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load impact metrics: {error}
      </Alert>
    );
  }
    return (
    <Box>
      {/* Introduction */}
      <Paper 
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={2} 
        sx={{ p: 3, mb: 4, borderRadius: 2 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h5" gutterBottom>
            Your FoodShare Impact
          </Typography>
          
          {data?.isBackupData && (
            <Alert severity="info" sx={{ py: 0 }}>
              Using estimated data
            </Alert>
          )}
        </Box>
        <Typography variant="body1" color="text.secondary">
          As a FoodShare beneficiary, you're helping to reduce food waste while providing nutrition to those who need it. 
          Here's a summary of your impact through the donations you've received.
        </Typography>
      </Paper>
      
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            elevation={2} 
            sx={{ 
              borderRadius: 2,
              height: '100%',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'primary.main', 
                    color: 'white',
                    p: 1,
                    borderRadius: '50%',
                    mr: 2
                  }}
                >
                  <FoodIcon fontSize="medium" />
                </Box>
                <Typography variant="h6">
                  Food Received
                </Typography>
              </Box>  
              <Typography variant="h3" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
                {getMetricsValue('totalFoodReceived', 0).toFixed(1)}
                <Typography component="span" variant="h5" color="text.secondary"> kg</Typography>
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Total weight of all food donations you've received
              </Typography>
              
              <Box sx={{ mt: 'auto' }}>
                <Typography variant="caption" color="text.secondary">
                  That's approximately
                </Typography>  
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {getMetricsValue('mealsProvided', 0)} meals provided
              </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            elevation={2} 
            sx={{ 
              borderRadius: 2,
              height: '100%',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'success.main', 
                    color: 'white',
                    p: 1,
                    borderRadius: '50%',
                    mr: 2
                  }}
                >
                  <CarbonIcon fontSize="medium" />
                </Box>
                <Typography variant="h6">
                  Environmental Impact
                </Typography>
              </Box>
                <Typography variant="h3" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
                {getMetricsValue('carbonFootprintReduced', 0).toFixed(1)}
                <Typography component="span" variant="h5" color="text.secondary"> kg CO₂</Typography>
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Total carbon emissions prevented through donation reuse
              </Typography>
              
              <Box sx={{ mt: 'auto' }}>
                <Typography variant="caption" color="text.secondary">
                  Equivalent to
                </Typography>                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {(getMetricsValue('carbonFootprintReduced', 0) / 10).toFixed(1)} trees planted 🌳
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            elevation={2} 
            sx={{ 
              borderRadius: 2,
              height: '100%',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'secondary.main', 
                    color: 'white',
                    p: 1,
                    borderRadius: '50%',
                    mr: 2
                  }}
                >
                  <PeopleIcon fontSize="medium" />
                </Box>
                <Typography variant="h6">
                  Donation Activity
                </Typography>
              </Box>
              
              <Typography variant="h3" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
                {getMetricsValue('donationsReceived', 0)}
                <Typography component="span" variant="h5" color="text.secondary"> received</Typography>
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Total number of food donations you've received
              </Typography>
              
              <Box sx={{ mt: 'auto' }}>
                <Typography variant="caption" color="text.secondary">
                  Average response time
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {getMetricsValue('avgResponseTime', 0)} days to approval
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Charts Title */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Detailed Impact Analytics
      </Typography>
      
      {/* Charts & Graphs */}
      <Grid container spacing={3}>
        {/* Food Category Breakdown */}
        <Grid item xs={12} md={6}>
          <Card 
            component={motion.div}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            elevation={2} 
            sx={{ borderRadius: 2, height: '100%' }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Food Category Breakdown
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Distribution of food types you've received
              </Typography>
              
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getMetricsValue('categoryBreakdown', [])}
                      nameKey="name"
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {getMetricsValue('categoryBreakdown', []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colorPalette[index % colorPalette.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Impact Over Time */}
        <Grid item xs={12} md={6}>
          <Card 
            component={motion.div}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            elevation={2} 
            sx={{ borderRadius: 2, height: '100%' }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Impact Over Time
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Monthly progress of food received and carbon saved
              </Typography>
              
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getMetricsValue('impactOverTime', [])}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" stroke={theme.palette.primary.main} />
                    <YAxis yAxisId="right" orientation="right" stroke={theme.palette.success.main} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="foodReceived" 
                      name="Food Received (kg)"
                      stroke={theme.palette.primary.main} 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="carbonSaved" 
                      name="Carbon Saved (kg CO₂)"
                      stroke={theme.palette.success.main} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Cumulative Impact */}
        <Grid item xs={12}>
          <Card 
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            elevation={2} 
            sx={{ borderRadius: 2, mt: 2 }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Contribution Impact
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                By receiving these donations, you've helped reduce food waste and contributed to a more sustainable community.
                Here's how your participation translates to real-world impact:
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <EnergyIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Energy Saved
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                      {(getMetricsValue('totalFoodReceived', 0) * 4.5).toFixed(0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      kilowatt-hours
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CalendarIcon sx={{ fontSize: 48, color: 'info.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Landfill Space Saved
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                      {(getMetricsValue('totalFoodReceived', 0) * 0.12).toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      cubic meters
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <TimeIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Water Conserved
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {(getMetricsValue('totalFoodReceived', 0) * 15.3).toFixed(0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      liters
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Progress Toward Goals */}
      <Card 
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        elevation={2} 
        sx={{ borderRadius: 2, mt: 4 }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Progress Toward Community Goals
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            FoodShare has set community-wide goals for food waste reduction. Here's how your participation contributes:
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">
                    Food Waste Reduction Goal (1000kg)
                  </Typography>
                  <Typography variant="body2" color="primary.main" fontWeight="bold">
                    {getMetricsValue('totalFoodReceived', 0).toFixed(1)} / 1000 kg
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(getMetricsValue('totalFoodReceived', 0) / 1000) * 100} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">
                    Carbon Reduction Goal (1500kg CO₂)
                  </Typography>
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    {getMetricsValue('carbonFootprintReduced', 0).toFixed(1)} / 1500 kg CO₂
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(getMetricsValue('carbonFootprintReduced', 0) / 1500) * 100} 
                  color="success"
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">
                    Meals Provided Goal (5000)
                  </Typography>
                  <Typography variant="body2" color="secondary.main" fontWeight="bold">
                    {getMetricsValue('mealsProvided', 0)} / 5000 meals
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(getMetricsValue('mealsProvided', 0) / 5000) * 100} 
                  color="secondary"
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ImpactMetrics;
