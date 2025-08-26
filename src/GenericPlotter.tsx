import Plot from "react-plotly.js";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface DataPoint {
  x: number;
  y: number;
  z?: number; // Third feature for coloring
  [key: string]: any; // Additional properties
}

export interface DataSeries {
  name: string;
  data: DataPoint[];
  color?: string;
  colorScale?: string | Array<[number, string]>;
}

export interface LineOptions {
  width?: number;
  dash?: "solid" | "dash" | "dot" | "dashdot" | "longdash";
  shape?: "linear" | "spline" | "hv" | "vh" | "hvh" | "vhv";
  color?: string;
}

export interface MarkerOptions {
  size?: number;
  colorFeature?: "z" | "x" | "y" | string; // Which feature to use for coloring
  colorScale?: string | Array<[number, string]>;
  showColorBar?: boolean;
  colorBarTitle?: string;
  colorMin?: number;
  colorMax?: number;
}

export interface SeriesConfig {
  name: string;
  data: DataPoint[];
  mode?: "lines" | "markers" | "lines+markers";
  line?: LineOptions;
  marker?: MarkerOptions;
  connectDots?: boolean; // Whether to connect dots with gradient lines
  gradientLines?: boolean; // Use gradient coloring on line segments
  visible?: boolean;
  showInLegend?: boolean;
}

export interface PlotConfig {
  title?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
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
}

export interface ProgressConfig {
  enabled?: boolean;
  chunkSize?: number;
  showProgress?: boolean;
  showPhase?: boolean;
  onProgress?: (progress: number, phase: string, pointsLoaded: number) => void;
  onComplete?: (totalPoints: number) => void;
}

