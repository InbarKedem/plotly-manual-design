import Plot from "react-plotly.js";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// =============================================================================
// UNIFIED TYPES & INTERFACES
// =============================================================================

export interface DataPoint {
  x: number;
  y: number;
  z?: number;
  error_x?: number;
  error_y?: number;
  text?: string;
  hovertemplate?: string;
  [key: string]: any;
}

export interface LineOptions {
  width?: number;
  dash?: "solid" | "dash" | "dot" | "dashdot" | "longdash";
  shape?: "linear" | "spline" | "hv" | "vh" | "hvh" | "vhv";
  color?: string;
  opacity?: number;
  smoothing?: number;
}

export interface MarkerOptions {
  size?: number | number[];
  symbol?: string | string[];
  color?: string;
  colorFeature?: string;
  colorScale?: string | Array<[number, string]>;
  showColorBar?: boolean;
  colorBarTitle?: string;
  colorMin?: number;
  colorMax?: number;
  opacity?: number;
  sizeref?: number;
  sizemode?: "diameter" | "area";
  line?: {
    width?: number;
    color?: string;
  };
}

export interface ErrorBarOptions {
  x?: {
    type?: "data" | "percent" | "sqrt";
    visible?: boolean;
    color?: string;
    width?: number;
  };
  y?: {
    type?: "data" | "percent" | "sqrt";
    visible?: boolean;
    color?: string;
    width?: number;
  };
}

export interface SeriesConfig {
  name: string;
  data: DataPoint[];
  type?: string;
  mode?: "lines" | "markers" | "lines+markers" | "text" | "none";
  line?: LineOptions;
  marker?: MarkerOptions;
  errorBars?: ErrorBarOptions;
  fill?: string;
  fillcolor?: string;
  connectDots?: boolean;
  gradientLines?: boolean;
  visible?: boolean;
  showInLegend?: boolean;
  hoverinfo?: string;
  hovertemplate?: string;
  textposition?: string;
  textfont?: any;
  opacity?: number;
}

export interface AxisConfig {
  title?: string;
  type?: "linear" | "log" | "date" | "category";
  showgrid?: boolean;
  gridcolor?: string;
  zeroline?: boolean;
  range?: [number, number];
  autorange?: boolean;
  tickmode?: "linear" | "auto" | "array" | "sync";
  tick0?: number;
  dtick?: number;
  tickvals?: number[];
  ticktext?: string[];
}

export interface PlotConfig {
  title?: string;
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  width?: string | number;
  height?: string | number;
  minHeight?: string | number;
  showLegend?: boolean;
  legendPosition?: { x?: number; y?: number };
  margin?: { l?: number; r?: number; t?: number; b?: number };
  responsive?: boolean;
  useResizeHandler?: boolean;
  backgroundColor?: string;
  plotBackgroundColor?: string;
  font?: {
    family?: string;
    size?: number;
    color?: string;
  };
  annotations?: any[];
  shapes?: any[];
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
  showDataStats?: boolean;
  animationDuration?: number;
  onProgress?: (
    progress: number,
    phase: string,
    pointsLoaded: number,
    stats?: any
  ) => void;
  onComplete?: (totalPoints: number, stats?: any) => void;
}

export interface ThemeConfig {
  darkMode?: boolean;
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  surface?: string;
  colorPalette?: string[];
}

