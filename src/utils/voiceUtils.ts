// Utilities for handling voice input and speech recognition

// Types for voice recognition
export interface VoiceRecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

// Supported languages for voice recognition
export type SupportedVoiceLanguage = 'en-IN' | 'hi-IN' | 'pa-IN' | 'bn-IN' | 'te-IN' | 'ta-IN' | 'mr-IN' | 'gu-IN' | 'kn-IN' | 'ml-IN';

// Map from language code to voice recognition language code
export const languageToVoiceLanguage: Record<string, SupportedVoiceLanguage> = {
  en: 'en-IN',
  hi: 'hi-IN',
  pa: 'pa-IN',
  bn: 'bn-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
};

// Check if speech recognition is supported by the browser
export const isSpeechRecognitionSupported = (): boolean => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

// Class for handling voice recognition
export class VoiceRecognition {
  private recognition: any;
  private isListening: boolean = false;
  private language: SupportedVoiceLanguage = 'en-IN';
  private onResultCallback: (result: VoiceRecognitionResult) => void = () => {};
  private onErrorCallback: (error: any) => void = () => {};
  private onStartCallback: () => void = () => {};
  private onEndCallback: () => void = () => {};
  private autoRestart: boolean = false;
  private maxRestartAttempts: number = 3;
  private currentRestartAttempts: number = 0;

  constructor() {
    if (!isSpeechRecognitionSupported()) {
      throw new Error('Speech recognition is not supported by this browser');
    }

    // Initialize the speech recognition object
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configure the recognition
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = this.language;
    this.recognition.maxAlternatives = 1;
    
    // Set up event handlers
    this.recognition.onresult = this.handleResult.bind(this);
    this.recognition.onerror = this.handleError.bind(this);
    this.recognition.onstart = this.handleStart.bind(this);
    this.recognition.onend = this.handleEnd.bind(this);
  }

  // Set the language for recognition
  setLanguage(language: string): void {
    this.language = languageToVoiceLanguage[language] || 'en-IN';
    this.recognition.lang = this.language;
  }

  // Start listening for voice input
  start(): void {
    if (this.isListening) return;
    
    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      this.onErrorCallback(error);
    }
  }

  // Stop listening for voice input
  stop(): void {
    if (!this.isListening) return;
    
    // Disable auto-restart when manually stopped
    this.autoRestart = false;
    this.currentRestartAttempts = 0;
    
    try {
      this.recognition.stop();
      this.isListening = false;
    } catch (error) {
      console.error('Failed to stop voice recognition:', error);
    }
  }
  
  // Enable auto-restart when recognition ends unexpectedly
  enableAutoRestart(maxAttempts: number = 3): void {
    this.autoRestart = true;
    this.maxRestartAttempts = maxAttempts;
  }
  
  // Disable auto-restart
  disableAutoRestart(): void {
    this.autoRestart = false;
    this.currentRestartAttempts = 0;
  }

  // Check if currently listening
  isRecognizing(): boolean {
    return this.isListening;
  }

  // Set callback for recognition results
  onResult(callback: (result: VoiceRecognitionResult) => void): void {
    this.onResultCallback = callback;
  }

  // Set callback for recognition errors
  onError(callback: (error: any) => void): void {
    this.onErrorCallback = callback;
  }

  // Set callback for recognition start
  onStart(callback: () => void): void {
    this.onStartCallback = callback;
  }

  // Set callback for recognition end
  onEnd(callback: () => void): void {
    this.onEndCallback = callback;
  }

  // Handle recognition results
  private handleResult(event: any): void {
    const results = event.results;
    const latestResult = results[results.length - 1];
    const transcript = latestResult[0].transcript;
    const isFinal = latestResult.isFinal;
    const confidence = latestResult[0].confidence;
    
    this.onResultCallback({
      transcript,
      isFinal,
      confidence,
    });
  }

  // Handle recognition errors
  private handleError(event: any): void {
    console.error('Speech recognition error:', event.error);
    this.isListening = false;
    this.onErrorCallback(event);
  }

  // Handle recognition start
  private handleStart(): void {
    this.isListening = true;
    this.onStartCallback();
  }

  // Handle recognition end
  private handleEnd(): void {
    this.isListening = false;
    
    // Auto-restart if enabled and not manually stopped
    if (this.autoRestart && this.currentRestartAttempts < this.maxRestartAttempts) {
      this.currentRestartAttempts++;
      setTimeout(() => {
        try {
          this.recognition.start();
          this.isListening = true;
        } catch (error) {
          console.error('Failed to auto-restart voice recognition:', error);
          this.onErrorCallback(error);
        }
      }, 300); // Small delay before restarting
    } else {
      this.currentRestartAttempts = 0;
      this.onEndCallback();
    }
  }
}

