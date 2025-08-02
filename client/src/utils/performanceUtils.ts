// Utilities for performance monitoring and optimization

import { trackEvent, EventCategory, EventAction } from './analyticsUtils';
import { logError, ErrorCategory, ErrorSeverity } from './errorUtils';

// Local storage keys
const PERFORMANCE_METRICS_STORAGE_KEY = 'krishimitra_performance_metrics';

// Performance metric types
export enum MetricType {
  PAGE_LOAD = 'page_load',
  COMPONENT_RENDER = 'component_render',
  API_CALL = 'api_call',
  RESOURCE_LOAD = 'resource_load',
  INTERACTION = 'interaction',
  MEMORY = 'memory',
  CUSTOM = 'custom',
}

// Performance metric interface
export interface PerformanceMetric {
  id: string;
  type: MetricType;
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

// Performance budget interface
export interface PerformanceBudget {
  type: MetricType;
  name: string;
  threshold: number;
  critical: boolean;
}

// Default performance budgets
const DEFAULT_PERFORMANCE_BUDGETS: PerformanceBudget[] = [
  { type: MetricType.PAGE_LOAD, name: 'ttfb', threshold: 800, critical: true },
  { type: MetricType.PAGE_LOAD, name: 'fcp', threshold: 1800, critical: true },
  { type: MetricType.PAGE_LOAD, name: 'lcp', threshold: 2500, critical: true },
  { type: MetricType.PAGE_LOAD, name: 'fid', threshold: 100, critical: true },
  { type: MetricType.PAGE_LOAD, name: 'cls', threshold: 0.1, critical: true },
  { type: MetricType.COMPONENT_RENDER, name: 'any', threshold: 50, critical: false },
  { type: MetricType.API_CALL, name: 'any', threshold: 2000, critical: false },
];

// Current performance budgets
let performanceBudgets = [...DEFAULT_PERFORMANCE_BUDGETS];

/**
 * Get stored performance metrics
 * @returns Array of performance metrics
 */
export const getPerformanceMetrics = (): PerformanceMetric[] => {
  try {
    const metricsString = localStorage.getItem(PERFORMANCE_METRICS_STORAGE_KEY);
    if (metricsString) {
      return JSON.parse(metricsString);
    }
  } catch (error) {
    logError({
      message: 'Failed to get performance metrics from local storage',
      error: error as Error,
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.WARNING,
    });
  }
  
  return [];
};

/**
 * Save performance metrics to local storage
 * @param metrics The metrics to save
 */
export const savePerformanceMetrics = (metrics: PerformanceMetric[]): void => {
  try {
    // Limit the number of stored metrics to prevent excessive storage usage
    const limitedMetrics = metrics.slice(-100);
    localStorage.setItem(PERFORMANCE_METRICS_STORAGE_KEY, JSON.stringify(limitedMetrics));
  } catch (error) {
    logError({
      message: 'Failed to save performance metrics to local storage',
      error: error as Error,
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.WARNING,
    });
  }
};

/**
 * Add a performance metric
 * @param metric The metric to add
 */
export const addPerformanceMetric = (metric: Omit<PerformanceMetric, 'id' | 'timestamp'>): void => {
  try {
    const metrics = getPerformanceMetrics();
    
    const newMetric: PerformanceMetric = {
      ...metric,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    
    metrics.push(newMetric);
    savePerformanceMetrics(metrics);
    
    // Check if the metric exceeds the budget
    checkPerformanceBudget(newMetric);
    
    // Track the metric in analytics
    trackEvent({
      category: EventCategory.PERFORMANCE,
      action: EventAction.PERFORMANCE_METRIC,
      label: `${metric.type}:${metric.name}`,
      value: Math.round(metric.value),
    });
  } catch (error) {
    logError({
      message: 'Failed to add performance metric',
      error: error as Error,
      category: ErrorCategory.PERFORMANCE,
      severity: ErrorSeverity.WARNING,
      context: { metric },
    });
  }
};

/**
 * Clear all performance metrics
 */
export const clearPerformanceMetrics = (): void => {
  try {
    localStorage.removeItem(PERFORMANCE_METRICS_STORAGE_KEY);
  } catch (error) {
    logError({
      message: 'Failed to clear performance metrics',
      error: error as Error,
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.WARNING,
    });
  }
};

/**
 * Set custom performance budgets
 * @param budgets The performance budgets to set
 */
export const setPerformanceBudgets = (budgets: PerformanceBudget[]): void => {
  performanceBudgets = budgets;
};

/**
 * Reset performance budgets to defaults
 */
export const resetPerformanceBudgets = (): void => {
  performanceBudgets = [...DEFAULT_PERFORMANCE_BUDGETS];
};

/**
 * Check if a metric exceeds its performance budget
 * @param metric The metric to check
 * @returns Whether the metric exceeds its budget
 */
export const checkPerformanceBudget = (metric: PerformanceMetric): boolean => {
  // Find matching budget
  const matchingBudget = performanceBudgets.find(budget => 
    budget.type === metric.type && (budget.name === metric.name || budget.name === 'any')
  );
  
  if (matchingBudget && metric.value > matchingBudget.threshold) {
    // Log the budget violation
    logError({
      message: `Performance budget exceeded: ${metric.type}:${metric.name}`,
      category: ErrorCategory.PERFORMANCE,
      severity: matchingBudget.critical ? ErrorSeverity.ERROR : ErrorSeverity.WARNING,
      context: { metric, budget: matchingBudget },
    });
    
    // Track the budget violation
    trackEvent({
      category: EventCategory.PERFORMANCE,
      action: EventAction.PERFORMANCE_BUDGET_EXCEEDED,
      label: `${metric.type}:${metric.name}`,
      value: Math.round(metric.value),
    });
    
    return true;
  }
  
  return false;
};

/**
 * Measure the execution time of a function
 * @param fn The function to measure
 * @param metricName The name of the metric
 * @param metricType The type of the metric
 * @param metadata Additional metadata for the metric
 * @returns The result of the function
 */
export const measureExecutionTime = async<T>(
  fn: () => Promise<T> | T,
  metricName: string,
  metricType: MetricType = MetricType.CUSTOM,
  metadata?: Record<string, any>
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await fn();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Add the performance metric
    addPerformanceMetric({
      type: metricType,
      name: metricName,
      value: duration,
      metadata,
    });
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Add the performance metric with error flag
    addPerformanceMetric({
      type: metricType,
      name: metricName,
      value: duration,
      metadata: { ...metadata, error: true },
    });
    
    throw error;
  }
};

/**
 * Create a higher-order component that measures render time
 * @param Component The component to measure
 * @param componentName The name of the component
 * @returns The wrapped component
 */
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.FC<P> => {
  const WrappedComponent: React.FC<P> = (props) => {
    const renderStartTime = performance.now();
    
    React.useEffect(() => {
      const renderEndTime = performance.now();
      const renderDuration = renderEndTime - renderStartTime;
      
      // Add the performance metric
      addPerformanceMetric({
        type: MetricType.COMPONENT_RENDER,
        name: componentName,
        value: renderDuration,
        metadata: { props },
      });
    }, []);
    
    return <Component {...props} />;
  };
  
  WrappedComponent.displayName = `WithPerformanceTracking(${componentName})`;
  
  return WrappedComponent;
};

/**
 * Measure Web Vitals metrics
 */
export const measureWebVitals = (): void => {
  try {
    if ('web-vitals' in window) {
      const webVitals = (window as any)['web-vitals'];
      
      // First Contentful Paint
      webVitals.getFCP(({ value }: { value: number }) => {
        addPerformanceMetric({
          type: MetricType.PAGE_LOAD,
          name: 'fcp',
          value,
        });
      });
      
      // Largest Contentful Paint
      webVitals.getLCP(({ value }: { value: number }) => {
        addPerformanceMetric({
          type: MetricType.PAGE_LOAD,
          name: 'lcp',
          value,
        });
      });
      
      // First Input Delay
      webVitals.getFID(({ value }: { value: number }) => {
        addPerformanceMetric({
          type: MetricType.PAGE_LOAD,
          name: 'fid',
          value,
        });
      });
      
      // Cumulative Layout Shift
      webVitals.getCLS(({ value }: { value: number }) => {
        addPerformanceMetric({
          type: MetricType.PAGE_LOAD,
          name: 'cls',
          value,
        });
      });
      
      // Time to First Byte
      webVitals.getTTFB(({ value }: { value: number }) => {
        addPerformanceMetric({
          type: MetricType.PAGE_LOAD,
          name: 'ttfb',
          value,
        });
      });
    } else {
      // Fallback to Performance API for basic metrics
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        
        // Time to First Byte
        const ttfb = timing.responseStart - timing.navigationStart;
        addPerformanceMetric({
          type: MetricType.PAGE_LOAD,
          name: 'ttfb',
          value: ttfb,
        });
        
        // DOM Content Loaded
        const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
        addPerformanceMetric({
          type: MetricType.PAGE_LOAD,
          name: 'dom_content_loaded',
          value: domContentLoaded,
        });
        
        // Load Event
        const loadEvent = timing.loadEventEnd - timing.navigationStart;
        addPerformanceMetric({
          type: MetricType.PAGE_LOAD,
          name: 'load_event',
          value: loadEvent,
        });
      }
    }
  } catch (error) {
    logError({
      message: 'Failed to measure Web Vitals',
      error: error as Error,
      category: ErrorCategory.PERFORMANCE,
      severity: ErrorSeverity.WARNING,
    });
  }
};

