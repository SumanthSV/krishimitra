// Utilities for image handling and optimization

/**
 * Interface for image dimensions
 */
export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Get the dimensions of an image
 * @param src The image source URL
 * @returns A promise that resolves to the image dimensions
 */
export const getImageDimensions = (src: string): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = src;
  });
};

/**
 * Calculate the aspect ratio of an image
 * @param width The image width
 * @param height The image height
 * @returns The aspect ratio (width / height)
 */
export const calculateAspectRatio = (width: number, height: number): number => {
  return width / height;
};

/**
 * Resize an image to fit within maximum dimensions while maintaining aspect ratio
 * @param originalWidth The original image width
 * @param originalHeight The original image height
 * @param maxWidth The maximum width
 * @param maxHeight The maximum height
 * @returns The new dimensions
 */
export const resizeToFit = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): ImageDimensions => {
  const aspectRatio = calculateAspectRatio(originalWidth, originalHeight);
  
  let newWidth = originalWidth;
  let newHeight = originalHeight;
  
  if (newWidth > maxWidth) {
    newWidth = maxWidth;
    newHeight = newWidth / aspectRatio;
  }
  
  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = newHeight * aspectRatio;
  }
  
  return {
    width: Math.round(newWidth),
    height: Math.round(newHeight),
  };
};

/**
 * Resize an image to cover a container while maintaining aspect ratio
 * @param originalWidth The original image width
 * @param originalHeight The original image height
 * @param containerWidth The container width
 * @param containerHeight The container height
 * @returns The new dimensions
 */
export const resizeToCover = (
  originalWidth: number,
  originalHeight: number,
  containerWidth: number,
  containerHeight: number
): ImageDimensions => {
  const aspectRatio = calculateAspectRatio(originalWidth, originalHeight);
  const containerAspectRatio = calculateAspectRatio(containerWidth, containerHeight);
  
  let newWidth = containerWidth;
  let newHeight = containerHeight;
  
  if (containerAspectRatio > aspectRatio) {
    // Container is wider than the image
    newHeight = containerHeight;
    newWidth = newHeight * aspectRatio;
  } else {
    // Container is taller than the image
    newWidth = containerWidth;
    newHeight = newWidth / aspectRatio;
  }
  
  return {
    width: Math.round(newWidth),
    height: Math.round(newHeight),
  };
};

/**
 * Generate a placeholder color based on a string
 * @param input The input string
 * @returns A CSS color string
 */
export const generatePlaceholderColor = (input: string): string => {
  // Simple hash function to generate a number from a string
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert the hash to a color
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 80%)`;
};

/**
 * Generate a placeholder image URL with specified dimensions and text
 * @param width The image width
 * @param height The image height
 * @param text The text to display on the placeholder
 * @returns The placeholder image URL
 */
export const generatePlaceholderUrl = (
  width: number,
  height: number,
  text: string = 'Image'
): string => {
  // In a real app, you might use a service like placeholder.com
  // For this demo, we'll return a data URL with a colored rectangle
  const color = generatePlaceholderColor(text);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }
  
  // Draw background
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  // Draw text
  ctx.fillStyle = '#000000';
  ctx.font = `${Math.max(16, Math.min(width, height) / 10)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  return canvas.toDataURL('image/png');
};

/**
 * Convert a File or Blob to a data URL
 * @param file The file or blob to convert
 * @returns A promise that resolves to the data URL
 */
export const fileToDataUrl = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Convert a data URL to a Blob
 * @param dataUrl The data URL to convert
 * @returns The blob
 */
export const dataUrlToBlob = (dataUrl: string): Blob => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};

/**
 * Compress an image to a specified file size
 * @param file The image file to compress
 * @param maxSizeKB The maximum file size in kilobytes
 * @param maxWidth The maximum width (optional)
 * @param maxHeight The maximum height (optional)
 * @returns A promise that resolves to the compressed image as a Blob
 */
export const compressImage = async (
  file: File,
  maxSizeKB: number,
  maxWidth?: number,
  maxHeight?: number
): Promise<Blob> => {
  // Convert the file to a data URL
  const dataUrl = await fileToDataUrl(file);
  
  // Create an image element
  const img = document.createElement('img');
  img.src = dataUrl;
  
  // Wait for the image to load
  await new Promise((resolve) => {
    img.onload = resolve;
  });
  
  // Calculate dimensions
  let width = img.naturalWidth;
  let height = img.naturalHeight;
  
  if (maxWidth && maxHeight) {
    const resized = resizeToFit(width, height, maxWidth, maxHeight);
    width = resized.width;
    height = resized.height;
  }
  
  // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  // Draw the image on the canvas
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  ctx.drawImage(img, 0, 0, width, height);
  
  // Start with high quality
  let quality = 0.9;
  let blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b as Blob), file.type, quality);
  });
  
  // Reduce quality until the file size is below the maximum
  while (blob.size > maxSizeKB * 1024 && quality > 0.1) {
    quality -= 0.1;
    blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b as Blob), file.type, quality);
    });
  }
  
  return blob;
};

/**
 * Crop an image
 * @param file The image file to crop
 * @param cropX The x-coordinate of the crop area
 * @param cropY The y-coordinate of the crop area
 * @param cropWidth The width of the crop area
 * @param cropHeight The height of the crop area
 * @returns A promise that resolves to the cropped image as a Blob
 */
