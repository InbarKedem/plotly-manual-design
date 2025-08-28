// =============================================================================
// VALIDATION UTILITIES
// =============================================================================
// Runtime validation and error handling for plotter components

import type {
  SeriesConfig,
  PlotConfig,
  InteractionConfig,
} from "../types/PlotterTypes";

export interface ValidationError {
  type: "error" | "warning" | "info";
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  infos: ValidationError[];
}

/**
 * Validate series configuration
 */
export const validateSeriesConfig = (
  series: SeriesConfig[]
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const infos: ValidationError[] = [];

  if (!Array.isArray(series)) {
    errors.push({
      type: "error",
      field: "series",
      message: "Series must be an array",
      code: "INVALID_SERIES_TYPE",
    });
    return { isValid: false, errors, warnings, infos };
  }

  if (series.length === 0) {
    errors.push({
      type: "error",
      field: "series",
      message: "At least one series is required",
      code: "EMPTY_SERIES",
    });
  }

  series.forEach((s, index) => {
    const prefix = `series[${index}]`;

    // Required fields
    if (!s.data || !Array.isArray(s.data)) {
      errors.push({
        type: "error",
        field: `${prefix}.data`,
        message: "Series data must be an array",
        code: "INVALID_DATA_TYPE",
      });
    } else if (s.data.length === 0) {
      errors.push({
        type: "error",
        field: `${prefix}.data`,
        message: "Series data cannot be empty",
        code: "EMPTY_DATA",
      });
    }

    // Performance warnings
    if (s.data && s.data.length > 50000) {
      warnings.push({
        type: "warning",
        field: `${prefix}.data`,
        message: `Large dataset (${s.data.length} points) may impact performance`,
        code: "LARGE_DATASET",
      });
    }

    // Name validation
    if (!s.name || typeof s.name !== "string") {
      warnings.push({
        type: "warning",
        field: `${prefix}.name`,
        message: "Series should have a descriptive name",
        code: "MISSING_NAME",
      });
    }

    // Type validation
    const validTypes = ["scatter", "bar", "line"];
    if (s.type && !validTypes.includes(s.type)) {
      warnings.push({
        type: "warning",
        field: `${prefix}.type`,
        message: `Unknown plot type: ${s.type}. Valid types: ${validTypes.join(
          ", "
        )}`,
        code: "UNKNOWN_PLOT_TYPE",
      });
    }

    // Data point validation
    if (s.data && s.data.length > 0) {
      const firstPoint = s.data[0];
      if (
        typeof firstPoint.x !== "number" ||
        typeof firstPoint.y !== "number"
      ) {
        errors.push({
          type: "error",
          field: `${prefix}.data[0]`,
          message: "Data points must have numeric x and y values",
          code: "INVALID_DATA_POINT",
        });
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    infos,
  };
};

/**
 * Validate plot configuration
 */
export const validatePlotConfig = (
  config: Partial<PlotConfig> = {}
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const infos: ValidationError[] = [];

  // Width validation
  if (config.width) {
    if (
      typeof config.width === "string" &&
      !config.width.match(/^\d+(%|px)$|^100%$/)
    ) {
      warnings.push({
        type: "warning",
        field: "config.width",
        message: 'Width should be a valid CSS value (e.g., "100%", "500px")',
        code: "INVALID_WIDTH_FORMAT",
      });
    }
  }

  // Height validation
  if (config.height) {
    if (
      typeof config.height === "string" &&
      !config.height.match(/^\d+(px|em|rem)$/)
    ) {
      warnings.push({
        type: "warning",
        field: "config.height",
        message: 'Height should be a valid CSS value (e.g., "500px", "50em")',
        code: "INVALID_HEIGHT_FORMAT",
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    infos,
  };
};

/**
 * Validate interaction configuration
 */
export const validateInteractionConfig = (
  interactions: Partial<InteractionConfig> = {}
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const infos: ValidationError[] = [];

  // Hover mode validation
  if (interactions.hovermode) {
    const validHoverModes = [
      "x",
      "y",
      "closest",
      "x unified",
      "y unified",
      false,
    ];
    if (!validHoverModes.includes(interactions.hovermode)) {
      warnings.push({
        type: "warning",
        field: "interactions.hovermode",
        message: `Unknown hover mode: ${interactions.hovermode}`,
        code: "INVALID_HOVER_MODE",
      });
    }
  }

  // Opacity validation
  if (interactions.dimmedOpacity !== undefined) {
    if (interactions.dimmedOpacity < 0 || interactions.dimmedOpacity > 1) {
      errors.push({
        type: "error",
        field: "interactions.dimmedOpacity",
        message: "Dimmed opacity must be between 0 and 1",
        code: "INVALID_OPACITY_RANGE",
      });
    }
  }

  if (interactions.highlightOpacity !== undefined) {
    if (
      interactions.highlightOpacity < 0 ||
      interactions.highlightOpacity > 1
    ) {
      errors.push({
        type: "error",
        field: "interactions.highlightOpacity",
        message: "Highlight opacity must be between 0 and 1",
        code: "INVALID_OPACITY_RANGE",
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    infos,
  };
};

/**
 * Comprehensive validation for all plotter inputs
 */
export const validatePlotterInputs = (
  series: SeriesConfig[],
  config?: Partial<PlotConfig>,
  interactions?: Partial<InteractionConfig>
): ValidationResult => {
  const seriesResult = validateSeriesConfig(series);
  const configResult = validatePlotConfig(config);
  const interactionsResult = validateInteractionConfig(interactions);

  return {
    isValid:
      seriesResult.isValid &&
      configResult.isValid &&
      interactionsResult.isValid,
    errors: [
      ...seriesResult.errors,
      ...configResult.errors,
      ...interactionsResult.errors,
    ],
    warnings: [
      ...seriesResult.warnings,
      ...configResult.warnings,
      ...interactionsResult.warnings,
    ],
    infos: [
      ...seriesResult.infos,
      ...configResult.infos,
      ...interactionsResult.infos,
    ],
  };
};