/**
 * Measure memory usage
 */
export const measureMemoryUsage = (): void => {
  try {
    if (window.performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      
      addPerformanceMetric({
        type: MetricType.MEMORY,
        name: 'used_js_heap_size',
        value: memory.usedJSHeapSize / (1024 * 1024), // Convert to MB
        metadata: {
          totalJSHeapSize: memory.totalJSHeapSize / (1024 * 1024),
          jsHeapSizeLimit: memory.jsHeapSizeLimit / (1024 * 1024),
        },
      });
    }
  } catch (error) {
    // Memory API is non-standard and may not be available in all browsers
    console.debug('Memory API not available');
  }
};

/**
 * Measure resource loading performance
 */
export const measureResourceLoading = (): void => {
  try {
    if (window.performance && performance.getEntriesByType) {
      // Get resource timing entries
      const resources = performance.getEntriesByType('resource');
      
      resources.forEach(resource => {
        const { name, initiatorType, startTime, responseEnd, transferSize, encodedBodySize } = resource as PerformanceResourceTiming;
        
        // Skip tracking of analytics and tracking resources
        if (name.includes('analytics') || name.includes('tracking') || name.includes('beacon')) {
          return;
        }
        
        addPerformanceMetric({
          type: MetricType.RESOURCE_LOAD,
          name: initiatorType,
          value: responseEnd - startTime,
          metadata: {
            url: name,
            transferSize,
            encodedBodySize,
            compressionRatio: transferSize > 0 ? encodedBodySize / transferSize : 0,
          },
        });
      });
      
      // Clear the resource timings to prevent memory growth
      performance.clearResourceTimings();
    }
  } catch (error) {
    logError({
      message: 'Failed to measure resource loading',
      error: error as Error,
      category: ErrorCategory.PERFORMANCE,
      severity: ErrorSeverity.WARNING,
    });
  }
};