// Function to create a new voice recognition instance
export const createVoiceRecognition = (): VoiceRecognition | null => {
  try {
    return new VoiceRecognition();
  } catch (error) {
    console.error('Failed to create voice recognition:', error);
    return null;
  }
};

// Text-to-speech functionality
export class TextToSpeech {
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private language: string = 'en-IN';
  private voicesLoaded: boolean = false;
  private voiceLoadedCallbacks: (() => void)[] = [];

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
    
    // Some browsers (like Chrome) load voices asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
        // Execute any callbacks waiting for voices to load
        this.voiceLoadedCallbacks.forEach(callback => callback());
        this.voiceLoadedCallbacks = [];
      };
    }
  }

  // Load available voices
  private loadVoices(): void {
    const voices = this.synthesis.getVoices();
    if (voices.length > 0) {
      this.voices = voices;
      this.voicesLoaded = true;
    }
  }

  // Set the language for speech
  setLanguage(language: string): void {
    this.language = languageToVoiceLanguage[language] || 'en-IN';
  }

  // Speak the given text
  speak(text: string, rate: number = 1, pitch: number = 1): void {
    if (!this.synthesis) return;
    
    // Function to execute the speech
    const executeSpeech = () => {
      // Cancel any ongoing speech
      this.synthesis.cancel();
      
      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Find a voice for the current language
      const voice = this.findVoiceForLanguage(this.language);
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.lang = this.language;
      utterance.rate = rate;
      utterance.pitch = pitch;
      
      // Speak the utterance
      this.synthesis.speak(utterance);
    };
    
    // If voices are loaded, speak immediately
    if (this.voicesLoaded && this.voices.length > 0) {
      executeSpeech();
    } else {
      // Otherwise, wait for voices to load
      this.voiceLoadedCallbacks.push(executeSpeech);
      
      // Try to load voices again
      this.loadVoices();
      
      // If voices are available now, speak immediately
      if (this.voices.length > 0) {
        this.voicesLoaded = true;
        executeSpeech();
        // Remove the callback we just added
        this.voiceLoadedCallbacks.pop();
      }
    }
  }

  // Stop speaking
  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  // Find a voice for the given language
  private findVoiceForLanguage(language: string): SpeechSynthesisVoice | null {
    // First try to find a voice that exactly matches the language
    let voice = this.voices.find(v => v.lang === language);
    
    // If no exact match, try to find a voice that starts with the language code
    if (!voice) {
      const langPrefix = language.split('-')[0];
      voice = this.voices.find(v => v.lang.startsWith(langPrefix));
    }
    
    // If still no match, return null
    return voice || null;
  }

  // Check if text-to-speech is supported
  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  // Get all available voices
  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}

// Function to create a new text-to-speech instance
export const createTextToSpeech = (): TextToSpeech | null => {
  try {
    if ('speechSynthesis' in window) {
      return new TextToSpeech();
    }
    return null;
  } catch (error) {
    console.error('Failed to create text-to-speech:', error);
    return null;
  }
};

// Check if the browser supports voice input and output
export const checkVoiceSupport = (): {
  speechRecognitionSupported: boolean;
  speechSynthesisSupported: boolean;
} => {
  return {
    speechRecognitionSupported: isSpeechRecognitionSupported(),
    speechSynthesisSupported: 'speechSynthesis' in window,
  };
};