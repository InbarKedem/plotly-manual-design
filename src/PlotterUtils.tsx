// =============================================================================
// DATA GENERATORS & UTILITIES
// =============================================================================

export interface DataGeneratorOptions {
  count: number;
  xRange?: [number, number];
  yRange?: [number, number];
  zRange?: [number, number];
  addNoise?: boolean;
  noiseLevel?: number;
  pattern?:
    | "linear"
    | "sine"
    | "cosine"
    | "exponential"
    | "logarithmic"
    | "random";
  seed?: number;
}

// Simple seeded random number generator for consistent results
class SeededRandom {
  private seed: number;

  constructor(seed: number = 12345) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

// Generate synthetic data with various patterns
export const generateData = (name: string, options: DataGeneratorOptions) => {
  const {
    count,
    xRange = [0, 100],
    yRange = [0, 100],
    zRange = [0, 50],
    addNoise = true,
    noiseLevel = 0.1,
    pattern = "linear",
    seed = 12345,
  } = options;

  const random = new SeededRandom(seed);
  const data = [];

  for (let i = 0; i < count; i++) {
    const progress = i / (count - 1);
    let x = xRange[0] + progress * (xRange[1] - xRange[0]);
    let y: number;
    let z: number;

    // Generate y based on pattern
    switch (pattern) {
      case "linear":
        y = yRange[0] + progress * (yRange[1] - yRange[0]);
        break;
      case "sine":
        y =
          yRange[0] +
          (yRange[1] - yRange[0]) *
            (0.5 + 0.5 * Math.sin(progress * Math.PI * 4));
        break;
      case "cosine":
        y =
          yRange[0] +
          (yRange[1] - yRange[0]) *
            (0.5 + 0.5 * Math.cos(progress * Math.PI * 4));
        break;
      case "exponential":
        y = yRange[0] + (yRange[1] - yRange[0]) * Math.pow(progress, 2);
        break;
      case "logarithmic":
        y =
          yRange[0] +
          ((yRange[1] - yRange[0]) * Math.log(1 + progress * (Math.E - 1))) /
            Math.log(Math.E);
        break;
      default:
        y = yRange[0] + random.next() * (yRange[1] - yRange[0]);
    }

    // Generate z value
    z = zRange[0] + progress * (zRange[1] - zRange[0]);

    // Add noise if requested
    if (addNoise) {
      const noise = (random.next() - 0.5) * 2 * noiseLevel;
      y += (yRange[1] - yRange[0]) * noise;
      z += (zRange[1] - zRange[0]) * noise * 0.5;
    }

    data.push({
      x,
      y,
      z,
      text: `${name} Point ${i + 1}`,
      error_x: addNoise ? Math.abs(y) * 0.05 : undefined,
      error_y: addNoise ? Math.abs(y) * 0.05 : undefined,
    });
  }

  return data;
};

// Climate data generator (atmospheric temperature vs altitude)
export const generateClimateData = (count: number = 100) => {
  return generateData("Climate", {
    count,
    xRange: [0, 8000], // Altitude in meters
    yRange: [15, 3], // Temperature decreases with altitude
    zRange: [30, 100], // Speed in km/h
    addNoise: true,
    noiseLevel: 0.15,
    pattern: "linear",
    seed: 42,
  }).map((point, i) => ({
    ...point,
    // More realistic temperature model
    y:
      20 - point.x * 0.0065 + Math.sin(i * 0.1) * 2 + (Math.random() - 0.5) * 3,
    speed: point.z,
    temperature: 20 - point.x * 0.0065,
    altitude: point.x,
    fuelConsumption: 3 + point.z * 0.02 + Math.random() * 1.5, // L/100km
  }));
};

// Fuel consumption data generator
export const generateFuelData = (count: number = 200) => {
  return generateData("Fuel", {
    count,
    xRange: [0, 8000], // Altitude/distance
    yRange: [2, 12], // Fuel consumption L/100km
    zRange: [20, 120], // Speed km/h
    addNoise: true,
    noiseLevel: 0.2,
    pattern: "exponential",
    seed: 123,
  }).map((point, i) => ({
    ...point,
    speed: point.z,
    fuelConsumption: point.y,
    altitude: point.x,
    temperature: 25 - point.x * 0.006 + Math.sin(i * 0.05) * 5,
  }));
};

// Scientific measurement data generator
export const generateScientificData = (count: number = 500) => {
  return generateData("Scientific", {
    count,
    xRange: [0, 100], // Time or measurement index
    yRange: [-50, 50], // Measurement values
    zRange: [0, 100], // Secondary measurement
    addNoise: true,
    noiseLevel: 0.1,
    pattern: "sine",
    seed: 789,
  }).map((point, i) => ({
    ...point,
    time: point.x,
    amplitude: point.y,
    frequency: point.z,
    phase: Math.sin(i * 0.1) * Math.PI,
  }));
};

// Large dataset generator for performance testing
export const generateLargeDataset = (count: number = 5000) => {
  return generateData("Large Dataset", {
    count,
    xRange: [0, 1000],
    yRange: [-100, 100],
    zRange: [0, 200],
    addNoise: true,
    noiseLevel: 0.05,
    pattern: "random",
    seed: 999,
  });
};

// Multi-series data generator
export const generateMultiSeriesData = (
  seriesCount: number = 3,
  pointsPerSeries: number = 100
) => {
  const patterns = [
    "linear",
    "sine",
    "cosine",
    "exponential",
    "logarithmic",
  ] as const;
  const series = [];

  for (let i = 0; i < seriesCount; i++) {
    const pattern = patterns[i % patterns.length];
    const data = generateData(`Series ${i + 1}`, {
      count: pointsPerSeries,
      xRange: [0, 100],
      yRange: [i * 20, (i + 1) * 20 + 50],
      zRange: [i * 10, (i + 1) * 10 + 30],
      addNoise: true,
      noiseLevel: 0.08,
      pattern,
      seed: 100 + i * 111,
    });

    series.push({
      name: `Series ${i + 1} (${pattern})`,
      data,
      pattern,
    });
  }

  return series;
};

// =============================================================================
// CONFIGURATION PRESETS
// =============================================================================

export const PRESET_THEMES = {
  light: {
    darkMode: false,
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    accent: "#06b6d4",
    background: "#ffffff",
    surface: "#f8fafc",
    colorPalette: [
      "#3b82f6",
      "#8b5cf6",
      "#06b6d4",
      "#10b981",
      "#f59e0b",
      "#ef4444",
    ],
  },
  dark: {
    darkMode: true,
    primary: "#60a5fa",
    secondary: "#a78bfa",
    accent: "#22d3ee",
    background: "#1e293b",
    surface: "#334155",
    colorPalette: [
      "#60a5fa",
      "#a78bfa",
      "#22d3ee",
      "#34d399",
      "#fbbf24",
      "#fb7185",
    ],
  },
  scientific: {
    darkMode: false,
    primary: "#1f2937",
    secondary: "#374151",
    accent: "#6b7280",
    background: "#ffffff",
    surface: "#f9fafb",
    colorPalette: [
      "#1f2937",
      "#374151",
      "#6b7280",
      "#9ca3af",
      "#d1d5db",
      "#e5e7eb",
    ],
  },
  vibrant: {
    darkMode: false,
    primary: "#ec4899",
    secondary: "#8b5cf6",
    accent: "#06b6d4",
    background: "#ffffff",
    surface: "#fdf2f8",
    colorPalette: [
      "#ec4899",
      "#8b5cf6",
      "#06b6d4",
      "#10b981",
      "#f59e0b",
      "#ef4444",
    ],
  },
};

export const PRESET_CONFIGS = {
  basic: {
    title: "Basic Plot",
    xAxis: { title: "X Axis", showgrid: true, gridcolor: "#e5e7eb" },
    yAxis: { title: "Y Axis", showgrid: true, gridcolor: "#e5e7eb" },
    margin: { l: 60, r: 180, t: 60, b: 60 },
  },
  scientific: {
    title: "Scientific Measurement",
    xAxis: {
      title: "Measurement Index",
      showgrid: true,
      gridcolor: "#f3f4f6",
      zeroline: true,
    },
    yAxis: {
      title: "Value (units)",
      showgrid: true,
      gridcolor: "#f3f4f6",
      zeroline: true,
    },
    margin: { l: 80, r: 200, t: 80, b: 60 },
    font: { family: "system-ui, sans-serif", size: 12 },
  },
  climate: {
    title: "Atmospheric Data Visualization",
    xAxis: {
      title: "Altitude (meters)",
      showgrid: true,
      gridcolor: "#e0f2fe",
    },
    yAxis: {
      title: "Temperature (°C)",
      showgrid: true,
      gridcolor: "#e0f2fe",
    },
    margin: { l: 80, r: 220, t: 80, b: 60 },
  },
  performance: {
    title: "Performance Metrics",
    xAxis: { title: "Time", showgrid: false },
    yAxis: { title: "Metric Value", showgrid: false },
    margin: { l: 60, r: 150, t: 50, b: 50 },
    backgroundColor: "#1a1a1a",
    plotBackgroundColor: "#2d3748",
  },
};

export const PRESET_INTERACTIONS = {
  basic: {
    enableZoom: true,
    enablePan: true,
    enableHover: true,
    hovermode: "closest" as const,
    dragmode: "zoom" as const,
  },
  scientific: {
    enableZoom: true,
    enablePan: true,
    enableSelect: true,
    enableHover: true,
    hovermode: "x unified" as const,
    dragmode: "zoom" as const,
    selectdirection: "any" as const,
  },
  presentation: {
    enableZoom: false,
    enablePan: false,
    enableHover: true,
    hovermode: "closest" as const,
    dragmode: "pan" as const,
  },
};

export const PRESET_PROGRESSIVE = {
  fast: {
    enabled: true,
    chunkSize: 100,
    showProgress: true,
    showPhase: false,
    animationDuration: 20,
  },
  smooth: {
    enabled: true,
    chunkSize: 50,
    showProgress: true,
    showPhase: true,
    showDataStats: true,
    animationDuration: 50,
  },
  detailed: {
    enabled: true,
    chunkSize: 25,
    showProgress: true,
    showPhase: true,
    showDataStats: true,
    animationDuration: 100,
  },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const createSeriesFromData = (
  data: any[],
  seriesConfig: Partial<any> = {}
) => {
  return {
    name: seriesConfig.name || "Data Series",
    data,
    mode: seriesConfig.mode || "lines+markers",
    line: {
      width: 2,
      ...seriesConfig.line,
    },
    marker: {
      size: 6,
      colorFeature: "z",
      colorScale: "viridis",
      showColorBar: true,
      ...seriesConfig.marker,
    },
    ...seriesConfig,
  };
};

export const combineConfigs = (...configs: any[]) => {
  return configs.reduce(
    (acc, config) => ({
      ...acc,
      ...config,
      xAxis: { ...acc.xAxis, ...config.xAxis },
      yAxis: { ...acc.yAxis, ...config.yAxis },
      font: { ...acc.font, ...config.font },
      margin: { ...acc.margin, ...config.margin },
    }),
    {}
  );
};

export const getColorPalette = (theme: string = "light", count: number = 6) => {
  const themeConfig =
    PRESET_THEMES[theme as keyof typeof PRESET_THEMES] || PRESET_THEMES.light;
  const palette = themeConfig.colorPalette;

  if (count <= palette.length) {
    return palette.slice(0, count);
  }

  // Generate additional colors if needed
  const additional = [];
  for (let i = palette.length; i < count; i++) {
    const hue = (i * 137.5) % 360; // Golden angle for good distribution
    additional.push(`hsl(${hue}, 70%, 50%)`);
  }

  return [...palette, ...additional];
};

// =============================================================================
// GENERIC MULTI-SERIES CHART GENERATOR
// =============================================================================

export interface SeriesVariant {
  name: string;
  data: any[];
  style: {
    color: string;
    lineStyle: "solid" | "dash" | "dot" | "dashdot" | "longdash";
    lineWidth?: number;
    markerSize?: number;
    markerSymbol?: string;
    opacity?: number;
  };
  colorMapping?: {
    feature: string;
    colorScale?: string;
    showColorBar?: boolean;
    colorBarTitle?: string;
  };
}

export interface ChartGroup {
  name: string;
  variants: SeriesVariant[];
  baseColor: string;
}

export interface GenericMultiChartConfig {
  title: string;
  subtitle?: string;
  xAxis: {
    title: string;
    unit?: string;
    range?: [number, number];
  };
  yAxis: {
    title: string;
    unit?: string;
    range?: [number, number];
  };
  groups: ChartGroup[];
  legend?: {
    show?: boolean;
    position?: { x: number; y: number };
    orientation?: "horizontal" | "vertical";
  };
  theme?: keyof typeof PRESET_THEMES;
  interactions?: keyof typeof PRESET_INTERACTIONS;
  progressiveLoading?: keyof typeof PRESET_PROGRESSIVE;
}

/**
 * Generic function to create complex multi-series charts like the fuel consumption example
 * Can handle multiple groups, each with multiple variants (different line styles, colors, etc.)
 */
export const createMultiSeriesChart = (config: GenericMultiChartConfig) => {
  const {
    title,
    subtitle,
    xAxis,
    yAxis,
    groups,
    legend = { show: true, position: { x: 1.02, y: 1 } },
    theme = "light",
    interactions = "scientific",
    progressiveLoading = "smooth",
  } = config;

  // Generate series configurations
  const series: any[] = [];

  groups.forEach((group) => {
    group.variants.forEach((variant, variantIndex) => {
      const seriesConfig: any = {
        name: `${group.name} - ${variant.name}`,
        data: variant.data,
        mode: "lines+markers",
        line: {
          width: variant.style.lineWidth || 2,
          color: variant.style.color,
          dash: variant.style.lineStyle,
          opacity: variant.style.opacity || 1,
        },
        marker: {
          size: variant.style.markerSize || 6,
          color: variant.style.color,
          symbol: variant.style.markerSymbol || "circle",
          opacity: variant.style.opacity || 1,
        },
        showInLegend: legend.show !== false,
      };

      // Add color mapping if specified
      if (variant.colorMapping) {
        seriesConfig.marker = {
          ...seriesConfig.marker,
          colorFeature: variant.colorMapping.feature,
          colorScale: variant.colorMapping.colorScale || "viridis",
          showColorBar: variant.colorMapping.showColorBar && variantIndex === 0, // Only show colorbar for first variant
          colorBarTitle: variant.colorMapping.colorBarTitle,
        };
      }

      series.push(seriesConfig);
    });
  });

  // Build chart configuration
  const chartConfig = combineConfigs(
    PRESET_CONFIGS[theme as keyof typeof PRESET_CONFIGS] ||
      PRESET_CONFIGS.basic,
    {
      title: subtitle ? `${title}\n${subtitle}` : title,
      xAxis: {
        title: xAxis.unit ? `${xAxis.title} (${xAxis.unit})` : xAxis.title,
        range: xAxis.range,
      },
      yAxis: {
        title: yAxis.unit ? `${yAxis.title} (${yAxis.unit})` : yAxis.title,
        range: yAxis.range,
      },
      legendPosition: legend.position,
      showLegend: legend.show !== false,
    }
  );

  return {
    series,
    config: chartConfig,
    theme: PRESET_THEMES[theme as keyof typeof PRESET_THEMES],
    interactions:
      PRESET_INTERACTIONS[interactions as keyof typeof PRESET_INTERACTIONS],
    progressiveLoading:
      PRESET_PROGRESSIVE[progressiveLoading as keyof typeof PRESET_PROGRESSIVE],
  };
};

/**
 * Specific function to recreate the fuel consumption chart from the image
 */
export const createFuelConsumptionChart = () => {
  // Generate realistic fuel consumption data for different climate conditions
  const climateConditions = [
    { name: "Arctic", color: "#1e40af", temp: -20, efficiency: 1.3 },
    { name: "Temperate", color: "#dc2626", temp: 15, efficiency: 1.0 },
    { name: "Tropical", color: "#16a34a", temp: 35, efficiency: 0.9 },
    { name: "Desert", color: "#9333ea", temp: 45, efficiency: 1.1 },
  ];

  const lineStyles = ["solid", "dash", "dot"] as const;

  const groups: ChartGroup[] = climateConditions.map((climate) => ({
    name: climate.name,
    baseColor: climate.color,
    variants: lineStyles.map((style, styleIndex) => {
      // Generate altitude vs fuel consumption data
      const data = Array.from({ length: 100 }, (_, i) => {
        const height = i * 90; // 0 to ~9000m
        const baseConsumption = 5 + (height / 1000) * 0.8; // Base consumption increases with altitude
        const climateEffect = climate.efficiency;
        const variant = styleIndex * 0.5; // Slight variation between variants
        const noise = (Math.random() - 0.5) * 0.3;

        const fuelConsumption =
          baseConsumption * climateEffect + variant + noise;

        return {
          x: Math.max(0.1, Math.min(30, fuelConsumption)), // Fuel consumption (L/100km)
          y: height, // Height (meters)
          z: climate.temp + (Math.random() - 0.5) * 5, // Temperature variation
          temperature: climate.temp,
          climate: climate.name,
          variant: `Variant ${styleIndex + 1}`,
        };
      });

      return {
        name: `Variant ${styleIndex + 1}`,
        data,
        style: {
          color: climate.color,
          lineStyle: style,
          lineWidth: 2,
          markerSize: styleIndex === 2 ? 8 : 6, // Larger markers for dotted lines
          opacity: 0.8,
        },
        colorMapping:
          styleIndex === 0
            ? {
                feature: "temperature",
                colorScale: "RdBu",
                showColorBar: true,
                colorBarTitle: "Temperature (°C)",
              }
            : undefined,
      };
    }),
  }));

  return createMultiSeriesChart({
    title: "Fuel Consumption vs. Height - 3 Variants per Climate (12 curves)",
    xAxis: {
      title: "Fuel Consumption",
      unit: "L/100km equivalent",
    },
    yAxis: {
      title: "Height",
      unit: "meters",
    },
    groups,
    legend: {
      show: true,
      position: { x: 1.02, y: 1 },
    },
    theme: "light",
    interactions: "scientific",
    progressiveLoading: "smooth",
  });
};

/**
 * Generic data generator for multi-variant analysis
 */
export const generateMultiVariantData = (
  baseConfig: {
    xRange: [number, number];
    yRange: [number, number];
    count: number;
  },
  variants: {
    name: string;
    xFunction: (t: number) => number;
    yFunction: (t: number) => number;
    color: string;
    style: "solid" | "dash" | "dot" | "dashdot" | "longdash";
    noiseLevel?: number;
  }[]
) => {
  const { xRange, yRange, count } = baseConfig;

  return variants.map((variant) => {
    const data = Array.from({ length: count }, (_, i) => {
      const t = i / (count - 1);
      const baseX = variant.xFunction(t);
      const baseY = variant.yFunction(t);

      // Scale to desired ranges
      const x = xRange[0] + baseX * (xRange[1] - xRange[0]);
      const y = yRange[0] + baseY * (yRange[1] - yRange[0]);

      // Add noise if specified
      const noiseLevel = variant.noiseLevel || 0;
      const noiseX =
        (Math.random() - 0.5) * noiseLevel * (xRange[1] - xRange[0]);
      const noiseY =
        (Math.random() - 0.5) * noiseLevel * (yRange[1] - yRange[0]);

      return {
        x: x + noiseX,
        y: y + noiseY,
        z: t * 100, // Normalized parameter for coloring
        variant: variant.name,
      };
    });

    return {
      name: variant.name,
      data,
      style: {
        color: variant.color,
        lineStyle: variant.style,
        lineWidth: 2,
        markerSize: 6,
        opacity: 0.8,
      } as const,
    };
  });
};

/**
 * Example usage function showing how to create any type of multi-series chart
 * This demonstrates the flexibility of the generic function
 */
export const createGenericChartExample = (
  title: string,
  xAxisTitle: string,
  yAxisTitle: string,
  dataGroups: {
    name: string;
    color: string;
    datasets: {
      name: string;
      data: { x: number; y: number; [key: string]: any }[];
      lineStyle: "solid" | "dash" | "dot" | "dashdot" | "longdash";
    }[];
  }[]
) => {
  const groups: ChartGroup[] = dataGroups.map((group) => ({
    name: group.name,
    baseColor: group.color,
    variants: group.datasets.map((dataset) => ({
      name: dataset.name,
      data: dataset.data,
      style: {
        color: group.color,
        lineStyle: dataset.lineStyle,
        lineWidth: 2,
        markerSize: 6,
        opacity: 0.8,
      },
    })),
  }));

  return createMultiSeriesChart({
    title,
    xAxis: { title: xAxisTitle },
    yAxis: { title: yAxisTitle },
    groups,
    theme: "light",
    interactions: "scientific",
  });
};

// Example: Stock price analysis
export const createStockAnalysisChart = () => {
  const stocks = [
    { name: "Tech Stock", color: "#3b82f6", symbol: "TECH" },
    { name: "Energy Stock", color: "#ef4444", symbol: "ENRG" },
    { name: "Finance Stock", color: "#10b981", symbol: "FINC" },
  ];

  const dataGroups = stocks.map((stock) => ({
    name: stock.name,
    color: stock.color,
    datasets: [
      {
        name: "Actual Price",
        lineStyle: "solid" as const,
        data: Array.from({ length: 50 }, (_, i) => ({
          x: i,
          y: 100 + Math.random() * 50 + Math.sin(i * 0.2) * 20,
          volume: Math.random() * 1000000,
        })),
      },
      {
        name: "Moving Average",
        lineStyle: "dash" as const,
        data: Array.from({ length: 50 }, (_, i) => ({
          x: i,
          y: 100 + Math.sin(i * 0.1) * 15,
          volume: 0,
        })),
      },
    ],
  }));

  return createGenericChartExample(
    "Multi-Stock Analysis",
    "Time (days)",
    "Price ($)",
    dataGroups
  );
};

// Example: Scientific experiment results
export const createExperimentResultsChart = () => {
  const experiments = [
    { name: "Control Group", color: "#6b7280" },
    { name: "Treatment A", color: "#3b82f6" },
    { name: "Treatment B", color: "#ef4444" },
  ];

  const conditions = ["Low Dose", "Medium Dose", "High Dose"];
  const lineStyles = ["solid", "dash", "dot"] as const;

  const dataGroups = experiments.map((experiment) => ({
    name: experiment.name,
    color: experiment.color,
    datasets: conditions.map((condition, index) => ({
      name: condition,
      lineStyle: lineStyles[index],
      data: Array.from({ length: 30 }, (_, i) => ({
        x: i,
        y:
          50 +
          Math.random() * 30 +
          (experiment.name !== "Control Group" ? index * 10 : 0),
        errorY: Math.random() * 5,
        dose: index + 1,
      })),
    })),
  }));

  return createGenericChartExample(
    "Experimental Results - Multiple Treatments",
    "Time (hours)",
    "Response Level",
    dataGroups
  );
};
