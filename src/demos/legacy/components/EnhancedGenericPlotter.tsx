import Plot from "react-plotly.js";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// =============================================================================
// ENHANCED TYPES & INTERFACES (Modern Plotting Standards)
// =============================================================================

export interface DataPoint {
  x: number;
  y: number;
  z?: number; // Third feature for coloring
  error_x?: number; // Error bars
  error_y?: number;
  text?: string; // Custom hover text
  hovertemplate?: string;
  [key: string]: any; // Additional properties
}

export interface DataSeries {
  name: string;
  data: DataPoint[];
  color?: string;
  colorScale?: string | Array<[number, string]>;
  opacity?: number; // Modern opacity control
}

export interface LineOptions {
  width?: number;
  dash?: "solid" | "dash" | "dot" | "dashdot" | "longdash";
  shape?: "linear" | "spline" | "hv" | "vh" | "hvh" | "vhv";
  color?: string;
  opacity?: number;
  smoothing?: number; // Spline smoothing factor
}

export interface MarkerOptions {
  size?: number | number[]; // Support array for variable sizes
  symbol?: string | string[]; // Different marker symbols
  colorFeature?: "z" | "x" | "y" | string;
  colorScale?: string | Array<[number, string]>;
  showColorBar?: boolean;
  colorBarTitle?: string;
  colorMin?: number;
  colorMax?: number;
  opacity?: number;
  sizeref?: number; // For bubble charts
  sizemode?: "diameter" | "area";
  line?: {
    // Marker border
    width?: number;
    color?: string;
  };
}

export interface ErrorBarOptions {
  x?: {
    type: "data" | "percent" | "sqrt" | "constant";
    value?: number;
    array?: number[];
    visible?: boolean;
  };
  y?: {
    type: "data" | "percent" | "sqrt" | "constant";
    value?: number;
    array?: number[];
    visible?: boolean;
  };
}

export interface SeriesConfig {
  name: string;
  data: DataPoint[];
  mode?: "lines" | "markers" | "lines+markers" | "text" | "none";
  type?: "scatter" | "scattergl" | "bar" | "histogram" | "box" | "violin"; // Extended types
  line?: LineOptions;
  marker?: MarkerOptions;
  errorBars?: ErrorBarOptions;
  fill?: "none" | "tozeroy" | "tozerox" | "tonexty" | "tonextx" | "toself";
  fillcolor?: string;
  connectDots?: boolean;
  gradientLines?: boolean;
  visible?: boolean;
  showInLegend?: boolean;
  hoverinfo?: string;
  hovertemplate?: string;
  textposition?: string;
  textfont?: {
    size?: number;
    color?: string;
    family?: string;
  };
}

export interface AxisConfig {
  title?: string;
  type?: "linear" | "log" | "date" | "category";
  range?: [number, number];
  autorange?: boolean | "reversed";
  showgrid?: boolean;
  gridwidth?: number;
  gridcolor?: string;
  zeroline?: boolean;
  zerolinewidth?: number;
  zerolinecolor?: string;
  tickmode?: "linear" | "array";
  tick0?: number;
  dtick?: number;
  tickvals?: number[];
  ticktext?: string[];
  tickangle?: number;
  showticklabels?: boolean;
  tickfont?: {
    size?: number;
    color?: string;
    family?: string;
  };
}

export interface PlotConfig {
  title?: string;
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  width?: string | number;
  height?: string | number;
  minHeight?: string | number;
  showLegend?: boolean;
  legendPosition?: {
    x?: number;
    y?: number;
    xanchor?: "left" | "center" | "right";
    yanchor?: "top" | "middle" | "bottom";
  };
  margin?: {
    l?: number;
    r?: number;
    t?: number;
    b?: number;
  };
  responsive?: boolean;
  useResizeHandler?: boolean;
  backgroundColor?: string;
  plotBackgroundColor?: string;
  font?: {
    family?: string;
    size?: number;
    color?: string;
  };
  annotations?: Array<{
    x: number;
    y: number;
    text: string;
    showarrow?: boolean;
    arrowhead?: number;
    ax?: number;
    ay?: number;
  }>;
  shapes?: Array<{
    type: "rect" | "circle" | "line";
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    fillcolor?: string;
    opacity?: number;
  }>;
}

