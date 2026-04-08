import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Container,
  Avatar,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Custom styled components
const NavLink = styled(Button)(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  marginLeft: theme.spacing(2),
  fontWeight: active ? 700 : 400,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: active ? '100%' : 0,
    height: '2px',
    bottom: 0,
    left: 0,
    backgroundColor: theme.palette.primary.main,
    transition: 'width 0.3s',
  },
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    '&::after': {
      width: '100%',
    },
  },
}));

const ProfileButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  position: 'relative',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  fontWeight: 600,
  fontSize: '1rem',
}));

const DashboardNavbar = ({ currentPage, onLogout }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  
  // Get current user from local storage
  const getUserFromLocalStorage = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };
  
  const currentUser = getUserFromLocalStorage();
  const userRole = currentUser?.role || 'guest';
  
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
  
  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };
  
  const handleLogout = () => {
    handleProfileMenuClose();
    if (onLogout) {
      onLogout();
    }
  };
  
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };
  
  const getDashboardPath = () => {
    switch(userRole) {
      case 'donor':
        return '/donor';
      case 'beneficiary':
        return '/beneficiary';
      case 'admin':
        return '/admin';
      default:
        return '/';
    }
  };
  
  const isActive = (path) => {
    return location.pathname === path || currentPage === path.replace('/', '');
  };

  return (
    <AppBar 
      position="fixed" 
      color='default' 
      elevation={scrolled ? 4 : 2}
      sx={{ 
        transition: 'all 0.3s ease-in-out',
        py: scrolled ? 0.5 : 1,
        backgroundColor: '#fff',
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
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <NavLink 
              component={Link} 
              to={getDashboardPath()} 
              active={isActive(getDashboardPath()) ? 1 : 0}
            >
              Dashboard
            </NavLink>
            
            <NavLink 
              component={Link} 
              to="/notifications" 
              active={isActive('/notifications') ? 1 : 0}
              sx={{
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              Notifications
            </NavLink>
            
            <NavLink 
              component={Link} 
              to="/profile" 
              active={isActive('/profile') ? 1 : 0}
            >
              Profile
            </NavLink>
            
            <Tooltip title={currentUser?.username || 'User'}>
              <ProfileButton
                onClick={handleProfileMenuOpen}
                aria-label="account of current user"
                aria-controls="profile-menu"
                aria-haspopup="true"
              >
                <UserAvatar>
                  {getInitials(currentUser?.username)}
                </UserAvatar>
              </ProfileButton>
            </Tooltip>
            
            <Menu
              id="profile-menu"
              anchorEl={profileMenuAnchor}
              keepMounted
              open={Boolean(profileMenuAnchor)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
                  mt: 1.5,
                  '& .MuiMenuItem-root': {
                    px: 2,
                    py: 1,
                    my: 0.5,
                    fontSize: '0.875rem',
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem component={Link} to="/profile">
                My Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
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
            <ListItem component={Link} to={getDashboardPath()} sx={{ py: 2 }}>
              <ListItemText 
                primary="Dashboard" 
                primaryTypographyProps={{ 
                  variant: 'h6', 
                  textAlign: 'center',
                  color: isActive(getDashboardPath()) ? 'primary.main' : 'text.primary',
                  fontWeight: isActive(getDashboardPath()) ? 700 : 400,
                }} 
              />
            </ListItem>
            
            <ListItem component={Link} to="/notifications" sx={{ py: 2 }}>
              <ListItemText 
                primary="Notifications" 
                primaryTypographyProps={{ 
                  variant: 'h6', 
                  textAlign: 'center',
                  color: isActive('/notifications') ? 'primary.main' : 'text.primary',
                  fontWeight: isActive('/notifications') ? 700 : 400,
                }} 
              />
            </ListItem>
            
            <ListItem component={Link} to="/profile" sx={{ py: 2 }}>
              <ListItemText 
                primary="Profile" 
                primaryTypographyProps={{ 
                  variant: 'h6', 
                  textAlign: 'center',
                  color: isActive('/profile') ? 'primary.main' : 'text.primary',
                  fontWeight: isActive('/profile') ? 700 : 400,
                }} 
              />
            </ListItem>
            
            <ListItem 
              sx={{ py: 2, display: 'flex', justifyContent: 'center' }}
              onClick={handleLogout}
            >
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ maxWidth: '80%', py: 1 }}
              >
                Logout
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default DashboardNavbar;
