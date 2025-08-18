import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  IconButton
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  PhotoCamera as CameraIcon,
  Image as ImageIcon,
  Close as CloseIcon
} from '@mui/icons-material';

interface ImageUploadProps {
  onImageAnalysis: (analysis: any) => void;
  onError?: (error: string) => void;
  analysisType?: 'crop_identification' | 'pest_identification' | 'disease_diagnosis' | 'soil_analysis';
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageAnalysis,
  onError,
  analysisType = 'crop_identification',
  disabled = false
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const analysisTypeLabels = {
    crop_identification: 'Crop Identification',
    pest_identification: 'Pest Identification', 
    disease_diagnosis: 'Disease Diagnosis',
    soil_analysis: 'Soil Analysis'
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleImageSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setSelectedImage(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('analysisType', analysisType);

      // Mock API call - in production, this would call your backend
      const mockAnalysis = await simulateImageAnalysis(analysisType, selectedImage);
      
      setAnalysisResult(mockAnalysis);
      onImageAnalysis(mockAnalysis);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Image analysis failed';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setError(null);
    setIsAnalyzing(false);
  };

  const handleOpenCamera = () => {
    cameraInputRef.current?.click();
  };

  const handleOpenFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<ImageIcon />}
        onClick={() => setIsDialogOpen(true)}
        disabled={disabled}
        sx={{ ml: 1 }}
      >
        Image Analysis
      </Button>

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {analysisTypeLabels[analysisType]}
            </Typography>
            <Chip 
              label={analysisType.replace('_', ' ')} 
              color="primary" 
              size="small" 
            />
          </Box>
        </DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!selectedImage ? (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" gutterBottom>
                Select an image for analysis
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Upload a clear image of your {analysisType.replace('_', ' ').toLowerCase()}
              </Typography>

              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<CameraIcon />}
                    onClick={handleOpenCamera}
                    size="large"
                  >
                    Take Photo
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    onClick={handleOpenFileSelect}
                    size="large"
                  >
                    Upload Image
                  </Button>
                </Grid>
              </Grid>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Supported formats: JPEG, PNG, WebP (max 5MB)
              </Typography>
            </Box>
          ) : (
            <Box>
              {/* Image Preview */}
              <Box sx={{ position: 'relative', mb: 2 }}>
                <img
                  src={imagePreview || ''}
                  alt="Selected for analysis"
                  style={{
                    width: '100%',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    borderRadius: '8px'
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)'
                    }
                  }}
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                    setAnalysisResult(null);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Analysis Results */}
              {isAnalyzing && (
                <Box textAlign="center" py={2}>
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Analyzing image...
                  </Typography>
                </Box>
              )}

              {analysisResult && !isAnalyzing && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Analysis Results:
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    {analysisResult.analysis}
                  </Typography>

                  {analysisResult.detectedObjects && analysisResult.detectedObjects.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Detected:
                      </Typography>
                      {analysisResult.detectedObjects.map((obj: any, index: number) => (
                        <Chip
                          key={index}
                          label={`${obj.name} (${Math.round(obj.confidence * 100)}%)`}
                          color="primary"
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  )}

                  {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Recommendations:
                      </Typography>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {analysisResult.recommendations.map((rec: string, index: number) => (
                          <li key={index}>
                            <Typography variant="body2">{rec}</Typography>
                          </li>
                        ))}
                      </ul>
                    </Box>
                  )}

                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Confidence: {Math.round(analysisResult.confidence * 100)}%
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose}>
            Cancel
          </Button>
          {selectedImage && !analysisResult && !isAnalyzing && (
            <Button
              onClick={handleAnalyze}
              variant="contained"
              color="primary"
            >
              Analyze Image
            </Button>
          )}
          {analysisResult && (
            <Button
              onClick={handleDialogClose}
              variant="contained"
              color="primary"
            >
              Done
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

// Mock image analysis function
async function simulateImageAnalysis(analysisType: string, imageFile: File): Promise<any> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock analysis based on type
  switch (analysisType) {
    case 'crop_identification':
      return {
        analysis: 'This appears to be a rice plant in the tillering stage. The plant shows healthy green foliage with multiple tillers emerging from the base.',
        confidence: 0.85,
        detectedObjects: [
          {
            type: 'crop',
            name: 'Rice (Oryza sativa)',
            confidence: 0.85
          }
        ],
        recommendations: [
          'Continue regular irrigation to maintain 2-5 cm water level',
          'Apply nitrogen fertilizer for tillering stage',
          'Monitor for brown plant hopper and stem borer',
          'Ensure proper spacing between plants'
        ]
      };

    case 'pest_identification':
      return {
        analysis: 'Small green insects detected on leaf undersides, consistent with aphid infestation. Leaf curling and yellowing visible.',
        confidence: 0.78,
        detectedObjects: [
          {
            type: 'pest',
            name: 'Green Aphids',
            confidence: 0.78
          }
        ],
        recommendations: [
          'Spray neem oil solution (5ml per liter)',
          'Introduce ladybugs as biological control',
          'Remove heavily infested leaves',
          'Avoid excessive nitrogen fertilization',
          'Monitor weekly for population changes'
        ]
      };

    case 'disease_diagnosis':
      return {
        analysis: 'Brown spots with yellow halos on leaves suggest bacterial leaf blight. Water-soaked lesions visible along leaf margins.',
        confidence: 0.72,
        detectedObjects: [
          {
            type: 'disease',
            name: 'Bacterial Leaf Blight',
            confidence: 0.72
          }
        ],
        recommendations: [
          'Remove and destroy affected leaves',
          'Apply copper-based bactericide',
          'Improve field drainage',
          'Avoid overhead irrigation',
          'Use resistant varieties in next season'
        ]
      };

    case 'soil_analysis':
      return {
        analysis: 'Soil shows good structure with adequate organic matter. Dark color indicates good fertility, but texture analysis suggests clay content.',
        confidence: 0.68,
        detectedObjects: [
          {
            type: 'soil',
            name: 'Clay loam soil with good organic content',
            confidence: 0.68
          }
        ],
        recommendations: [
          'Test soil pH and nutrient levels',
          'Add organic compost to improve structure',
          'Ensure proper drainage for clay soils',
          'Consider raised bed cultivation',
          'Test for micronutrient deficiencies'
        ]
      };

    default:
      return {
        analysis: 'Image processed successfully.',
        confidence: 0.5,
        detectedObjects: [],
        recommendations: ['Please specify the type of analysis needed']
      };
  }
}

export default ImageUpload;