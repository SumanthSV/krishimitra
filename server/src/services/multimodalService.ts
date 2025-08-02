import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import logger from '../utils/logger';
import { getAIService } from './aiService';

/**
 * Service for handling multimodal inputs (text, voice, images)
 */
export class MultimodalService {
  private uploadPath: string;
  private aiService: any;

  constructor() {
    this.uploadPath = process.env.UPLOAD_PATH || './uploads';
    this.ensureUploadDirectories();
    this.aiService = getAIService();
  }

  /**
   * Ensure upload directories exist
   */
  private ensureUploadDirectories(): void {
    const directories = ['images', 'audio', 'documents'];
    
    directories.forEach(dir => {
      const fullPath = path.join(this.uploadPath, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });
  }

  /**
   * Configure multer for file uploads
   */
  getUploadMiddleware() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        let uploadDir = 'documents';
        
        if (file.mimetype.startsWith('image/')) {
          uploadDir = 'images';
        } else if (file.mimetype.startsWith('audio/')) {
          uploadDir = 'audio';
        }
        
        cb(null, path.join(this.uploadPath, uploadDir));
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    });

    const fileFilter = (req: any, file: any, cb: any) => {
      // Allow images, audio, and some document types
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/webp',
        'audio/mpeg', 'audio/wav', 'audio/ogg',
        'application/pdf', 'text/plain'
      ];

      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('File type not supported'), false);
      }
    };

    return multer({
      storage,
      fileFilter,
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default
      }
    });
  }

  /**
   * Process image input for crop/pest identification
   */
  async processImageInput(imagePath: string, context?: {
    queryType?: 'crop_identification' | 'pest_identification' | 'disease_diagnosis' | 'soil_analysis';
    location?: { state: string; district: string };
    userId?: string;
  }): Promise<{
    analysis: string;
    confidence: number;
    detectedObjects: Array<{
      type: string;
      name: string;
      confidence: number;
      boundingBox?: any;
    }>;
    recommendations: string[];
  }> {
    try {
      // Process image
      const processedImage = await this.preprocessImage(imagePath);
      
      // Mock image analysis (in production, this would use computer vision models)
      const analysis = await this.analyzeImage(processedImage, context);
      
      return analysis;
    } catch (error) {
      logger.error('Error processing image input:', error);
      throw new Error('Failed to process image');
    }
  }

  /**
   * Process audio input for voice queries
   */
  async processAudioInput(audioPath: string, language: string = 'en'): Promise<{
    transcript: string;
    confidence: number;
    language: string;
    duration: number;
  }> {
    try {
      // Mock speech-to-text processing
      // In production, this would use services like Google Speech-to-Text or Azure Speech
      const mockTranscript = this.generateMockTranscript(language);
      
      return {
        transcript: mockTranscript,
        confidence: 0.85,
        language,
        duration: 5.2 // Mock duration in seconds
      };
    } catch (error) {
      logger.error('Error processing audio input:', error);
      throw new Error('Failed to process audio');
    }
  }

  /**
   * Preprocess image for analysis
   */
  private async preprocessImage(imagePath: string): Promise<string> {
    try {
      const outputPath = imagePath.replace(/\.[^/.]+$/, '_processed.jpg');
      
      await sharp(imagePath)
        .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(outputPath);
      
      return outputPath;
    } catch (error) {
      logger.error('Error preprocessing image:', error);
      throw error;
    }
  }

  /**
   * Analyze image content
   */
  private async analyzeImage(imagePath: string, context?: any): Promise<any> {
    // Mock image analysis - in production, this would use:
    // - TensorFlow/PyTorch models for crop/pest identification
    // - Computer vision APIs
    // - Custom trained models on agricultural datasets
    
    const queryType = context?.queryType || 'crop_identification';
    
    switch (queryType) {
      case 'crop_identification':
        return {
          analysis: 'The image appears to show a rice plant in the vegetative growth stage. The leaves look healthy with good green color.',
          confidence: 0.82,
          detectedObjects: [
            {
              type: 'crop',
              name: 'Rice (Oryza sativa)',
              confidence: 0.82
            }
          ],
          recommendations: [
            'Continue regular irrigation',
            'Monitor for pest activity',
            'Consider nitrogen application if leaves show yellowing'
          ]
        };

      case 'pest_identification':
        return {
          analysis: 'Detected signs of leaf damage consistent with aphid infestation. Small insects visible on leaf undersides.',
          confidence: 0.75,
          detectedObjects: [
            {
              type: 'pest',
              name: 'Aphids',
              confidence: 0.75
            }
          ],
          recommendations: [
            'Apply neem oil spray',
            'Introduce beneficial insects like ladybugs',
            'Monitor spread to other plants',
            'Avoid excessive nitrogen fertilization'
          ]
        };

      case 'disease_diagnosis':
        return {
          analysis: 'Leaf spots with brown centers and yellow halos suggest bacterial leaf blight.',
          confidence: 0.68,
          detectedObjects: [
            {
              type: 'disease',
              name: 'Bacterial Leaf Blight',
              confidence: 0.68
            }
          ],
          recommendations: [
            'Remove affected leaves',
            'Apply copper-based bactericide',
            'Improve air circulation',
            'Avoid overhead irrigation'
          ]
        };

      case 'soil_analysis':
        return {
          analysis: 'Soil appears to have good texture and organic matter content. Color suggests adequate fertility.',
          confidence: 0.65,
          detectedObjects: [
            {
              type: 'soil',
              name: 'Loamy soil with good organic content',
              confidence: 0.65
            }
          ],
          recommendations: [
            'Conduct soil pH test',
            'Test for nutrient levels',
            'Consider adding organic compost',
            'Maintain soil moisture'
          ]
        };

      default:
        return {
          analysis: 'Image processed successfully but specific analysis type not recognized.',
          confidence: 0.5,
          detectedObjects: [],
          recommendations: ['Please specify the type of analysis needed']
        };
    }
  }

  /**
   * Generate mock transcript for audio processing
   */
  private generateMockTranscript(language: string): string {
    const mockTranscripts: Record<string, string> = {
      'en': 'When should I irrigate my wheat crop? The weather has been dry for the past week.',
      'hi': 'मुझे अपनी गेहूं की फसल की सिंचाई कब करनी चाहिए? पिछले सप्ताह से मौसम सूखा है।',
      'pa': 'ਮੈਨੂੰ ਆਪਣੀ ਕਣਕ ਦੀ ਫਸਲ ਦੀ ਸਿੰਚਾਈ ਕਦੋਂ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ?',
      'bn': 'আমার গমের ফসলে কখন সেচ দেওয়া উচিত?',
      'te': 'నా గోధుమ పంటకు ఎప్పుడు నీరు పెట్టాలి?',
      'ta': 'எனது கோதுமை பயிருக்கு எப்போது நீர் பாய்ச்ச வேண்டும்?'
    };

    return mockTranscripts[language] || mockTranscripts['en'];
  }

  /**
   * Process multimodal query (combination of text, image, audio)
   */
  async processMultimodalQuery(inputs: {
    text?: string;
    imagePath?: string;
    audioPath?: string;
    language?: string;
    context?: any;
  }): Promise<{
    combinedAnalysis: string;
    confidence: number;
    sources: Array<{
      type: 'text' | 'image' | 'audio';
      analysis: any;
    }>;
    recommendations: string[];
  }> {
    try {
      const sources = [];
      let combinedAnalysis = '';
      let totalConfidence = 0;
      let sourceCount = 0;

      // Process text input
      if (inputs.text) {
        const textResponse = await this.aiService.processQuery(
          inputs.text,
          inputs.language || 'en',
          inputs.context
        );
        
        sources.push({
          type: 'text' as const,
          analysis: textResponse
        });
        
        combinedAnalysis += textResponse.text + '\n\n';
        totalConfidence += textResponse.confidence;
        sourceCount++;
      }

      // Process image input
      if (inputs.imagePath) {
        const imageAnalysis = await this.processImageInput(inputs.imagePath, inputs.context);
        
        sources.push({
          type: 'image' as const,
          analysis: imageAnalysis
        });
        
        combinedAnalysis += `Image Analysis: ${imageAnalysis.analysis}\n\n`;
        totalConfidence += imageAnalysis.confidence;
        sourceCount++;
      }

      // Process audio input
      if (inputs.audioPath) {
        const audioAnalysis = await this.processAudioInput(inputs.audioPath, inputs.language);
        
        // Process the transcript as text
        const transcriptResponse = await this.aiService.processQuery(
          audioAnalysis.transcript,
          inputs.language || 'en',
          inputs.context
        );
        
        sources.push({
          type: 'audio' as const,
          analysis: { ...audioAnalysis, textResponse: transcriptResponse }
        });
        
        combinedAnalysis += `Voice Query: "${audioAnalysis.transcript}"\n${transcriptResponse.text}\n\n`;
        totalConfidence += (audioAnalysis.confidence + transcriptResponse.confidence) / 2;
        sourceCount++;
      }

      // Combine recommendations from all sources
      const allRecommendations = sources.flatMap(source => {
        if (source.type === 'image') {
          return source.analysis.recommendations || [];
        } else if (source.type === 'text' || source.type === 'audio') {
          return source.analysis.actionItems?.map((item: any) => item.description) || [];
        }
        return [];
      });

      const uniqueRecommendations = [...new Set(allRecommendations)];

      return {
        combinedAnalysis: combinedAnalysis.trim(),
        confidence: sourceCount > 0 ? totalConfidence / sourceCount : 0,
        sources,
        recommendations: uniqueRecommendations
      };
    } catch (error) {
      logger.error('Error processing multimodal query:', error);
      throw new Error('Failed to process multimodal input');
    }
  }

  /**
   * Clean up uploaded files
   */
  async cleanupFiles(filePaths: string[]): Promise<void> {
    for (const filePath of filePaths) {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        logger.error(`Error deleting file ${filePath}:`, error);
      }
    }
  }
}

// Initialize multimodal service
let multimodalService: MultimodalService;

export const initializeMultimodalService = async (): Promise<void> => {
  try {
    multimodalService = new MultimodalService();
    logger.info('Multimodal Service initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Multimodal Service:', error);
    throw error;
  }
};

export const getMultimodalService = (): MultimodalService => {
  if (!multimodalService) {
    throw new Error('Multimodal Service not initialized');
  }
  return multimodalService;
};