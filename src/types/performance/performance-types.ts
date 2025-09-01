// =============================================================================
// ⚡ PERFORMANCE TYPES
// =============================================================================
// Performance monitoring and optimization type definitions

/**
 * Performance configuration for large datasets
 */
export interface PerformanceConfig {
  /** Enable performance optimizations */
  enabled: boolean;
  /** Threshold for enabling virtualization */
  virtualizationThreshold: number;
  /** Maximum points to render at once */
  maxRenderPoints: number;
  /** Enable web workers for data processing */
  useWebWorkers: boolean;
  /** Debounce delay for interactions (ms) */
  debounceMs: number;
}

/**
 * Performance metrics tracking
 */
export interface PerformanceMetrics {
  /** Render time in milliseconds */
  renderTime?: number;
  /** Data processing time in milliseconds */
  dataProcessingTime?: number;
  /** Memory usage estimation in MB */
  memoryUsage?: number;
  /** Number of rendered points */
  renderedPoints?: number;
  /** Frame rate during interactions */
  frameRate?: number;
  /** Last updated timestamp */
  lastUpdated?: number;
}

/**
 * Accessibility configuration for inclusive design
 */
export interface AccessibilityConfig {
  /** Enable screen reader support */
  screenReaderSupport: boolean;
  /** Enable keyboard navigation */
  keyboardNavigation: boolean;
  /** High contrast mode for visual accessibility */
  highContrast: boolean;
  /** Enable focus indicators */
  focusIndicators: boolean;
  /** Alternative text descriptions */
  altText?: string;
  /** ARIA labels for interactive elements */
  ariaLabels?: Record<string, string>;
}

/**
 * Input validation configuration
 */
export interface ValidationConfig {
  /** Whether validation is enabled (default: true) */
  enabled?: boolean;
  /** Whether to throw errors on validation failure */
  throwOnError?: boolean;
  /** Whether to show validation warnings */
  showWarnings?: boolean;
  /** Custom validation rules */
  customRules?: ValidationRule[];
}

/**
 * Custom validation rule definition
 */
export interface ValidationRule {
  /** Rule name for identification */
  name: string;
  /** Validation function that returns true if valid */
  validate: (data: Record<string, unknown>) => boolean;
  /** Error message when validation fails */
  errorMessage: string;
  /** Warning message for non-critical issues */
  warningMessage?: string;
}