export interface InteractionConfig {
  enableZoom?: boolean;
  enablePan?: boolean;
  enableSelect?: boolean;
  enableHover?: boolean;
  dragmode?: "zoom" | "pan" | "select" | "lasso" | "orbit" | "turntable";
  hovermode?: "x" | "y" | "closest" | "x unified" | "y unified";
  clickmode?: "event" | "select" | "event+select";
  selectdirection?: "h" | "v" | "d" | "any";
}

export interface ProgressConfig {
  enabled?: boolean;
  chunkSize?: number;
  showProgress?: boolean;
  showPhase?: boolean;
  showDataStats?: boolean; // Show data statistics during loading
  animationDuration?: number;
  onProgress?: (
    progress: number,
    phase: string,
    pointsLoaded: number,
    stats?: DataStats
  ) => void;
  onComplete?: (totalPoints: number, stats?: DataStats) => void;
}

export interface DataStats {
  totalPoints: number;
  seriesCount: number;
  xRange: [number, number];
  yRange: [number, number];
  zRange?: [number, number];
  memoryUsage?: string;
}

export interface ThemeConfig {
  primary?: string;
  secondary?: string;
  background?: string;
  surface?: string;
  accent?: string;
  darkMode?: boolean;
  colorPalette?: string[];
}

export interface GenericPlotterProps {
  series: SeriesConfig[];
  config?: PlotConfig;
  interactions?: InteractionConfig;
  progressiveLoading?: ProgressConfig;
  theme?: ThemeConfig;
  className?: string;
  style?: React.CSSProperties;
  onPlotClick?: (data: any) => void;
  onPlotHover?: (data: any) => void;
  onPlotSelect?: (data: any) => void;
  onPlotZoom?: (data: any) => void;
  debug?: boolean;
}

// =============================================================================
// UTILITY FUNCTIONS (Enhanced with Modern Standards)
// =============================================================================

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const getColorValue = (point: DataPoint, feature: string): number => {
  if (feature === "x") return point.x;
  if (feature === "y") return point.y;
  if (feature === "z") return point.z || 0;
  return point[feature] || 0;
};

// Advanced color interpolation using HSL
const interpolateColorHSL = (
  color1: string,
  color2: string,
  factor: number
): string => {
  // Convert hex to HSL and interpolate
  const hexToHsl = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { h: 0, s: 0, l: 0 };

    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hsl1 = hexToHsl(color1);
  const hsl2 = hexToHsl(color2);

  const h = hsl1.h + factor * (hsl2.h - hsl1.h);
  const s = hsl1.s + factor * (hsl2.s - hsl1.s);
  const l = hsl1.l + factor * (hsl2.l - hsl1.l);

  return `hsl(${h}, ${s}%, ${l}%)`;
};

// Calculate data statistics
const calculateDataStats = (series: SeriesConfig[]): DataStats => {
  const allData = series.flatMap((s) => s.data);
  const totalPoints = allData.length;
  const seriesCount = series.length;

  const xValues = allData.map((p) => p.x);
  const yValues = allData.map((p) => p.y);
  const zValues = allData
    .map((p) => p.z)
    .filter((v) => v !== undefined) as number[];

  const xRange: [number, number] = [Math.min(...xValues), Math.max(...xValues)];
  const yRange: [number, number] = [Math.min(...yValues), Math.max(...yValues)];
  const zRange: [number, number] | undefined =
    zValues.length > 0
      ? [Math.min(...zValues), Math.max(...zValues)]
      : undefined;

  // Rough memory usage calculation
  const memoryUsage = `${Math.round((totalPoints * 8 * 3) / 1024)} KB`;

  return {
    totalPoints,
    seriesCount,
    xRange,
    yRange,
    zRange,
    memoryUsage,
  };
};