export const cropImage = async (
  file: File,
  cropX: number,
  cropY: number,
  cropWidth: number,
  cropHeight: number
): Promise<Blob> => {
  // Convert the file to a data URL
  const dataUrl = await fileToDataUrl(file);
  
  // Create an image element
  const img = document.createElement('img');
  img.src = dataUrl;
  
  // Wait for the image to load
  await new Promise((resolve) => {
    img.onload = resolve;
  });
  
  // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.width = cropWidth;
  canvas.height = cropHeight;
  
  // Draw the cropped image on the canvas
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
  
  // Convert the canvas to a blob
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b as Blob), file.type);
  });
  
  return blob;
};

/**
 * Apply a filter to an image
 * @param file The image file to filter
 * @param filter The filter to apply (e.g., 'grayscale', 'sepia', 'blur')
 * @param value The filter value (e.g., amount of blur)
 * @returns A promise that resolves to the filtered image as a Blob
 */
export const applyImageFilter = async (
  file: File,
  filter: 'grayscale' | 'sepia' | 'blur' | 'brightness' | 'contrast' | 'saturate',
  value: number
): Promise<Blob> => {
  // Convert the file to a data URL
  const dataUrl = await fileToDataUrl(file);
  
  // Create an image element
  const img = document.createElement('img');
  img.src = dataUrl;
  
  // Wait for the image to load
  await new Promise((resolve) => {
    img.onload = resolve;
  });
  
  // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  
  // Draw the image on the canvas
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  // Apply the filter
  switch (filter) {
    case 'grayscale':
      ctx.filter = `grayscale(${value})`;
      break;
    case 'sepia':
      ctx.filter = `sepia(${value})`;
      break;
    case 'blur':
      ctx.filter = `blur(${value}px)`;
      break;
    case 'brightness':
      ctx.filter = `brightness(${value})`;
      break;
    case 'contrast':
      ctx.filter = `contrast(${value})`;
      break;
    case 'saturate':
      ctx.filter = `saturate(${value})`;
      break;
  }
  
  ctx.drawImage(img, 0, 0);
  
  // Convert the canvas to a blob
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b as Blob), file.type);
  });
  
  return blob;
};

/**
 * Get the dominant color of an image
 * @param src The image source URL
 * @returns A promise that resolves to the dominant color as a hex string
 */
export const getDominantColor = async (src: string): Promise<string> => {
  // Create an image element
  const img = document.createElement('img');
  img.crossOrigin = 'Anonymous'; // To avoid CORS issues
  img.src = src;
  
  // Wait for the image to load
  await new Promise((resolve) => {
    img.onload = resolve;
  });
  
  // Create a small canvas to sample the image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  // Use a small size for performance
  const size = 10;
  canvas.width = size;
  canvas.height = size;
  
  // Draw the image on the canvas
  ctx.drawImage(img, 0, 0, size, size);
  
  // Get the pixel data
  const data = ctx.getImageData(0, 0, size, size).data;
  
  // Calculate the average color
  let r = 0, g = 0, b = 0;
  let count = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }
  
  r = Math.round(r / count);
  g = Math.round(g / count);
  b = Math.round(b / count);
  
  // Convert to hex
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

/**
 * Check if an image exists at a URL
 * @param url The image URL to check
 * @returns A promise that resolves to true if the image exists, false otherwise
 */
export const imageExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Get a fallback image URL if the primary URL is not available
 * @param primaryUrl The primary image URL
 * @param fallbackUrl The fallback image URL
 * @returns A promise that resolves to the available image URL
 */
export const getImageWithFallback = async (
  primaryUrl: string,
  fallbackUrl: string
): Promise<string> => {
  const exists = await imageExists(primaryUrl);
  return exists ? primaryUrl : fallbackUrl;
};

/**
 * Get a weather icon URL based on the weather code
 * @param weatherCode The weather code
 * @param isDay Whether it's daytime
 * @returns The weather icon URL
 */
export const getWeatherIconUrl = (weatherCode: string, isDay: boolean = true): string => {
  // This is a simplified implementation
  // In a real app, you would map weather codes to appropriate icons
  
  const baseUrl = '/assets/weather-icons/';
  const timeOfDay = isDay ? 'day' : 'night';
  
  // Map weather codes to icon names
  const iconMap: Record<string, string> = {
    '01': 'clear',
    '02': 'few-clouds',
    '03': 'scattered-clouds',
    '04': 'broken-clouds',
    '09': 'shower-rain',
    '10': 'rain',
    '11': 'thunderstorm',
    '13': 'snow',
    '50': 'mist',
  };
  
  const iconName = iconMap[weatherCode] || 'unknown';
  return `${baseUrl}${iconName}-${timeOfDay}.svg`;
};

/**
 * Get a crop icon URL based on the crop name
 * @param cropName The crop name
 * @returns The crop icon URL
 */
export const getCropIconUrl = (cropName: string): string => {
  // This is a simplified implementation
  // In a real app, you would have a mapping of crop names to icons
  
  const baseUrl = '/assets/crop-icons/';
  const sanitizedName = cropName.toLowerCase().replace(/\s+/g, '-');
  
  return `${baseUrl}${sanitizedName}.svg`;
};