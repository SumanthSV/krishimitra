import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Menu, 
  MenuItem,
  useTheme,
  Avatar,
  Divider,
  Tooltip,
  ListItemIcon
} from '@mui/material';
import {
  Menu as MenuIcon,
  Translate as TranslateIcon,
  Mic as MicIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Person as PersonIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'mr', name: 'मराठी' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
];

interface HeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, toggleSidebar }) => {

  const [languageMenuAnchor, setLanguageMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const { language, setLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();



  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchor(null);
  };

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
    handleLanguageMenuClose();
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    handleUserMenuClose();
  };

  const startVoiceRecognition = () => {
    // Voice recognition functionality will be implemented here
    console.log('Starting voice recognition');
  };


  
  // Use useMemo to recreate the authItems array when the language changes (when t changes)
  const authItems = React.useMemo(() => {
    return isAuthenticated
      ? [
          { text: t('nav.profile'), icon: <PersonIcon />, path: '/profile' },
          { text: t('nav.logout'), icon: <LogoutIcon />, onClick: handleLogout },
        ]
      : [
          { text: t('nav.login'), icon: <LoginIcon />, path: '/login' },
          { text: t('nav.register'), icon: <RegisterIcon />, path: '/register' },
        ];
  }, [t, isAuthenticated, handleLogout]); // Dependencies ensure the array is recreated when language or auth state changes



  return (
    <>
      <AppBar 
        position="fixed" 
        color="primary"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
            sx={{ 
              mr: { xs: 1, sm: 2 },
              '& .MuiSvgIcon-root': {
                fontSize: { xs: '1.5rem', sm: '1.75rem' }
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            KrishiMitra
          </Typography>
          
          {/* Right-aligned navbar items */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* <IconButton color="inherit" onClick={startVoiceRecognition} aria-label="voice input">
              <MicIcon />
            </IconButton> */}
            
            <IconButton color="inherit" onClick={handleLanguageMenuOpen} aria-label="change language">
              <TranslateIcon />
            </IconButton>
            
            {isAuthenticated ? (
              <Tooltip title={t('nav.profile')}>
                <IconButton 
                  onClick={handleUserMenuOpen} 
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  <Avatar 
                    sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}
                    src={user?.profile?.avatar || undefined}
                  >
                    {user?.name?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/login"
                  startIcon={<LoginIcon />}
                  sx={{ 
                    ml: { xs: 0.5, sm: 1 },
                    px: { xs: 1, sm: 2 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  {t('nav.login')}
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  component={RouterLink} 
                  to="/register"
                  startIcon={<RegisterIcon />}
                  sx={{ 
                    ml: { xs: 0.5, sm: 1 },
                    px: { xs: 1, sm: 2 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    borderColor: 'white', 
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255, 255, 255, 0.08)' } 
                  }}
                >
                  {t('nav.register')}
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Menu
        anchorEl={languageMenuAnchor}
        open={Boolean(languageMenuAnchor)}
        onClose={handleLanguageMenuClose}
      >
        {languages.map((lang) => (
          <MenuItem 
            key={lang.code} 
            onClick={() => handleLanguageChange(lang.code)}
            selected={language === lang.code}
          >
            {lang.name}
          </MenuItem>
        ))}
      </Menu>
      
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem component={RouterLink} to="/profile" onClick={handleUserMenuClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          {t('nav.profile')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {t('nav.logout')}
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;