// Modern colorscales based on ColorBrewer and Viridis
const MODERN_COLORSCALES: Record<string, [number, string][]> = {
  viridis: [
    [0, "#440154"],
    [0.25, "#31688e"],
    [0.5, "#35b779"],
    [0.75, "#fde725"],
    [1, "#fde725"],
  ],
  plasma: [
    [0, "#0d0887"],
    [0.25, "#7e03a8"],
    [0.5, "#cc4778"],
    [0.75, "#f89441"],
    [1, "#f0f921"],
  ],
  turbo: [
    [0, "#23171b"],
    [0.25, "#1e6091"],
    [0.5, "#00a76c"],
    [0.75, "#bfbc00"],
    [1, "#b30000"],
  ],
  cividis: [
    [0, "#00224e"],
    [0.25, "#123570"],
    [0.5, "#3b496c"],
    [0.75, "#575d6d"],
    [1, "#ffea46"],
  ],
  rainbow: [
    [0, "#ff0000"],
    [0.17, "#ff8c00"],
    [0.33, "#ffd700"],
    [0.5, "#00ff00"],
    [0.67, "#0000ff"],
    [0.83, "#4b0082"],
    [1, "#9400d3"],
  ],
};

// =============================================================================
// MAIN ENHANCED COMPONENT
// =============================================================================

