import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Translation keys are now managed by i18next

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        
        <Typography variant="body2" color="text.secondary" align="center">
          {t('footer.disclaimer')}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          {t('footer.copyright')}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;