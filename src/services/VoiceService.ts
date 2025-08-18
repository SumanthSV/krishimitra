import { getLanguage } from '../utils/languageUtils.ts';

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  language: string;
}

export interface VoiceServiceConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export class VoiceService {
  private recognition: any = null;
  private synthesis: any = null;
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private config: VoiceServiceConfig;

  constructor(config: VoiceServiceConfig = {}) {
    this.config = {
      language: config.language || 'en-IN',
      continuous: config.continuous || false,
      interimResults: config.interimResults || true,
      maxAlternatives: config.maxAlternatives || 1
    };

    this.initializeSpeechRecognition();
    this.initializeSpeechSynthesis();
  }

  private initializeSpeechRecognition(): void {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    this.recognition = new SpeechRecognition();

    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.lang = this.config.language;
    this.recognition.maxAlternatives = this.config.maxAlternatives;
  }

  private initializeSpeechSynthesis(): void {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }
  }

  // Speech Recognition Methods
  startListening(
    onResult: (result: VoiceRecognitionResult) => void,
    onError?: (error: any) => void,
    onEnd?: () => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not available'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Already listening'));
        return;
      }

      this.recognition.onstart = () => {
        this.isListening = true;
        resolve();
      };

      this.recognition.onresult = (event: any) => {
        const results = event.results;
        const latestResult = results[results.length - 1];
        
        if (latestResult) {
          const transcript = latestResult[0].transcript;
          const confidence = latestResult[0].confidence || 0.5;
          const isFinal = latestResult.isFinal;

          onResult({
            transcript,
            confidence,
            isFinal,
            language: this.config.language || 'en-IN'
          });
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        if (onError) {
          onError(event.error);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) {
          onEnd();
        }
      };

      try {
        this.recognition.start();
      } catch (error) {
        reject(error);
      }
    });
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  // Speech Synthesis Methods
  speak(
    text: string,
    options: {
      language?: string;
      rate?: number;
      pitch?: number;
      volume?: number;
      voice?: string;
    } = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not available'));
        return;
      }

      if (this.isSpeaking) {
        this.synthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = options.language || this.config.language || 'en-IN';
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      // Try to find a voice for the specified language
      const voices = this.synthesis.getVoices();
      const preferredVoice = voices.find((voice: any) => 
        voice.lang.startsWith(utterance.lang.split('-')[0])
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        resolve();
      };

      utterance.onerror = (event: any) => {
        this.isSpeaking = false;
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      this.synthesis.speak(utterance);
    });
  }

  stopSpeaking(): void {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }

  // Utility Methods
  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  getVoicesForLanguage(language: string): SpeechSynthesisVoice[] {
    const voices = this.getAvailableVoices();
    return voices.filter(voice => voice.lang.startsWith(language.split('-')[0]));
  }

  setLanguage(language: string): void {
    this.config.language = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  // Language mapping for Indian languages
  getVoiceLanguageCode(appLanguage: string): string {
    const languageMap: Record<string, string> = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'pa': 'pa-IN',
      'bn': 'bn-IN',
      'te': 'te-IN',
      'ta': 'ta-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN'
    };

    return languageMap[appLanguage] || 'en-IN';
  }

  // Check browser support
  static isSupported(): {
    speechRecognition: boolean;
    speechSynthesis: boolean;
  } {
    return {
      speechRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
      speechSynthesis: 'speechSynthesis' in window
    };
  }

  // Process voice query with context
  async processVoiceQuery(
    onResult: (result: VoiceRecognitionResult) => void,
  ): Promise<void> {
    const currentLanguage = getLanguage();
    const voiceLanguage = this.getVoiceLanguageCode(currentLanguage);
    
    this.setLanguage(voiceLanguage);

    return this.startListening(
      (result) => {
        // Enhance result with context
        const enhancedResult = {
          ...result,
          processedAt: new Date()
        };
        
        onResult(enhancedResult);
      },
      (error) => {
        console.error('Voice recognition error:', error);
        onResult({
          transcript: '',
          confidence: 0,
          isFinal: true,
          language: voiceLanguage,
          error: error
        } as any);
      }
    );
  }

  // Speak response with appropriate voice
  async speakResponse(
    text: string,
    language?: string
  ): Promise<void> {
    const targetLanguage = language || getLanguage();
    const voiceLanguage = this.getVoiceLanguageCode(targetLanguage);
    
    // Find the best voice for the language
    const voices = this.getVoicesForLanguage(voiceLanguage);
    const preferredVoice = voices.find(voice => 
      voice.lang === voiceLanguage && voice.localService
    ) || voices[0];

    return this.speak(text, {
      language: voiceLanguage,
      voice: preferredVoice?.name,
      rate: 0.9, // Slightly slower for better comprehension
      pitch: 1,
      volume: 0.8
    });
  }
}

// Singleton instance
let voiceService: VoiceService | null = null;

export const getVoiceService = (config?: VoiceServiceConfig): VoiceService => {
  if (!voiceService) {
    voiceService = new VoiceService(config);
  }
  return voiceService;
};

export default VoiceService;