const GenericPlotter: React.FC<GenericPlotterProps> = ({
  series,
  config = {},
  interactions = {},
  progressiveLoading,
  theme,
  className,
  style,
  onPlotClick,
  onPlotHover,
  onPlotSelect,
  onPlotZoom,
  debug = false,
}) => {
  // State management
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("Ready to load");
  const [isGenerating, setIsGenerating] = useState(false);
  const [totalPointsLoaded, setTotalPointsLoaded] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [dataStats, setDataStats] = useState<DataStats | null>(null);
  const [plotData, setPlotData] = useState<any[]>([]);

  // Refs for performance optimization
  const animationFrameRef = useRef<number>();

  // Default configurations with modern standards
  const plotConfig = useMemo(
    () => ({
      title: config.title || "Interactive Data Visualization",
      xAxis: {
        title: config.xAxis?.title || "X Axis",
        type: config.xAxis?.type || "linear",
        showgrid: config.xAxis?.showgrid ?? true,
        gridcolor:
          config.xAxis?.gridcolor || (theme?.darkMode ? "#444" : "#e1e4e8"),
        zeroline: config.xAxis?.zeroline ?? true,
        zerolinecolor:
          config.xAxis?.zerolinecolor || (theme?.darkMode ? "#666" : "#d1d5da"),
        ...config.xAxis,
      },
      yAxis: {
        title: config.yAxis?.title || "Y Axis",
        type: config.yAxis?.type || "linear",
        showgrid: config.yAxis?.showgrid ?? true,
        gridcolor:
          config.yAxis?.gridcolor || (theme?.darkMode ? "#444" : "#e1e4e8"),
        zeroline: config.yAxis?.zeroline ?? true,
        zerolinecolor:
          config.yAxis?.zerolinecolor || (theme?.darkMode ? "#666" : "#d1d5da"),
        ...config.yAxis,
      },
      width: config.width || "100%",
      height: config.height || "100%",
      minHeight: config.minHeight || "450px",
      showLegend: config.showLegend ?? true,
      legendPosition: config.legendPosition || {
        x: 1.02,
        y: 1.0,
        xanchor: "left",
        yanchor: "top",
      },
      margin: config.margin || { l: 60, r: 180, t: 60, b: 60 },
      responsive: config.responsive ?? true,
      useResizeHandler: config.useResizeHandler ?? true,
      backgroundColor:
        config.backgroundColor || (theme?.darkMode ? "#1a1a1a" : "#ffffff"),
      plotBackgroundColor:
        config.plotBackgroundColor || (theme?.darkMode ? "#2d3748" : "#fafbfc"),
      font: {
        family:
          config.font?.family ||
          "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        size: config.font?.size || 12,
        color: config.font?.color || (theme?.darkMode ? "#e2e8f0" : "#24292e"),
        ...config.font,
      },
      annotations: config.annotations || [],
      shapes: config.shapes || [],
    }),
    [config, theme]
  );

  // Enhanced interaction configuration
  const interactionConfig = useMemo(
    () => ({
      enableZoom: interactions.enableZoom ?? true,
      enablePan: interactions.enablePan ?? true,
      enableSelect: interactions.enableSelect ?? true,
      enableHover: interactions.enableHover ?? true,
      dragmode: interactions.dragmode || "zoom",
      hovermode: interactions.hovermode || "closest",
      clickmode: interactions.clickmode || "event+select",
      selectdirection: interactions.selectdirection || "any",
    }),
    [interactions]
  );

  // Create enhanced traces with modern features
  const createTraces = useCallback(
    (seriesConfig: SeriesConfig, seriesIndex: number) => {
      const {
        name,
        data,
        type = "scatter",
        mode = "lines+markers",
        line = {},
        marker = {},
        errorBars,
        fill = "none",
        fillcolor,
        connectDots = true,
        gradientLines = false,
        visible = true,
        showInLegend = true,
        hoverinfo,
        hovertemplate,
        textposition,
        textfont,
      } = seriesConfig;

      if (!data || data.length === 0 || !visible) return [];

      const traces: any[] = [];
      const xValues = data.map((point) => point.x);
      const yValues = data.map((point) => point.y);
      const textValues = data.map((point) => point.text || "");

      let colorValues: number[] = [];
      let colorMin = 0;
      let colorMax = 1;

      if (marker.colorFeature) {
        colorValues = data.map((point) =>
          getColorValue(point, marker.colorFeature!)
        );
        colorMin = marker.colorMin ?? Math.min(...colorValues);
        colorMax = marker.colorMax ?? Math.max(...colorValues);
      }

      // Create gradient line segments if enabled
      if (
        connectDots &&
        gradientLines &&
        data.length > 1 &&
        type === "scatter"
      ) {
        for (let i = 0; i < data.length - 1; i++) {
          const currentValue = colorValues[i] || 0;
          const nextValue = colorValues[i + 1] || 0;
          const avgValue = (currentValue + nextValue) / 2;

          let segmentColor =
            line.color || `hsla(${200 + seriesIndex * 60}, 70%, 50%, 0.8)`;
          if (marker.colorFeature && marker.colorScale) {
            const normalizedValue =
              (avgValue - colorMin) / (colorMax - colorMin);
            if (
              typeof marker.colorScale === "string" &&
              MODERN_COLORSCALES[
                marker.colorScale as keyof typeof MODERN_COLORSCALES
              ]
            ) {
              const scale =
                MODERN_COLORSCALES[
                  marker.colorScale as keyof typeof MODERN_COLORSCALES
                ];
              segmentColor = getColorFromScale(normalizedValue, scale);
            }
          }

          traces.push({
            x: [xValues[i], xValues[i + 1]],
            y: [yValues[i], yValues[i + 1]],
            mode: "lines",
            type: "scatter",
            line: {
              width: line.width || 3,
              color: segmentColor,
              dash: line.dash || "solid",
              shape: line.shape || "linear",
            },
            showlegend: false,
            hoverinfo: "skip",
          });
        }
      }

      // Main trace with enhanced features
      const mainTrace: any = {
        x: xValues,
        y: yValues,
        mode: gradientLines && connectDots ? mode.replace("lines+", "") : mode,
        type: type,
        name: `${name} (${data.length.toLocaleString()} pts)`,
        showlegend: showInLegend,
        text: textValues,
        textposition: textposition,
        textfont: textfont,
        hoverinfo: hoverinfo,
        hovertemplate: hovertemplate,
        fill: fill,
        fillcolor: fillcolor,
      };

      // Enhanced line configuration
      if (mode.includes("lines") && !(gradientLines && connectDots)) {
        mainTrace.line = {
          width: line.width || 2,
          color:
            line.color ||
            `hsla(${200 + seriesIndex * 60}, 70%, 50%, ${line.opacity || 0.8})`,
          dash: line.dash || "solid",
          shape: line.shape || (line.smoothing ? "spline" : "linear"),
          smoothing: line.smoothing || 0,
        };
      }

      // Enhanced marker configuration
      if (mode.includes("markers")) {
        const markerConfig: any = {
          size: Array.isArray(marker.size) ? marker.size : marker.size || 6,
          symbol: marker.symbol || "circle",
          opacity: marker.opacity || 0.8,
          sizeref: marker.sizeref,
          sizemode: marker.sizemode || "diameter",
          line: marker.line,
        };

        // Advanced coloring
        if (marker.colorFeature && colorValues.length > 0) {
          markerConfig.color = colorValues;

          if (
            typeof marker.colorScale === "string" &&
            MODERN_COLORSCALES[
              marker.colorScale as keyof typeof MODERN_COLORSCALES
            ]
          ) {
            markerConfig.colorscale =
              MODERN_COLORSCALES[
                marker.colorScale as keyof typeof MODERN_COLORSCALES
              ];
          } else {
            markerConfig.colorscale = marker.colorScale || "viridis";
          }

          markerConfig.showscale = marker.showColorBar && seriesIndex === 0;

          if (markerConfig.showscale) {
            markerConfig.colorbar = {
              title: {
                text: marker.colorBarTitle || marker.colorFeature,
                font: { size: 12, color: plotConfig.font.color },
              },
              x: 1.02,
              y: 0.5,
              len: 0.8,
              thickness: 20,
              borderwidth: 0,
              bgcolor: plotConfig.backgroundColor,
              bordercolor: plotConfig.font.color,
              tickfont: { size: 10, color: plotConfig.font.color },
            };
          }

          markerConfig.cmin = colorMin;
          markerConfig.cmax = colorMax;
        } else {
          markerConfig.color =
            line.color || `hsla(${200 + seriesIndex * 60}, 70%, 50%, 0.8)`;
        }

        mainTrace.marker = markerConfig;
      }

      // Add error bars if specified
      if (errorBars) {
        if (errorBars.x) {
          mainTrace.error_x = {
            type: errorBars.x.type,
            value: errorBars.x.value,
            array: errorBars.x.array,
            visible: errorBars.x.visible ?? true,
          };
        }
        if (errorBars.y) {
          mainTrace.error_y = {
            type: errorBars.y.type,
            value: errorBars.y.value,
            array: errorBars.y.array,
            visible: errorBars.y.visible ?? true,
          };
        }
      }

      traces.push(mainTrace);
      return traces;
    },
    [plotConfig]
  );

  // Helper function for color scale interpolation
  const getColorFromScale = (
    value: number,
    scale: Array<[number, string]>
  ): string => {
    const clampedValue = clamp(value, 0, 1);

    for (let i = 0; i < scale.length - 1; i++) {
      if (clampedValue >= scale[i][0] && clampedValue <= scale[i + 1][0]) {
        const factor =
          (clampedValue - scale[i][0]) / (scale[i + 1][0] - scale[i][0]);
        return interpolateColorHSL(scale[i][1], scale[i + 1][1], factor);
      }
    }

    return scale[scale.length - 1][1];
  };

  // Enhanced progressive loading with better UX
  const loadDataProgressively = useCallback(async () => {
    if (!progressiveLoading?.enabled) {
      const stats = calculateDataStats(series);
      setDataStats(stats);
      const allTraces: any[] = [];

      series.forEach((seriesConfig, index) => {
        const traces = createTraces(seriesConfig, index);
        allTraces.push(...traces);
      });

      setPlotData(allTraces);
      setIsComplete(true);
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setTotalPointsLoaded(0);
    setIsComplete(false);
    setCurrentPhase("Analyzing data structure...");

    const stats = calculateDataStats(series);
    setDataStats(stats);

    const chunkSize = progressiveLoading.chunkSize || 100;
    const animationDuration = progressiveLoading.animationDuration || 50;
    let completedChunks = 0;
    let totalChunks = 0;

    // Calculate total chunks needed
    series.forEach((s) => {
      totalChunks += Math.ceil(s.data.length / chunkSize);
    });

    setCurrentPhase("Loading data series...");

    const processedSeries: SeriesConfig[] = [];

    for (let seriesIndex = 0; seriesIndex < series.length; seriesIndex++) {
      const currentSeries = series[seriesIndex];
      setCurrentPhase(`Processing ${currentSeries.name}...`);

      const chunkedData: DataPoint[] = [];

      for (
        let startIndex = 0;
        startIndex < currentSeries.data.length;
        startIndex += chunkSize
      ) {
        const endIndex = Math.min(
          startIndex + chunkSize,
          currentSeries.data.length
        );
        const chunk = currentSeries.data.slice(startIndex, endIndex);

        chunkedData.push(...chunk);

        completedChunks++;
        const newProgress = (completedChunks / totalChunks) * 100;
        const newTotalPoints =
          chunkedData.length +
          processedSeries.reduce((sum, s) => sum + s.data.length, 0);

        setProgress(newProgress);
        setTotalPointsLoaded(newTotalPoints);

        // Update plot with current data using animation frame
        const tempSeries = [
          ...processedSeries,
          { ...currentSeries, data: chunkedData },
        ];

        const allTraces: any[] = [];
        tempSeries.forEach((seriesConfig, index) => {
          const traces = createTraces(seriesConfig, index);
          allTraces.push(...traces);
        });

        setPlotData(allTraces);

        if (progressiveLoading.onProgress) {
          progressiveLoading.onProgress(
            newProgress,
            currentPhase,
            newTotalPoints,
            stats
          );
        }

        // Smooth animation frame delay
        await new Promise((resolve) => {
          animationFrameRef.current = requestAnimationFrame(() => {
            setTimeout(resolve, animationDuration);
          });
        });
      }

      processedSeries.push({ ...currentSeries, data: chunkedData });
    }

    setCurrentPhase("Finalizing visualization...");
    setProgress(100);

    setTimeout(() => {
      setIsGenerating(false);
      setIsComplete(true);
      setCurrentPhase(
        `Complete - ${stats.totalPoints.toLocaleString()} points loaded`
      );

      if (progressiveLoading.onComplete) {
        progressiveLoading.onComplete(stats.totalPoints, stats);
      }
    }, 200);
  }, [series, progressiveLoading, createTraces, currentPhase]);

  // Initialize loading
  useEffect(() => {
    const timer = setTimeout(() => {
      loadDataProgressively();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [loadDataProgressively]);

  // Enhanced Plotly layout
  const plotLayout = useMemo(
    () => ({
      title: {
        text: plotConfig.title,
        font: plotConfig.font,
        x: 0.5,
        xanchor: "center" as const,
      },
      xaxis: {
        ...plotConfig.xAxis,
        title: { text: plotConfig.xAxis.title, font: plotConfig.font },
      },
      yaxis: {
        ...plotConfig.yAxis,
        title: { text: plotConfig.yAxis.title, font: plotConfig.font },
      },
      showlegend: plotConfig.showLegend,
      legend: {
        ...plotConfig.legendPosition,
        font: plotConfig.font,
        bgcolor: plotConfig.backgroundColor,
        bordercolor: plotConfig.font.color,
        borderwidth: 1,
      },
      margin: plotConfig.margin,
      paper_bgcolor: plotConfig.backgroundColor,
      plot_bgcolor: plotConfig.plotBackgroundColor,
      font: plotConfig.font,
      annotations: plotConfig.annotations,
      shapes: plotConfig.shapes,
      dragmode: interactionConfig.dragmode,
      hovermode: interactionConfig.hovermode,
      clickmode: interactionConfig.clickmode,
      selectdirection: interactionConfig.selectdirection,
    }),
    [plotConfig, interactionConfig]
  );

  // Enhanced Plotly config
  const plotlyConfig = useMemo(
    () => ({
      responsive: plotConfig.responsive,
      displayModeBar: true,
      displaylogo: false,
      scrollZoom: interactionConfig.enableZoom,
      doubleClick: "reset+autosize" as const,
      toImageButtonOptions: {
        format: "png" as const,
        filename: "custom_image",
        height: 500,
        width: 700,
        scale: 1,
      },
    }),
    [plotConfig, interactionConfig]
  );

  // Debug panel
  const debugPanel = debug && dataStats && (
    <div
      style={{
        position: "absolute",
        top: "15px",
        right: "15px",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "4px",
        fontSize: "12px",
        fontFamily: "monospace",
        zIndex: 1002,
        minWidth: "200px",
      }}
    >
      <div>
        <strong>Debug Info:</strong>
      </div>
      <div>Series: {dataStats.seriesCount}</div>
      <div>Points: {dataStats.totalPoints.toLocaleString()}</div>
      <div>
        X Range: [{dataStats.xRange[0].toFixed(2)},{" "}
        {dataStats.xRange[1].toFixed(2)}]
      </div>
      <div>
        Y Range: [{dataStats.yRange[0].toFixed(2)},{" "}
        {dataStats.yRange[1].toFixed(2)}]
      </div>
      {dataStats.zRange && (
        <div>
          Z Range: [{dataStats.zRange[0].toFixed(2)},{" "}
          {dataStats.zRange[1].toFixed(2)}]
        </div>
      )}
      <div>Memory: ~{dataStats.memoryUsage}</div>
    </div>
  );

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: plotConfig.width,
        height: plotConfig.height,
        minHeight: plotConfig.minHeight,
        border: "3px solid transparent",
        borderRadius: "8px",
        transition: "all 0.3s ease-in-out",
        backgroundColor: plotConfig.backgroundColor,
        ...style,
      }}
    >
      {/* Enhanced Progress Indicator */}
      {progressiveLoading?.enabled &&
        progressiveLoading.showProgress &&
        isGenerating && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1001,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95))",
              padding: "16px 24px",
              borderRadius: "12px",
              border: "1px solid rgba(0,0,0,0.1)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              minWidth: "300px",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                border: "3px solid #6b7280",
                borderTop: "3px solid transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />

            {progressiveLoading.showPhase && (
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#22c55e",
                  textAlign: "center",
                }}
              >
                {currentPhase}
              </span>
            )}

            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                <span>Progress: {Math.round(progress)}%</span>
                <span>{totalPointsLoaded.toLocaleString()} points</span>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "6px",
                  backgroundColor: "rgba(0,0,0,0.1)",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #22c55e, #16a34a)",
                    borderRadius: "3px",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              {progressiveLoading.showDataStats && dataStats && (
                <div
                  style={{
                    fontSize: "10px",
                    color: "#64748b",
                    textAlign: "center",
                  }}
                >
                  {dataStats.seriesCount} series • ~{dataStats.memoryUsage}
                </div>
              )}
            </div>
          </div>
        )}

      {/* Completion Indicator */}
      {isComplete && (
        <div
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            zIndex: 1001,
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
          }}
        >
          ✅ Visualization Ready!
        </div>
      )}

      {debugPanel}

      <Plot
        data={plotData}
        layout={plotLayout}
        config={plotlyConfig}
        style={{
          width: "100%",
          height: "100%",
          minHeight: plotConfig.minHeight,
          transition: "all 0.3s ease-in-out",
          filter: isGenerating ? "brightness(0.95)" : "brightness(1)",
        }}
        useResizeHandler={plotConfig.useResizeHandler}
        onClick={onPlotClick}
        onHover={onPlotHover}
        onSelected={onPlotSelect}
        onRelayout={onPlotZoom}
      />

      <style>
        {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        `}
      </style>
    </div>
  );
};

export default GenericPlotter;
