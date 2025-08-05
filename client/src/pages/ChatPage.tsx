import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import VoiceInput from '../components/VoiceInput.tsx';
import { processQuery, AIQuery, AIResponse } from '../services/AIService.ts';
import {
  Plus,
  Menu,
  MoreVertical,
  Edit3,
  Trash2,
  Send,
  Copy,
  RotateCcw,
  X,
  MessageSquare,
  Sparkles,
  Bot,
  User
} from "lucide-react"

// Types for chat functionality
interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  category?: string; // Optional category tag
}

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

const ChatPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  
  // State for chat sessions
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // State for current message
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<null | HTMLInputElement>(null);
  
  // Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [isEditTitleDialogOpen, setIsEditTitleDialogOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [sessionToEdit, setSessionToEdit] = useState<string | null>(null);

  const [activeSessionForMenu, setActiveSessionForMenu] = useState<string | null>(null);
  
  // Available categories
  const categories = [
    { id: 'crop', label: t('chat.categories.crops') },
    { id: 'irrigation', label: t('chat.categories.irrigation') },
    { id: 'finance', label: t('chat.categories.finance') },
    { id: 'weather', label: t('chat.categories.weather') },
    { id: 'market', label: t('chat.categories.market') },
    { id: 'general', label: t('chat.categories.general') },
  ];

  // Load sessions from localStorage on initial render
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions);
        setSessions(parsedSessions);
        
        // Set current session to the most recent one if it exists
        if (parsedSessions.length > 0) {
          const mostRecentSession = parsedSessions.reduce((prev: ChatSession, current: ChatSession) => {
            return prev.updatedAt > current.updatedAt ? prev : current;
          });
          setCurrentSessionId(mostRecentSession.id);
        }
      } catch (e) {
        console.error('Error parsing saved sessions:', e);
      }
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
  }, [sessions]);

  // Scroll to bottom of messages when they change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSessionId, sessions]);

  // Close sidebar on mobile when changing sessions
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // md breakpoint
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create a new chat session
  const createNewSession = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: t('chat.newChat'),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessage('');
    
    // Focus on input field
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Get current session
  const getCurrentSession = (): ChatSession | undefined => {
    return sessions.find(session => session.id === currentSessionId);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    // Create user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: message.trim(),
      role: 'user',
      timestamp: Date.now(),
    };
    
    // Update session with user message
    const updatedSessions = sessions.map(session => {
      if (session.id === currentSessionId) {
        // Update session title if this is the first message
        const isFirstMessage = session.messages.length === 0;
        const title = isFirstMessage ? truncateTitle(message.trim()) : session.title;
        
        return {
          ...session,
          title,
          messages: [...session.messages, userMessage],
          updatedAt: Date.now(),
        };
      }
      return session;
    });
    
    setSessions(updatedSessions);
    setMessage('');
    setIsLoading(true);
    
    try {
      // Prepare query for AI service
      const query: AIQuery = {
        text: message.trim(),
        language,
        timestamp: Date.now(),
        id: userMessage.id,
      };
      
      // Process query and get response
      const aiResponse = await processQuery(query);
      
      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: aiResponse.text,
        role: 'assistant',
        timestamp: Date.now(),
      };
      
      // Update session with assistant message
      const finalSessions = updatedSessions.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: [...session.messages, assistantMessage],
            updatedAt: Date.now(),
          };
        }
        return session;
      });
      
      setSessions(finalSessions);
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: t('chat.errorGenerating'),
        role: 'assistant',
        timestamp: Date.now(),
      };
      
      const finalSessions = updatedSessions.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: [...session.messages, errorMessage],
            updatedAt: Date.now(),
          };
        }
        return session;
      });
      
      setSessions(finalSessions);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle regenerating the last AI response
  const handleRegenerateResponse = async () => {
    const currentSession = getCurrentSession();
    if (!currentSession || isLoading) return;
    
    const messages = currentSession.messages;
    if (messages.length < 2) return;
    
    // Find the last user message
    let lastUserMessageIndex = messages.length - 1;
    while (lastUserMessageIndex >= 0 && messages[lastUserMessageIndex].role !== 'user') {
      lastUserMessageIndex--;
    }
    
    if (lastUserMessageIndex < 0) return;
    
    const lastUserMessage = messages[lastUserMessageIndex];
    
    // Remove all messages after the last user message
    const updatedMessages = messages.slice(0, lastUserMessageIndex + 1);
    
    // Update session with truncated messages
    const updatedSessions = sessions.map(session => {
      if (session.id === currentSessionId) {
        return {
          ...session,
          messages: updatedMessages,
          updatedAt: Date.now(),
        };
      }
      return session;
    });
    
    setSessions(updatedSessions);
    setIsLoading(true);
    
    try {
      // Prepare query for AI service
      const query: AIQuery = {
        text: lastUserMessage.content,
        language,
        timestamp: Date.now(),
        id: lastUserMessage.id,
      };
      
      // Process query and get response
      const aiResponse = await processQuery(query);
      
      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: aiResponse.text,
        role: 'assistant',
        timestamp: Date.now(),
      };
      
      // Update session with assistant message
      const finalSessions = updatedSessions.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: [...session.messages, assistantMessage],
            updatedAt: Date.now(),
          };
        }
        return session;
      });
      
      setSessions(finalSessions);
    } catch (error) {
      console.error('Error regenerating response:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: t('chat.errorGenerating'),
        role: 'assistant',
        timestamp: Date.now(),
      };
      
      const finalSessions = updatedSessions.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: [...session.messages, errorMessage],
            updatedAt: Date.now(),
          };
        }
        return session;
      });
      
      setSessions(finalSessions);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle voice input result
  const handleVoiceResult = (transcript: string) => {
    setMessage(transcript);
  };

  // Handle key press in message input
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // Copy message content to clipboard
  const copyMessageToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        // Could show a toast notification here
        console.log('Message copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy message:', err);
      });
  };

  // Delete a session
  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    
    // If the deleted session was the current one, select another one
    if (sessionId === currentSessionId) {
      const remainingSessions = sessions.filter(session => session.id !== sessionId);
      if (remainingSessions.length > 0) {
        setCurrentSessionId(remainingSessions[0].id);
      } else {
        setCurrentSessionId(null);
      }
    }
    
    // Close the dialog
    setIsDeleteDialogOpen(false);
    setSessionToDelete(null);
  };

  // Edit session title
  const updateSessionTitle = (sessionId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          title: newTitle.trim(),
          updatedAt: Date.now(),
        };
      }
      return session;
    }));
    
    // Close the dialog
    setIsEditTitleDialogOpen(false);
    setSessionToEdit(null);
    setEditedTitle('');
  };

  // Update session category
  // const updateSessionCategory = (sessionId: string, category: string) => {
  //   setSessions(prev => prev.map(session => {
  //     if (session.id === sessionId) {
  //       return {
  //         ...session,
  //         category,
  //         updatedAt: Date.now(),
  //       };
  //     }
  //     return session;
  //   }));
    
  //   // Close the dialog
  //   setIsCategoryDialogOpen(false);
  //   setActiveSessionForMenu(null);
  //   setSelectedCategory('');
  // };

  // Helper function to truncate title
  const truncateTitle = (text: string, maxLength: number = 30): string => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Format timestamp
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for session list
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return t('chat.today');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('chat.yesterday');
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get category label
  const getCategoryLabel = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.label : t('chat.categories.general');
  };

  // Toggle session menu for mobile
  const toggleSessionMenu = (sessionId: string) => {
    setActiveSessionForMenu(activeSessionForMenu === sessionId ? null : sessionId);
  };

  const currentSession = getCurrentSession();

  return (
   <div className="flex h-[90vh] bg-gradient-to-br from-gray-50 to-white">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:relative lg:translate-x-0 z- w-72 h-full bg-white/95 backdrop-blur-xl border-r border-gray-200/50 transition-transform duration-300 ease-out shadow-2xl lg:shadow-none`}
      >
        <div className="flex flex-col h-full fixed">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  {/* <Sparkles className="w-6 h-6 text-white" /> */}
                  <h1>K</h1>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Krishimitra</h1>
                  <p className="text-xs text-gray-500">AI Agricultural Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-800 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* New Chat Button */}
            <button
              onClick={createNewSession}
              className="w-full mt-6 flex items-center justify-center  border text-zinc-800 font-medium py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <div className="">  
                <Plus className="w-20 h-5" />
                <span>{t("chat.newChat")}</span>
              
              </div>
              
            </button>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto p-4">
            {sessions.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">{t("chat.noChats")}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => {
                  const isActive = session.id === currentSessionId
                  const isMenuOpen = session.id === activeSessionForMenu
                  return (
                    <div key={session.id} className="relative">
                      <div
                        onClick={() => {
                          setCurrentSessionId(session.id)
                          if (window.innerWidth < 1024) setSidebarOpen(false)
                        }}
                        className={`group flex items-start py-2 px-4 rounded-xl cursor-pointer transition-all duration-200 ${
                          isActive
                            ? "bg-zinc-200 border border-emerald-200/50 shadow-sm"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-semibold truncate ${
                              isActive ? "text-zinc-700" : "text-gray-700"
                            }`}
                          >
                            {session.title.slice(0,23)} {session.title.length > 22 ? "..." : ""}
                          </p>
                        </div>

                        {/* Menu Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleSessionMenu(session.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all duration-200 p-1.5 rounded-lg hover:bg-white/80"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Context Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-2 top-16 z-40 w-48 bg-white shadow-xl rounded-xl border border-gray-200 py-2 backdrop-blur-xl">
                          <button
                            onClick={() => {
                              setSessionToEdit(session.id)
                              setEditedTitle(session.title)
                              setIsEditTitleDialogOpen(true)
                              setActiveSessionForMenu(null)
                            }}
                            className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Edit3 className="w-4 h-4 mr-3" />
                            {t("chat.editTitle")}
                          </button>
                          <button
                            onClick={() => {
                              setSessionToDelete(session.id)
                              setIsDeleteDialogOpen(true)
                              setActiveSessionForMenu(null)
                            }}
                            className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mr-3" />
                            {t("chat.deleteChat")}
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-[90vh]">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800 truncate max-w-[200px]">
            {currentSession?.title || t("chat.newChat")}
          </h2>
          <button
            onClick={createNewSession}
            className="text-gray-600 hover:text-gray-900 transition-colors p-2 -mr-2 rounded-lg hover:bg-gray-100"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Content */}
        {!currentSession ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="text-center max-w-2xl">
              {/* <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Sparkles className="w-12 h-12 text-white" />
              </div> */}
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("chat.welcomeTitle")}</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">{t("chat.welcomeMessage")}</p>
              <button
                onClick={createNewSession}
                className="inline-flex items-center gap-3  text-zinc-800 border border-zinc-800 py-4 px-8 rounded-xl transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Plus className="w-6 h-6" />
                {t("chat.startNewChat")}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Messages Area - Fixed height with proper overflow */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto px-4 py-6">
                {currentSession.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    {/* <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4">
                      <Bot className="w-8 h-8 text-emerald-600" />
                    </div> */}
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">{t("chat.newChatTitle")}</h3>
                    <p className="text-gray-600 text-center max-w-md leading-relaxed">{t("chat.newChatMessage")}</p>
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto space-y-6">
                    {currentSession.messages.map((msg, index) => (
                      <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`flex items-start space-x-3 max-w-[85%] sm:max-w-[75%]`}>
                          {msg.role === "assistant" && (
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 mt-1">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                          )}

                          <div
                            className={`${
                              msg.role === "user"
                                ? "bg-gray-100 text-gray-800 rounded-2xl rounded-br-md shadow-sm border border-gray-200"
                                : "bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-200"
                            } px-5 py-3 relative group`}
                          >
                            <div className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</div>

                            {msg.role === "assistant" && (
                              <div className="flex items-center justify-end mt-3">
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => copyMessageToClipboard(msg.content)}
                                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                    title={t("chat.copyResponse")}
                                  >
                                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                                  </button>
                                  {index === currentSession.messages.length - 1 && (
                                    <button
                                      onClick={handleRegenerateResponse}
                                      disabled={isLoading}
                                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                                      title={t("chat.regenerateResponse")}
                                    >
                                      <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {msg.role === "user" && (
                            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 mt-1">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </div>

            {/* Input Area - Fixed to bottom */}
            <div className="border-t border-gray-200/50 bg-white/95 backdrop-blur-xl p-4 shadow-lg">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      ref={inputRef}
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-zinc-800 resize-none transition-all duration-200 bg-white placeholder-gray-800 shadow-sm"
                      placeholder={t("chat.typeMessage")}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      rows={1}
                      style={{ minHeight: "52px", maxHeight: "120px" }}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <VoiceInput onResult={handleVoiceResult} disabled={isLoading} />
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isLoading}
                      className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                        !message.trim() || isLoading
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      }`}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsDeleteDialogOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{t("chat.confirmDelete")}</h3>
                <p className="text-sm text-gray-600 mt-1">{t("chat.deleteWarning")}</p>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="flex-1 py-2.5 px-4 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={() => sessionToDelete && deleteSession(sessionToDelete)}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium"
              >
                {t("common.delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Title Dialog */}
      {isEditTitleDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsEditTitleDialogOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                <Edit3 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t("chat.editTitle")}</h3>
            </div>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:outline-none  transition-all"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder={t("chat.enterTitle")}
              autoFocus
            />
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setIsEditTitleDialogOpen(false)}
                className="flex-1 py-2.5 px-4 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={() => sessionToEdit && updateSessionTitle(sessionToEdit, editedTitle)}
                disabled={!editedTitle.trim()}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("common.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;