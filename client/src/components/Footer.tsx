import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';

const translations = {
  en: {
    about: 'About',
    help: 'Help',
    privacy: 'Privacy',
    terms: 'Terms',
    contact: 'Contact',
    copyright: '© 2023 KrishiMitra. All rights reserved.',
    disclaimer: 'Disclaimer: Information provided is for educational purposes only.',
  },
  hi: {
    about: 'हमारे बारे में',
    help: 'सहायता',
    privacy: 'गोपनीयता',
    terms: 'शर्तें',
    contact: 'संपर्क',
    copyright: '© 2023 कृषिमित्र. सर्वाधिकार सुरक्षित.',
    disclaimer: 'अस्वीकरण: प्रदान की गई जानकारी केवल शैक्षिक उद्देश्यों के लिए है।',
  },
  // Add more languages as needed
};

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="space-between">
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              KrishiMitra
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t.copyright}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              {t.about}
            </Typography>
            <Link href="#" variant="body2" display="block">
              {t.about}
            </Link>
            <Link href="#" variant="body2" display="block">
              {t.help}
            </Link>
            <Link href="#" variant="body2" display="block">
              {t.contact}
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              {t.terms}
            </Typography>
            <Link href="#" variant="body2" display="block">
              {t.privacy}
            </Link>
            <Link href="#" variant="body2" display="block">
              {t.terms}
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              {t.help}
            </Typography>
            <Link href="#" variant="body2" display="block">
              FAQ
            </Link>
            <Link href="#" variant="body2" display="block">
              {t.help}
            </Link>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body2" color="text.secondary" align="center">
          {t.disclaimer}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;