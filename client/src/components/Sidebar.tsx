import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  QuestionAnswer as QueryIcon,
  WbSunny as WeatherIcon,
  Grass as CropIcon,
  AccountBalance as FinanceIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
  drawerWidth: number;
}

const Sidebar: React.FC<SidebarProps> = ({ open, toggleSidebar, drawerWidth }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  // Use useMemo to recreate the navItems array when the language changes (when t changes)
  const navItems = React.useMemo(() => [
    { text: t('nav.home'), icon: <HomeIcon />, path: '/' },
    { text: t('nav.chat'), icon: <QueryIcon />, path: '/chat' },
    { text: t('nav.weather'), icon: <WeatherIcon />, path: '/weather' },
    { text: t('nav.cropInfo'), icon: <CropIcon />, path: '/crops' },
    { text: t('nav.finance'), icon: <FinanceIcon />, path: '/finance' },
    { text: t('nav.settings'), icon: <SettingsIcon />, path: '/settings' },
  ], [t]); // Dependency on t ensures the array is recreated when language changes

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!isMobile) return null;

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onClose={toggleSidebar}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
      sx={{
        width: isMobile ? '80%' : (open ? drawerWidth : theme.spacing(7)),
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        '& .MuiDrawer-paper': {
          width: isMobile ? '80%' : (open ? drawerWidth : theme.spacing(7)),
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-end', 
        p: 1,
        minHeight: 64, // Match AppBar height
      }}>
        {open && (
          <IconButton onClick={toggleSidebar}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={RouterLink} 
            to={item.path}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
                '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                  color: theme.palette.primary.contrastText,
                },
              },
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: theme.palette.primary.main 
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ fontWeight: 'medium' }}
              sx={{ opacity: open ? 1 : 0 }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;