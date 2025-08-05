import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon
} from '@mui/icons-material';
import { getVoiceService, VoiceRecognitionResult } from '../services/VoiceService.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface VoiceInputProps {
  onResult: (transcript: string, confidence: number) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  context?: {
    expectedDomain?: 'weather' | 'crop' | 'finance' | 'market';
    location?: { state: string; district: string };
    currentCrop?: string;
  };
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  onResult,
  onError,
  disabled = false,
  context
}) => {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const voiceService = getVoiceService();

  useEffect(() => {
    // Check if voice features are supported
    const support = voiceService.constructor.isSupported();
    setIsSupported(support.speechRecognition);
  }, [voiceService]);

  const handleStartListening = async () => {
    if (!isSupported || disabled) return;

    try {
      setError(null);
      setTranscript('');
      setConfidence(0);
      setIsDialogOpen(true);
      setIsListening(true);

      await voiceService.processVoiceQuery(
        (result: VoiceRecognitionResult) => {
          setTranscript(result.transcript);
          setConfidence(result.confidence);

          if (result.isFinal) {
            setIsListening(false);
            onResult(result.transcript, result.confidence);
          }
        },
        context
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Voice recognition failed');
      setIsListening(false);
      if (onError) {
        onError(error instanceof Error ? error.message : 'Voice recognition failed');
      }
    }
  };

  const handleStopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  const handleDialogClose = () => {
    if (isListening) {
      handleStopListening();
    }
    setIsDialogOpen(false);
    setTranscript('');
    setConfidence(0);
    setError(null);
  };

  const handleUseTranscript = () => {
    if (transcript.trim()) {
      onResult(transcript, confidence);
    }
    handleDialogClose();
  };

  if (!isSupported) {
    return (
      <Tooltip title="Voice input not supported in this browser">
        <span>
          <IconButton disabled>
            <MicOffIcon />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  return (
    <>
      <Tooltip title={isListening ? "Stop voice input" : "Start voice input"}>
        <IconButton
          onClick={handleStartListening}
          disabled={disabled}
          color={isListening ? "secondary" : "default"}
          sx={{
            backgroundColor: isListening ? 'rgba(244, 67, 54, 0.1)' : 'transparent',
            '&:hover': {
              backgroundColor: isListening ? 'rgba(244, 67, 54, 0.2)' : 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          {isListening ? <MicIcon /> : <MicIcon />}
        </IconButton>
      </Tooltip>

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            {isListening ? <MicIcon color="secondary" /> : <MicOffIcon />}
            Voice Input
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box textAlign="center" py={2}>
            {isListening ? (
              <Box>
                <CircularProgress color="secondary" size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Listening...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Speak clearly in {language === 'hi' ? 'Hindi' : 'English'}
                </Typography>
              </Box>
            ) : (
              <Box>
                <VolumeOffIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Voice input stopped
                </Typography>
              </Box>
            )}
          </Box>

          {transcript && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle2" gutterBottom>
                Transcript:
              </Typography>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                "{transcript}"
              </Typography>
              {confidence > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Confidence: {Math.round(confidence * 100)}%
                </Typography>
              )}
            </Box>
          )}

          {context && (
            <Box sx={{ mt: 2, p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="caption" color="info.contrastText">
                Context: {context.expectedDomain || 'General'} query
                {context.location && ` for ${context.location.district}, ${context.location.state}`}
                {context.currentCrop && ` about ${context.currentCrop}`}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose}>
            Cancel
          </Button>
          {isListening ? (
            <Button onClick={handleStopListening} color="secondary">
              Stop Listening
            </Button>
          ) : (
            transcript && (
              <Button onClick={handleUseTranscript} variant="contained" color="primary">
                Use Transcript
              </Button>
            )
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VoiceInput;