/**
 * Optimize image loading
 * @param imageUrl The URL of the image to load
 * @param options Options for image loading
 * @returns Promise that resolves with the image element
 */
export const optimizeImageLoading = (
  imageUrl: string,
  options: {
    width?: number;
    height?: number;
    lazy?: boolean;
    priority?: boolean;
    alt?: string;
  } = {}
): HTMLImageElement => {
  const img = new Image();
  
  if (options.width) {
    img.width = options.width;
  }
  
  if (options.height) {
    img.height = options.height;
  }
  
  if (options.alt) {
    img.alt = options.alt;
  }
  
  if (options.lazy && 'loading' in HTMLImageElement.prototype) {
    img.loading = 'lazy';
  }
  
  if (options.priority) {
    img.fetchPriority = 'high';
  }
  
  // Add decoding attribute for better performance
  img.decoding = 'async';
  
  // Track image loading performance
  const startTime = performance.now();
  
  img.onload = () => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    addPerformanceMetric({
      type: MetricType.RESOURCE_LOAD,
      name: 'image',
      value: loadTime,
      metadata: {
        url: imageUrl,
        width: img.width,
        height: img.height,
      },
    });
  };
  
  img.onerror = () => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    addPerformanceMetric({
      type: MetricType.RESOURCE_LOAD,
      name: 'image_error',
      value: loadTime,
      metadata: {
        url: imageUrl,
      },
    });
  };
  
  img.src = imageUrl;
  
  return img;
};

/**
 * Debounce a function to improve performance
 * @param fn The function to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
    
    timeoutId = window.setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

/**
 * Throttle a function to improve performance
 * @param fn The function to throttle
 * @param limit The time limit in milliseconds
 * @returns The throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return function(...args: Parameters<T>) {
    const now = Date.now();
    
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
};

/**
 * Initialize performance monitoring
 */
export const initPerformanceMonitoring = (): void => {
  // Measure Web Vitals
  measureWebVitals();
  
  // Set up periodic memory usage measurement
  const memoryInterval = setInterval(() => {
    measureMemoryUsage();
  }, 30000); // Every 30 seconds
  
  // Measure resource loading after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      measureResourceLoading();
    }, 3000); // Wait for 3 seconds after load to capture most resources
  });
  
  // Set up periodic resource measurement
  const resourceInterval = setInterval(() => {
    measureResourceLoading();
  }, 60000); // Every minute
  
  // Clean up intervals on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(memoryInterval);
    clearInterval(resourceInterval);
  });
  
  // Track long tasks
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const longTaskEntry = entry as PerformanceLongTaskTiming;
          
          addPerformanceMetric({
            type: MetricType.INTERACTION,
            name: 'long_task',
            value: longTaskEntry.duration,
            metadata: {
              startTime: longTaskEntry.startTime,
              attribution: longTaskEntry.attribution?.map(attr => attr.name) || [],
            },
          });
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      console.debug('Long Task API not supported');
    }
  }
};