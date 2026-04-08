import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  IconButton,
  List,
  ListItem,
  Divider
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { styled } from '@mui/material/styles';

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.grey[400],
  textDecoration: 'none',
  position: 'relative',
  display: 'inline-block',
  '&:hover': {
    color: theme.palette.primary.main,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: 0,
    height: '1px',
    bottom: -2,
    left: 0,
    backgroundColor: theme.palette.primary.main,
    transition: 'width 0.3s',
  },
  '&:hover::after': {
    width: '100%',
  }
}));

const SectionHeading = styled(Typography)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(3),
  fontWeight: 700,
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: -8,
    width: 32,
    height: 2,
    backgroundColor: theme.palette.primary.main,
  }
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: theme.palette.common.white,
  marginRight: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    transform: 'scale(1.1)',
  },
  transition: 'all 0.3s',
}));

const Footer = () => {
  return (
    <Box
      component={motion.footer}
      sx={{
        bgcolor: 'grey.900',
        color: 'common.white',
        pt: 8,
        pb: 4,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <SectionHeading variant="h6">
              FoodShare
            </SectionHeading>
            <Typography variant="body2" color="grey.400" sx={{ mt: 3 }}>
              Connecting those with surplus food to those who need it most.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <SectionHeading variant="h6">
              Links
            </SectionHeading>
            <List sx={{ mt: 2 }}>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <FooterLink to="/">Home</FooterLink>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <FooterLink to="/about">About</FooterLink>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <FooterLink to="/login">Login</FooterLink>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <FooterLink to="/register">Register</FooterLink>
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <SectionHeading variant="h6">
              Legal
            </SectionHeading>
            <List sx={{ mt: 2 }}>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <FooterLink to="/terms">Terms of Service</FooterLink>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <FooterLink to="/privacy">Privacy Policy</FooterLink>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <FooterLink to="/contact">Contact Us</FooterLink>
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <SectionHeading variant="h6">
              Connect
            </SectionHeading>
            <Box sx={{ mt: 3 }}>
              <SocialButton
                aria-label="Facebook"
                component="a"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
              </SocialButton>
              <SocialButton
                aria-label="Twitter"
                component="a"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon />
              </SocialButton>
              <SocialButton
                aria-label="Instagram"
                component="a"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
              </SocialButton>
              <SocialButton
                aria-label="LinkedIn"
                component="a"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon />
              </SocialButton>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <Typography 
          variant="body2" 
          color="grey.500" 
          align="center"
          sx={{ pt: 4 }}
        >
          © {new Date().getFullYear()} FoodShare. All rights reserved.
        </Typography>
      </Container>
    </Box>  );
};

export default Footer;
