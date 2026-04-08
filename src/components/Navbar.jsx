import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Custom styled components
const NavLink = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginLeft: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
  },
}));

const RegisterButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AppBar 
      position="fixed" 
      color={scrolled ? 'default' : 'transparent'} 
      elevation={scrolled ? 4 : 0}
      sx={{ 
        transition: 'all 0.3s ease-in-out',
        py: scrolled ? 0.5 : 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              flexGrow: 1,
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.3s',
              },
            }}
          >
            FoodShare
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <NavLink component={Link} to="/" color="inherit">
              Home
            </NavLink>
            <NavLink component={Link} to="/about" color="inherit">
              About
            </NavLink>
            <NavLink component={Link} to="/login" color="inherit">
              Login
            </NavLink>
            <RegisterButton 
              component={Link} 
              to="/register" 
              variant="contained" 
              color="primary"
            >
              Register
            </RegisterButton>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleMobileMenu}
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: { width: '100%', maxWidth: 300 }
        }}
      >
        <Box
          sx={{ width: '100%', py: 6 }}
          role="presentation"
          onClick={toggleMobileMenu}
        >
          <List>
            <ListItem component={Link} to="/" sx={{ py: 2 }}>
              <ListItemText 
                primary="Home" 
                primaryTypographyProps={{ 
                  variant: 'h6', 
                  textAlign: 'center',
                  color: 'text.primary'
                }} 
              />
            </ListItem>
            <ListItem component={Link} to="/about" sx={{ py: 2 }}>
              <ListItemText 
                primary="About" 
                primaryTypographyProps={{ 
                  variant: 'h6', 
                  textAlign: 'center',
                  color: 'text.primary'
                }} 
              />
            </ListItem>
            <ListItem component={Link} to="/login" sx={{ py: 2 }}>
              <ListItemText 
                primary="Login" 
                primaryTypographyProps={{ 
                  variant: 'h6', 
                  textAlign: 'center',
                  color: 'text.primary'
                }} 
              />
            </ListItem>
            <ListItem sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ maxWidth: '80%', py: 1 }}
              >
                Register
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>  );
};

export default Navbar;
