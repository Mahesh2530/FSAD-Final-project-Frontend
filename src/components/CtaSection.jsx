import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Box, Typography, Container, Button } from '@mui/material';

const CtaSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <Box 
      ref={sectionRef} 
      component="section"
      sx={{ 
        py: { xs: 8, md: 12 },
        bgcolor: 'background.paper',
        textAlign: 'center'
      }}
    >
      <Container maxWidth="md" sx={{ maxWidth: '800px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: '1.75rem', md: '2.5rem' }
            }}
          >
            Join the Movement
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              mb: 6,
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}
          >
            Sign up today to donate or receive food. Together, we can make a difference.
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            component={Link}
            to="/register" 
            variant="contained"
            color="primary"
            size="large"
            sx={{ 
              py: 1.5, 
              px: 5, 
              fontSize: '1.1rem',
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease-in-out'
            }}
          >
            Register Now          </Button>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CtaSection;