export interface GenericPlotterProps {
  series: SeriesConfig[];
  config?: PlotConfig;
  progressiveLoading?: ProgressConfig;
  className?: string;
  style?: React.CSSProperties;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const getColorValue = (point: DataPoint, feature: string): number => {
  if (feature === "x") return point.x;
  if (feature === "y") return point.y;
  if (feature === "z") return point.z || 0;
  return point[feature] || 0;
};

const interpolateColor = (
  color1: string,
  color2: string,
  factor: number
): string => {
  // Simple color interpolation between two rgba colors
  const rgba1 = color1
    .match(/rgba?\(([^)]+)\)/)?.[1]
    .split(",")
    .map((x) => parseFloat(x.trim())) || [0, 0, 0, 1];
  const rgba2 = color2
    .match(/rgba?\(([^)]+)\)/)?.[1]
    .split(",")
    .map((x) => parseFloat(x.trim())) || [0, 0, 0, 1];

  const r = Math.round(rgba1[0] + factor * (rgba2[0] - rgba1[0]));
  const g = Math.round(rgba1[1] + factor * (rgba2[1] - rgba1[1]));
  const b = Math.round(rgba1[2] + factor * (rgba2[2] - rgba1[2]));
  const a = rgba1[3] + factor * (rgba2[3] - rgba1[3]);

  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const getFeatureToColor = (
  value: number,
  min: number,
  max: number,
  colorScale?: string | Array<[number, string]>
): string => {
  const normalized = clamp((value - min) / (max - min), 0, 1);

  if (Array.isArray(colorScale)) {
    // Custom colorscale - find appropriate segment
    for (let i = 0; i < colorScale.length - 1; i++) {
      if (
        normalized >= colorScale[i][0] &&
        normalized <= colorScale[i + 1][0]
      ) {
        const factor =
          (normalized - colorScale[i][0]) /
          (colorScale[i + 1][0] - colorScale[i][0]);
        return interpolateColor(colorScale[i][1], colorScale[i + 1][1], factor);
      }
    }
    return colorScale[colorScale.length - 1][1];
  }

  // Default blue-to-red gradient
  const red = Math.round(255 * normalized);
  const blue = Math.round(255 * (1 - normalized));
  const green = Math.round(128 * Math.sin(normalized * Math.PI));
  return `rgba(${red}, ${green}, ${blue}, 0.8)`;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const GenericPlotter: React.FC<GenericPlotterProps> = ({
  series,
  config = {},
  progressiveLoading,
  className,
  style,
}) => {
  // Progressive loading state
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("Ready to load");
  const [isGenerating, setIsGenerating] = useState(false);
  const [totalPointsLoaded, setTotalPointsLoaded] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Store processed data to avoid re-render loops
  const processedDataRef = useRef<any[]>([]);
  const [plotData, setPlotData] = useState<any[]>([]);

  // Default configuration
  const plotConfig = useMemo(
    () => ({
      title: config.title || "Generic Plot",
      xAxisTitle: config.xAxisTitle || "X Axis",
      yAxisTitle: config.yAxisTitle || "Y Axis",
      width: config.width || "100%",
      height: config.height || "100%",
      minHeight: config.minHeight || "450px",
      showLegend: config.showLegend ?? true,
      legendPosition: config.legendPosition || {
        x: 1.15,
        y: 1.0,
        xanchor: "left",
        yanchor: "top",
      },
      margin: config.margin || { r: 280 },
      responsive: config.responsive ?? true,
      useResizeHandler: config.useResizeHandler ?? true,
    }),
    [config]
  );

  // Process a single series into Plotly traces
  const createTraces = useCallback(
    (seriesConfig: SeriesConfig, seriesIndex: number) => {
      const {
        name,
        data,
        mode = "lines+markers",
        line = {},
        marker = {},
        connectDots = true,
        gradientLines = false,
        visible = true,
        showInLegend = true,
      } = seriesConfig;

      if (!data || data.length === 0 || !visible) return [];

      const traces: any[] = [];

      // Extract coordinates and color values
      const xValues = data.map((point) => point.x);
      const yValues = data.map((point) => point.y);

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
      if (connectDots && gradientLines && data.length > 1) {
        for (let i = 0; i < data.length - 1; i++) {
          const currentValue = colorValues[i] || 0;
          const nextValue = colorValues[i + 1] || 0;
          const avgValue = (currentValue + nextValue) / 2;

          const segmentColor = marker.colorFeature
            ? getFeatureToColor(avgValue, colorMin, colorMax, marker.colorScale)
            : line.color || "rgba(31, 119, 180, 0.8)";

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

      // Create main trace (markers and/or lines)
      const mainTrace: any = {
        x: xValues,
        y: yValues,
        mode: gradientLines && connectDots ? "markers" : mode,
        type: "scatter",
        name: `${name} (${data.length.toLocaleString()} pts)`,
        showlegend: showInLegend,
      };

      // Configure lines (if not using gradient lines)
      if (mode.includes("lines") && !(gradientLines && connectDots)) {
        mainTrace.line = {
          width: line.width || 3,
          color:
            line.color ||
            `rgba(${31 + seriesIndex * 40}, ${119 + seriesIndex * 30}, ${
              180 - seriesIndex * 20
            }, 0.8)`,
          dash: line.dash || "solid",
          shape: line.shape || "linear",
        };
      }

      // Configure markers
      if (mode.includes("markers")) {
        mainTrace.marker = {
          size: marker.size || 4,
          ...(marker.colorFeature && colorValues.length > 0
            ? {
                color: colorValues,
                colorscale: marker.colorScale || [
                  [0, "rgba(0, 0, 255, 0.8)"],
                  [0.3, "rgba(128, 128, 255, 0.8)"],
                  [0.6, "rgba(255, 128, 0, 0.8)"],
                  [1, "rgba(255, 0, 0, 0.8)"],
                ],
                showscale: marker.showColorBar && seriesIndex === 0,
                colorbar:
                  marker.showColorBar && seriesIndex === 0
                    ? {
                        title: marker.colorBarTitle || "Color Feature",
                        x: 1.02,
                        y: 0.5,
                        len: 0.8,
                        thickness: 15,
                      }
                    : undefined,
                cmin: colorMin,
                cmax: colorMax,
              }
            : {
                color:
                  line.color ||
                  `rgba(${31 + seriesIndex * 40}, ${119 + seriesIndex * 30}, ${
                    180 - seriesIndex * 20
                  }, 0.8)`,
              }),
        };
      }

      traces.push(mainTrace);
      return traces;
    },
    []
  );

  // Process all series data
  const updatePlotData = useCallback(() => {
    const allTraces: any[] = [];

    series.forEach((seriesConfig, index) => {
      const traces = createTraces(seriesConfig, index);
      allTraces.push(...traces);
    });

    processedDataRef.current = allTraces;
    setPlotData(allTraces);
  }, [series, createTraces]);

  // Progressive loading implementation
  const loadDataProgressively = useCallback(async () => {
    if (!progressiveLoading?.enabled) {
      updatePlotData();
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setTotalPointsLoaded(0);
    setIsComplete(false);
    setCurrentPhase("Starting data loading...");

    const chunkSize = progressiveLoading.chunkSize || 100;
    let completedChunks = 0;
    let totalChunks = 0;

    // Calculate total chunks needed
    series.forEach((s) => {
      totalChunks += Math.ceil(s.data.length / chunkSize);
    });

    // Process each series in chunks
    const processedSeries: SeriesConfig[] = [];

    for (let seriesIndex = 0; seriesIndex < series.length; seriesIndex++) {
      const currentSeries = series[seriesIndex];
      setCurrentPhase(`Loading ${currentSeries.name}...`);

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

        // Add chunk to data
        chunkedData.push(...chunk);

        completedChunks++;
        const newProgress = (completedChunks / totalChunks) * 100;
        const newTotalPoints =
          chunkedData.length +
          processedSeries.reduce((sum, s) => sum + s.data.length, 0);

        setProgress(newProgress);
        setTotalPointsLoaded(newTotalPoints);

        // Update plot with current data
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
            newTotalPoints
          );
        }

        // Small delay for smooth visualization
        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            setTimeout(resolve, 30);
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
      const totalPoints = processedSeries.reduce(
        (sum, s) => sum + s.data.length,
        0
      );
      setCurrentPhase(
        `Complete - ${totalPoints.toLocaleString()} points loaded`
      );

      if (progressiveLoading.onComplete) {
        progressiveLoading.onComplete(totalPoints);
      }
    }, 200);
  }, [series, progressiveLoading, createTraces, currentPhase]);

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      loadDataProgressively();
    }, 100);

    return () => clearTimeout(timer);
  }, [loadDataProgressively]);

  // Plotly layout configuration
  const plotLayout = useMemo(
    () => ({
      title: {
        text: plotConfig.title,
      },
      xaxis: {
        title: {
          text: plotConfig.xAxisTitle,
        },
      },
      yaxis: {
        title: {
          text: plotConfig.yAxisTitle,
        },
      },
      showlegend: plotConfig.showLegend,
      legend: plotConfig.legendPosition,
      margin: plotConfig.margin,
    }),
    [plotConfig]
  );

  const plotlyConfig = useMemo(
    () => ({
      responsive: plotConfig.responsive,
      displayModeBar: true,
      displaylogo: false,
    }),
    [plotConfig]
  );

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: plotConfig.width,
        height: plotConfig.height,
        border: isComplete ? "3px solid #4CAF50" : "3px solid transparent",
        borderRadius: "8px",
        transition: "border 0.3s ease-in-out",
        ...style,
      }}
    >
      {/* Progress Indicator */}
      {progressiveLoading?.enabled &&
        progressiveLoading.showProgress &&
        isGenerating && (
          <div
            style={{
              position: "absolute",
              top: "15px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1001,
              display: "flex",
              alignItems: "center",
              gap: "15px",
              background: "rgba(255,255,255,0.95)",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid rgba(0,0,0,0.1)",
              backdropFilter: "blur(5px)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                border: "3px solid #4CAF50",
                borderTop: "3px solid transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
              {progressiveLoading.showPhase && (
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#4CAF50",
                  }}
                >
                  {currentPhase}
                </span>
              )}
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ fontSize: "10px" }}>
                  Progress: {Math.round(progress)}% (
                  {totalPointsLoaded.toLocaleString()} points)
                </span>
                <div
                  style={{
                    width: "100px",
                    height: "4px",
                    backgroundColor: "rgba(0,0,0,0.1)",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      backgroundColor: "#4CAF50",
                      borderRadius: "2px",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
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
            background: "rgba(76, 175, 80, 0.9)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          ✅ Complete!
        </div>
      )}

      <Plot
        data={plotData}
        layout={plotLayout}
        config={plotlyConfig}
        style={{
          width: "100%",
          height: "100%",
          minHeight: plotConfig.minHeight,
          transition: "all 0.3s ease-in-out",
          filter: isGenerating ? "brightness(0.9)" : "brightness(1)",
        }}
        useResizeHandler={plotConfig.useResizeHandler}
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