export interface UnifiedPlotterProps {
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
// MODERN COLORSCALES
// =============================================================================

const MODERN_COLORSCALES = {
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
// UTILITY FUNCTIONS
// =============================================================================

const calculateDataStats = (series: SeriesConfig[]) => {
  const allPoints = series.flatMap((s) => s.data);
  const totalPoints = allPoints.length;
  const seriesCount = series.length;

  const xValues = allPoints.map((p) => p.x).filter((x) => x != null);
  const yValues = allPoints.map((p) => p.y).filter((y) => y != null);
  const zValues = allPoints.map((p) => p.z).filter((z) => z != null);

  const xRange: [number, number] = [Math.min(...xValues), Math.max(...xValues)];
  const yRange: [number, number] = [Math.min(...yValues), Math.max(...yValues)];
  const zRange: [number, number] | null =
    zValues.length > 0 ? [Math.min(...zValues), Math.max(...zValues)] : null;

  const memoryUsage = `${Math.round(totalPoints * 0.1)}KB`;

  return { totalPoints, seriesCount, xRange, yRange, zRange, memoryUsage };
};

// =============================================================================
// MAIN UNIFIED COMPONENT
// =============================================================================

const UnifiedPlotter: React.FC<UnifiedPlotterProps> = ({
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
  const [currentPhase, setCurrentPhase] = useState("Ready");
  const [isGenerating, setIsGenerating] = useState(false);
  const [totalPointsLoaded, setTotalPointsLoaded] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [plotData, setPlotData] = useState<any[]>([]);
  const [dataStats, setDataStats] = useState<any>(null);

  const plotRef = useRef<any>(null);

  // Enhanced plot configuration
  const plotConfig = useMemo(
    () => ({
      title: config.title || "",
      xAxis: {
        title: config.xAxis?.title || "X Axis",
        type: config.xAxis?.type || "linear",
        showgrid: config.xAxis?.showgrid ?? true,
        gridcolor:
          config.xAxis?.gridcolor || (theme?.darkMode ? "#374151" : "#e5e7eb"),
        zeroline: config.xAxis?.zeroline ?? true,
        ...config.xAxis,
      },
      yAxis: {
        title: config.yAxis?.title || "Y Axis",
        type: config.yAxis?.type || "linear",
        showgrid: config.yAxis?.showgrid ?? true,
        gridcolor:
          config.yAxis?.gridcolor || (theme?.darkMode ? "#374151" : "#e5e7eb"),
        zeroline: config.yAxis?.zeroline ?? true,
        ...config.yAxis,
      },
      width: config.width || "100%",
      height: config.height || "500px",
      minHeight: config.minHeight || "400px",
      showLegend: config.showLegend ?? true,
      legendPosition: config.legendPosition || { x: 1.02, y: 1 },
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

  // Progressive loading
  const loadDataProgressively = useCallback(async () => {
    if (!progressiveLoading?.enabled) {
      setPlotData(createTraces());
      setDataStats(calculateDataStats(series));
      setIsComplete(true);
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setTotalPointsLoaded(0);

    const chunkSize = progressiveLoading.chunkSize || 50;
    const totalPoints = series.reduce((sum, s) => sum + s.data.length, 0);
    let loadedPoints = 0;
    const traces: any[] = [];

    for (let seriesIndex = 0; seriesIndex < series.length; seriesIndex++) {
      const seriesConfig = series[seriesIndex];
      setCurrentPhase(`Loading ${seriesConfig.name}...`);

      for (let i = 0; i < seriesConfig.data.length; i += chunkSize) {
        const chunk = seriesConfig.data.slice(i, i + chunkSize);
        const chunkSeries = { ...seriesConfig, data: chunk };

        traces.push(...createTracesForSeries(chunkSeries, seriesIndex));

        loadedPoints += chunk.length;
        const progressValue = (loadedPoints / totalPoints) * 100;

        setProgress(progressValue);
        setTotalPointsLoaded(loadedPoints);
        setPlotData([...traces]);

        if (progressiveLoading.onProgress) {
          progressiveLoading.onProgress(
            progressValue,
            currentPhase,
            loadedPoints
          );
        }

        await new Promise((resolve) =>
          setTimeout(resolve, progressiveLoading.animationDuration || 50)
        );
      }
    }

    const stats = calculateDataStats(series);
    setDataStats(stats);
    setCurrentPhase("Complete");
    setIsComplete(true);
    setIsGenerating(false);

    if (progressiveLoading.onComplete) {
      progressiveLoading.onComplete(totalPoints, stats);
    }
  }, [series, progressiveLoading]);

  // Create traces for all series
  const createTraces = useCallback(() => {
    return series.flatMap((seriesConfig, index) =>
      createTracesForSeries(seriesConfig, index)
    );
  }, [series]);

  // Create traces for a single series
  const createTracesForSeries = useCallback(
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

      const xValues = data.map((d) => d.x);
      const yValues = data.map((d) => d.y);
      const zValues = data.map((d) => d.z);
      const textValues = data.map((d) => d.text);

      const traces: any[] = [];

      // Gradient lines implementation
      if (gradientLines && connectDots && mode.includes("lines")) {
        const segmentColor =
          marker.colorFeature && zValues.some((z) => z != null)
            ? zValues
            : line.color || theme?.primary || "#3b82f6";

        for (let i = 0; i < data.length - 1; i++) {
          traces.push({
            x: [xValues[i], xValues[i + 1]],
            y: [yValues[i], yValues[i + 1]],
            mode: "lines",
            type: type,
            name: i === 0 ? `${name} (gradient)` : "",
            line: {
              width: line.width || 2,
              color: Array.isArray(segmentColor)
                ? segmentColor[i]
                : segmentColor,
              dash: line.dash || "solid",
              shape: line.shape || "linear",
            },
            showlegend: i === 0 && showInLegend,
            hoverinfo: "skip",
          });
        }
      }

      // Main trace
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
          color: line.color || theme?.primary || "#3b82f6",
          dash: line.dash || "solid",
          shape: line.shape || "linear",
          smoothing: line.smoothing,
        };
      }

      // Enhanced marker configuration
      if (mode.includes("markers")) {
        const markerConfig: any = {
          size: marker.size || 6,
          symbol: marker.symbol || "circle",
          opacity: marker.opacity || 0.8,
          line: marker.line,
        };

        if (
          marker.colorFeature &&
          data.some((d) => d[marker.colorFeature!] != null)
        ) {
          const colorValues = data.map((d) => d[marker.colorFeature!]);
          const colorMin =
            marker.colorMin ??
            Math.min(...colorValues.filter((v) => v != null));
          const colorMax =
            marker.colorMax ??
            Math.max(...colorValues.filter((v) => v != null));

          markerConfig.color = colorValues;

          if (
            marker.colorScale &&
            typeof marker.colorScale === "string" &&
            marker.colorScale in MODERN_COLORSCALES
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
            marker.color || line.color || theme?.primary || "#3b82f6";
        }

        mainTrace.marker = markerConfig;
      }

      // Error bars
      if (errorBars) {
        if (errorBars.x?.visible) {
          mainTrace.error_x = {
            type: errorBars.x.type || "data",
            array: data.map((d) => d.error_x),
            visible: true,
            color: errorBars.x.color || plotConfig.font.color,
            thickness: errorBars.x.width || 2,
          };
        }
        if (errorBars.y?.visible) {
          mainTrace.error_y = {
            type: errorBars.y.type || "data",
            array: data.map((d) => d.error_y),
            visible: true,
            color: errorBars.y.color || plotConfig.font.color,
            thickness: errorBars.y.width || 2,
          };
        }
      }

      traces.push(mainTrace);
      return traces;
    },
    [theme, plotConfig]
  );

  // Effect for loading data
  useEffect(() => {
    loadDataProgressively();
  }, [loadDataProgressively]);

  // Plotly layout
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

  // Plotly config
  const plotlyConfig = useMemo(
    () => ({
      responsive: plotConfig.responsive,
      displayModeBar: true,
      displaylogo: false,
      scrollZoom: interactionConfig.enableZoom,
      doubleClick: "reset+autosize" as const,
      toImageButtonOptions: {
        format: "png" as const,
        filename: "unified_plot",
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
        border: isComplete ? "3px solid #22c55e" : "3px solid transparent",
        borderRadius: "8px",
        transition: "all 0.3s ease-in-out",
        backgroundColor: plotConfig.backgroundColor,
        ...style,
      }}
    >
      {/* Progress indicator */}
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
                border: "3px solid #22c55e",
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

      {/* Completion indicator */}
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
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
          }}
        >
          ✓ Complete
        </div>
      )}

      {debugPanel}

      {/* Plot component */}
      <Plot
        ref={plotRef}
        data={plotData}
        layout={plotLayout}
        config={plotlyConfig}
        style={{ width: "100%", height: "100%" }}
        onClick={onPlotClick}
        onHover={onPlotHover}
        onSelected={onPlotSelect}
        onRelayout={onPlotZoom}
      />

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UnifiedPlotter;
