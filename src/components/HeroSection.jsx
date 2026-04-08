import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Stack 
} from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  boxShadow: theme.shadows[4],
  '&:hover': {
    boxShadow: theme.shadows[8],
  },
}));

const BackgroundOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 0,
}));

const DecorativeElement = styled(Box)(({ theme, rotate }) => ({
  position: 'absolute',
  bottom: -64,
  left: 0,
  width: '100%',
  height: rotate === 'negative' ? 64 : 48,
  backgroundColor: rotate === 'negative' ? 'white' : theme.palette.primary.main,
  opacity: 0.1,
  transform: `rotate(${rotate === 'negative' ? -2 : 1}deg)`,
  zIndex: 0,
}));

const HeroSection = () => {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'secondary.main',
        color: 'common.white',
        overflow: 'hidden',
      }}
    >
      {/* Background overlay */}
      <BackgroundOverlay />
      
      {/* Content container */}
      <Container 
        maxWidth="md" 
        sx={{ 
          zIndex: 10, 
          textAlign: 'center', 
          py: 8 
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            fontWeight={700}
            mb={3}
            sx={{
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' }
            }}
          >
            Join FoodShare to Fight Food Waste
          </Typography>
        </Box>
        
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Typography 
            variant="h5"
            mb={6}
            sx={{ 
              opacity: 0.9,
              fontSize: { xs: '1.25rem', md: '1.5rem' } 
            }}
          >
            Connect surplus food with those in need
          </Typography>
        </Box>
        
        <Stack
          component={motion.div}
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 3 }}
          justifyContent="center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <HeroButton 
            component={Link} 
            to="/login" 
            variant="outlined"
            color="secondary"
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderColor: 'white',
              }
            }}
          >
            Login
          </HeroButton>
          <HeroButton 
            component={Link} 
            to="/register" 
            variant="contained"
            color="primary"
          >
            Register
          </HeroButton>
        </Stack>
      </Container>
      
      {/* Animated decorative elements */}
      <DecorativeElement rotate="negative" />
      <DecorativeElement rotate="positive" />
    </Box>
  );
};

export default HeroSection;
