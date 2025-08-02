import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  CircularProgress,
  Chip,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Send as SendIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  History as HistoryIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import VoiceInput from '../components/VoiceInput';
import ImageUpload from '../components/ImageUpload';
import { getOfflineService } from '../services/OfflineService';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  bookmarked: boolean;
};

const translations = {
  en: {
    title: 'Ask Your Question',
    placeholder: 'Type your agricultural query here...',
    send: 'Send',
    listening: 'Listening...',
    startVoice: 'Start Voice Input',
    stopVoice: 'Stop Voice Input',
    recentQueries: 'Recent Queries',
    suggestions: 'Suggested Questions',
    noQueries: 'No recent queries',
    thinking: 'Thinking...',
  },
  hi: {
    title: 'अपना प्रश्न पूछें',
    placeholder: 'अपना कृषि संबंधी प्रश्न यहां टाइप करें...',
    send: 'भेजें',
    listening: 'सुन रहा है...',
    startVoice: 'आवाज़ इनपुट शुरू करें',
    stopVoice: 'आवाज़ इनपुट बंद करें',
    recentQueries: 'हाल के प्रश्न',
    suggestions: 'सुझाए गए प्रश्न',
    noQueries: 'कोई हालिया प्रश्न नहीं',
    thinking: 'विचार कर रहा है...',
  },
  // Add more languages as needed
};

// Sample suggested questions
const suggestedQuestions = {
  en: [
    'When should I irrigate my wheat crop?',
    'What are the best practices for pest control in rice?',
    'Which seed variety is suitable for this season?',
    'How can I apply for the PM-KISAN scheme?',
    'What is the current market price for soybeans?'
  ],
  hi: [
    'मुझे अपनी गेहूं की फसल को कब सिंचाई करनी चाहिए?',
    'चावल में कीट नियंत्रण के लिए सर्वोत्तम प्रथाएं क्या हैं?',
    'इस मौसम के लिए कौन सी बीज किस्म उपयुक्त है?',
    'पीएम-किसान योजना के लिए आवेदन कैसे करें?',
    'सोयाबीन का वर्तमान बाजार मूल्य क्या है?'
  ],
  // Add more languages as needed
};

const QueryPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
  const suggestedQs = suggestedQuestions[language as keyof typeof suggestedQuestions] || suggestedQuestions.en;
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [context, setContext] = useState<any>({});
  
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Load messages from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem('queryMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert string timestamps back to Date objects
        const messagesWithDateObjects = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDateObjects);
      } catch (e) {
        console.error('Error parsing saved messages:', e);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('queryMessages', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSendQuery = async () => {
    if (!query.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: query,
      sender: 'user',
      timestamp: new Date(),
      bookmarked: false,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    // In a real app, we would send the query to an API here
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      // Sample AI response based on query keywords
      let responseText = 'I don\'t have specific information about that. Please check with your local agricultural extension office.';
      
      if (query.toLowerCase().includes('irrigate') || query.toLowerCase().includes('water')) {
        responseText = 'For most crops, it\'s best to irrigate when the soil moisture is depleted by 50%. You can check this using a soil moisture sensor or by examining the soil texture by hand.';
      } else if (query.toLowerCase().includes('pest') || query.toLowerCase().includes('disease')) {
        responseText = 'Integrated Pest Management (IPM) is recommended for sustainable pest control. This includes crop rotation, biological controls, and judicious use of pesticides only when necessary.';
      } else if (query.toLowerCase().includes('seed') || query.toLowerCase().includes('variety')) {
        responseText = 'The best seed variety depends on your local climate, soil type, and the current season. For specific recommendations, please provide your location and the crop you wish to plant.';
      } else if (query.toLowerCase().includes('scheme') || query.toLowerCase().includes('loan') || query.toLowerCase().includes('subsidy')) {
        responseText = 'There are several government schemes available for farmers including PM-KISAN, Soil Health Card, and Kisan Credit Card. You can apply through your local agriculture office or online through the official portals.';
      } else if (query.toLowerCase().includes('price') || query.toLowerCase().includes('market')) {
        responseText = 'Market prices fluctuate daily. For the most accurate and current prices, check the e-NAM (National Agriculture Market) portal or contact your local mandi.';
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date(),
        bookmarked: false,
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendQuery();
    }
  };

  const toggleVoiceInput = () => {
    // In a real app, we would implement speech recognition here
    // For now, we'll just toggle the state
    setIsListening(prev => !prev);
    
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setQuery('When is the best time to sow wheat in northern India?');
        setIsListening(false);
      }, 3000);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setQuery(question);
  };

  const toggleBookmark = (id: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, bookmarked: !msg.bookmarked } : msg
      )
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t.title}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Chat Area */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              height: '60vh', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 2
            }}
          >
            {/* Messages */}
            <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
              {messages.length > 0 ? (
                <List>
                  {messages.map((message) => (
                    <React.Fragment key={message.id}>
                      <ListItem 
                        alignItems="flex-start"
                        sx={{
                          textAlign: message.sender === 'user' ? 'right' : 'left',
                          bgcolor: message.sender === 'user' ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                          borderRadius: 2,
                          mb: 1,
                        }}
                      >
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start', mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => toggleBookmark(message.id)}
                              sx={{ ml: 1 }}
                            >
                              {message.bookmarked ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
                            </IconButton>
                          </Box>
                          <ListItemText 
                            primary={message.text} 
                            primaryTypographyProps={{
                              variant: 'body1',
                              component: 'div',
                              sx: { whiteSpace: 'pre-wrap' }
                            }}
                          />
                        </Box>
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body1" color="text.secondary">
                    {t.noQueries}
                  </Typography>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>
            
            {/* Input Area */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={t.placeholder}
                value={query}
                onChange={handleQueryChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                multiline
                maxRows={3}
                sx={{ mr: 1 }}
              />
              <IconButton 
                color={isListening ? 'secondary' : 'default'} 
                onClick={toggleVoiceInput}
                disabled={isLoading}
                aria-label={isListening ? t.stopVoice : t.startVoice}
              >
                {isListening ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
              <Button
                variant="contained"
                color="primary"
                endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                onClick={handleSendQuery}
                disabled={!query.trim() || isLoading}
                sx={{ ml: 1 }}
              >
                {isLoading ? t.thinking : t.send}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Suggested Questions */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t.suggestions}
            </Typography>
            <List dense>
              {suggestedQs.map((question, index) => (
                <ListItem 
                  key={index} 
                  button 
                  onClick={() => handleSuggestedQuestion(question)}
                  sx={{ borderRadius: 1, '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.1)' } }}
                >
                  <ListItemText primary={question} />
                </ListItem>
              ))}
            </List>
          </Paper>
          
          {/* Recent Queries */}
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <HistoryIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                {t.recentQueries}
              </Typography>
            </Box>
            <List dense>
              {messages
                .filter(msg => msg.sender === 'user')
                .slice(-5)
                .reverse()
                .map((msg) => (
                  <ListItem 
                    key={msg.id} 
                    button 
                    onClick={() => setQuery(msg.text)}
                    sx={{ borderRadius: 1, '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.1)' } }}
                  >
                    <ListItemText 
                      primary={msg.text} 
                      secondary={msg.timestamp.toLocaleDateString()} 
                      primaryTypographyProps={{ 
                        noWrap: true,
                        style: { maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }
                      }}
                    />
                    {msg.bookmarked && <BookmarkIcon fontSize="small" color="primary" sx={{ ml: 1 }} />}
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );

  // Helper function for offline response generation
  function generateOfflineResponse(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('irrigate') || lowerQuery.includes('water')) {
      return 'For most crops, irrigate when soil moisture is 50% depleted. Check soil by hand - if it feels dry 2-3 inches deep, it\'s time to irrigate. Critical stages like flowering need consistent moisture.';
    } else if (lowerQuery.includes('pest') || lowerQuery.includes('disease')) {
      return 'Use Integrated Pest Management (IPM): 1) Monitor regularly, 2) Use resistant varieties, 3) Encourage beneficial insects, 4) Apply organic treatments first, 5) Use chemicals only when necessary.';
    } else if (lowerQuery.includes('seed') || lowerQuery.includes('variety')) {
      return 'Choose varieties based on: 1) Local climate conditions, 2) Soil type, 3) Water availability, 4) Market demand, 5) Disease resistance. Consult local agricultural extension office for region-specific recommendations.';
    } else if (lowerQuery.includes('fertilizer') || lowerQuery.includes('nutrition')) {
      return 'Follow soil test recommendations. Generally: Apply organic matter first, then NPK based on crop needs. Split nitrogen application - 50% at planting, 25% at vegetative stage, 25% at reproductive stage.';
    } else if (lowerQuery.includes('weather') || lowerQuery.includes('rain')) {
      return 'Monitor weather forecasts daily. Protect crops from extreme weather: use mulch for heat, ensure drainage for heavy rain, provide wind barriers, and plan irrigation based on rainfall predictions.';
    } else {
      return 'I\'m currently offline but here are some general tips: 1) Monitor your crops daily, 2) Maintain soil health with organic matter, 3) Follow integrated farming practices, 4) Keep records of all activities. For specific advice, please try again when online.';
    }
  }
};

export default QueryPage;