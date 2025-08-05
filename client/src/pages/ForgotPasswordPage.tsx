import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Mic as MicIcon,
  Help as HelpIcon,
  SmartToy as AIIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import AuthService from '../services/AuthService.ts';
import VoiceInput from '../components/VoiceInput.tsx';
import { processQuery, AIQuery } from '../services/AIService.ts';
import { getVoiceService } from '../services/VoiceService.ts';

const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');
  const [aiAssistanceOpen, setAiAssistanceOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiQuery, setAiQuery] = useState('');

  const validateForm = (): boolean => {
    let isValid = true;

    // Reset errors
    setEmailError('');
    setError(null);

    // Validate email
    if (!email) {
      setEmailError(t('auth.forgotPassword.emailRequired'));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t('auth.forgotPassword.emailInvalid'));
      isValid = false;
    }

    return isValid;
  };
  
  const handleAIAssistance = async () => {
    setAiLoading(true);
    setAiResponse(null);
    
    try {
      // Create an AI query
      const query: AIQuery = {
        text: aiQuery || 'How can I recover my password?',
        language: language,
        timestamp: Date.now(),
        id: `query-${Date.now()}`
      };
      
      // Process the query
      const response = await processQuery(query);
      
      // Set the response
      setAiResponse(response.text);
      
      // If the user asked about account recovery methods, offer to speak the response
      if (aiQuery.toLowerCase().includes('recover') || 
          aiQuery.toLowerCase().includes('forgot') || 
          aiQuery.toLowerCase().includes('reset')) {
        speakResponse(response.text);
      }
    } catch (error) {
      console.error('Error processing AI query:', error);
      setAiResponse(t('auth.forgotPassword.aiError'));
    } finally {
      setAiLoading(false);
    }
  };
  
  const speakResponse = async (text: string) => {
    try {
      const voiceService = getVoiceService();
      await voiceService.speakResponse(text, language);
    } catch (error) {
      console.error('Error speaking response:', error);
    }
  };
  
  const handleVoiceInput = (transcript: string) => {
    setAiQuery(transcript);
    // Automatically submit the query if it contains keywords
    if (transcript.toLowerCase().includes('password') || 
        transcript.toLowerCase().includes('recover') || 
        transcript.toLowerCase().includes('forgot')) {
      setTimeout(() => handleAIAssistance(), 500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        const response = await AuthService.requestPasswordReset(email);
        
        if (response.success) {
          setSuccess(response.message || t('auth.forgotPassword.successMessage'));
          setEmail(''); // Clear the form
        } else {
          setError(response.message || t('auth.forgotPassword.errorMessage'));
        }
      } catch (err: any) {
        setError(err.message || t('auth.forgotPassword.errorMessage'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', mb: 2 }}>
          <Typography component="h1" variant="h5">
            {t('auth.forgotPassword.title')}
          </Typography>
          <Tooltip title={t('auth.forgotPassword.aiAssistance')}>
            <IconButton 
              color={aiAssistanceOpen ? "primary" : "default"}
              onClick={() => setAiAssistanceOpen(!aiAssistanceOpen)}
              aria-label="AI Assistance"
            >
              <AIIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          {t('auth.forgotPassword.description')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={t('auth.forgotPassword.email')}
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            disabled={isLoading}
            inputProps={{
              dir: language === 'ar' ? 'rtl' : 'ltr',
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: 'primary.main', color: 'white' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('auth.forgotPassword.submit')
            )}
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              {t('auth.forgotPassword.backToLogin')}
            </Link>
          </Box>
        </Box>
        
        {/* AI Assistance Section */}
        <Accordion 
          expanded={aiAssistanceOpen} 
          onChange={() => setAiAssistanceOpen(!aiAssistanceOpen)}
          sx={{ width: '100%', mt: 3, borderRadius: 1, overflow: 'hidden' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="ai-assistance-content"
            id="ai-assistance-header"
            sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AIIcon sx={{ mr: 1 }} />
              <Typography>{t('auth.forgotPassword.aiAssistance')}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('auth.forgotPassword.aiAssistanceDescription')}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={t('auth.forgotPassword.askAboutPasswordReset')}
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                size="small"
                sx={{ mr: 1 }}
              />
              <VoiceInput onResult={handleVoiceInput} />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAIAssistance}
                disabled={aiLoading}
                sx={{ ml: 1, minWidth: 'auto' }}
              >
                {aiLoading ? <CircularProgress size={24} color="inherit" /> : <HelpIcon />}
              </Button>
            </Box>
            
            {aiResponse && (
              <Alert severity="info" sx={{ width: '100%', mb: 2 }}>
                {aiResponse}
              </Alert>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              {t('auth.forgotPassword.suggestedQuestions')}:
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {[
                t('auth.forgotPassword.suggestedQuestion1'),
                t('auth.forgotPassword.suggestedQuestion2'),
                t('auth.forgotPassword.suggestedQuestion3')
              ].map((question, index) => (
                <Button 
                  key={index} 
                  variant="outlined" 
                  size="small"
                  onClick={() => {
                    setAiQuery(question);
                    handleAIAssistance();
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  {question}
                </Button>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;