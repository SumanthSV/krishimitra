import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Box, 
  Menu, 
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  QuestionAnswer as QueryIcon,
  WbSunny as WeatherIcon,
  Grass as CropIcon,
  AccountBalance as FinanceIcon,
  Settings as SettingsIcon,
  Translate as TranslateIcon,
  Mic as MicIcon
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

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

const Header: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState<null | HTMLElement>(null);
  const { language, setLanguage } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

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

  const startVoiceRecognition = () => {
    // Voice recognition functionality will be implemented here
    console.log('Starting voice recognition');
  };

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Ask Query', icon: <QueryIcon />, path: '/query' },
    { text: 'Weather', icon: <WeatherIcon />, path: '/weather' },
    { text: 'Crop Info', icon: <CropIcon />, path: '/crops' },
    { text: 'Finance', icon: <FinanceIcon />, path: '/finance' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.text} component={RouterLink} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            KrishiMitra
          </Typography>
          
          <IconButton color="inherit" onClick={startVoiceRecognition} aria-label="voice input">
            <MicIcon />
          </IconButton>
          
          <IconButton color="inherit" onClick={handleLanguageMenuOpen} aria-label="change language">
            <TranslateIcon />
          </IconButton>
          
          {!isMobile && navItems.map((item) => (
            <Button 
              color="inherit" 
              key={item.text} 
              component={RouterLink} 
              to={item.path}
              startIcon={item.icon}
            >
              {item.text}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawer}
      </Drawer>
      
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
    </>
  );
};

export default Header;