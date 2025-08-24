import Plot from "react-plotly.js";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import convert from "convert-units";

// Types for better code organization
interface ClimateData {
  heights: number[];
  temperatures: number[];
  speeds: number[];
  pressures: number[];
}

interface BezierControlPoints {
  p0: number;
  p1: number;
  p2: number;
  p3: number;
}

// Utility functions
const calculateCubicBezier = (
  t: number,
  { p0, p1, p2, p3 }: BezierControlPoints
): number => {
  const u = 1 - t;
  return (
    u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
  );
};

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

// Unit conversion functions
const convertDistance = (
  value: number,
  fromUnit: string,
  toUnit: string
): number => {
  // Convert to meters first
  let meters = value;
  switch (fromUnit) {
    case "feet":
      meters = value * 0.3048;
      break;
    case "kilometers":
      meters = value * 1000;
      break;
    case "miles":
      meters = value * 1609.34;
      break;
    case "meters":
      break; // already meters
  }

  // Convert from meters to target unit
  switch (toUnit) {
    case "feet":
      return meters / 0.3048;
    case "kilometers":
      return meters / 1000;
    case "miles":
      return meters / 1609.34;
    case "meters":
      return meters;
    default:
      return meters;
  }
};

const convertSpeed = (
  value: number,
  fromUnit: string,
  toUnit: string
): number => {
  // Convert to km/h first
  let kmh = value;
  switch (fromUnit) {
    case "mph":
      kmh = value * 1.60934;
      break;
    case "ms":
      kmh = value * 3.6;
      break;
    case "kmh":
      break; // already km/h
  }

  // Convert from km/h to target unit
  switch (toUnit) {
    case "mph":
      return kmh / 1.60934;
    case "ms":
      return kmh / 3.6;
    case "kmh":
      return kmh;
    default:
      return kmh;
  }
};

const convertTemperature = (
  value: number,
  fromUnit: string,
  toUnit: string
): number => {
  // Convert to Celsius first
  let celsius = value;
  switch (fromUnit) {
    case "fahrenheit":
      celsius = ((value - 32) * 5) / 9;
      break;
    case "kelvin":
      celsius = value - 273.15;
      break;
    case "celsius":
      break; // already celsius
  }

  // Convert from Celsius to target unit
  switch (toUnit) {
    case "fahrenheit":
      return (celsius * 9) / 5 + 32;
    case "kelvin":
      return celsius + 273.15;
    case "celsius":
      return celsius;
    default:
      return celsius;
  }
};

const convertSpeed = (
  value: number,
  fromUnit: string,
  toUnit: string
): number => {
  try {
    return convert(value)
      .from(fromUnit as any)
      .to(toUnit as any);
  } catch (error) {
    // Fallback manual conversion if convert-units doesn't support the units
    let kmh = value;

    // Convert to km/h first
    switch (fromUnit) {
      case "mph":
        kmh = value * 1.60934;
        break;
      case "ms":
        kmh = value * 3.6;
        break;
      case "kmh":
        break; // already km/h
      default:
        break;
    }

    // Convert from km/h to target unit
    switch (toUnit) {
      case "mph":
        return kmh / 1.60934;
      case "ms":
        return kmh / 3.6;
      case "kmh":
        return kmh;
      default:
        return kmh;
    }
  }
};

const getDistanceLabel = (unit: string): string => {
  switch (unit) {
    case "feet":
      return "Height (feet)";
    case "kilometers":
      return "Height (km)";
    case "miles":
      return "Height (miles)";
    case "meters":
      return "Height (meters)";
    default:
      return "Height (meters)";
  }
};

const getTemperatureLabel = (unit: string): string => {
  switch (unit) {
    case "fahrenheit":
      return "Temperature (°F)";
    case "kelvin":
      return "Temperature (K)";
    case "celsius":
      return "Temperature (°C)";
    default:
      return "Temperature (°C)";
  }
};

const getSpeedLabel = (unit: string): string => {
  switch (unit) {
    case "mph":
      return "Speed (mph)";
    case "ms":
      return "Speed (m/s)";
    case "kmh":
      return "Speed (km/h)";
    default:
      return "Speed (km/h)";
  }
};

// Smooth data generation function with controlled chunks
const generateClimateDataChunk = (
  startIndex: number,
  chunkSize: number,
  totalPoints: number,
  maxHeight: number,
  climateType: "temperate" | "desert" | "arctic" | "storm"
): ClimateData => {
  const climateConfigs = {
    temperate: { p0: 25, p1: 15, p2: -20, p3: -45 },
    desert: { p0: 55, p1: 45, p2: 10, p3: -20 },
    arctic: { p0: 5, p1: -30, p2: -15, p3: -80 },
    storm: { p0: 35, p1: 5, p2: 25, p3: -50 },
  };

  const controlPoints = climateConfigs[climateType];
  const data: ClimateData = {
    heights: [],
    temperatures: [],
    speeds: [],
    pressures: [],
  };

  for (let i = 0; i < chunkSize; i++) {
    const globalIndex = startIndex + i;
    const t = globalIndex / totalPoints;
    const currentHeight = t * maxHeight;

    data.heights.push(currentHeight);

    // Calculate base temperature using Bézier curve
    let temperature = calculateCubicBezier(t, controlPoints);

    // Add climate-specific variations
    switch (climateType) {
      case "temperate":
        temperature +=
          Math.sin(t * Math.PI * 2 + 0.5) * 4 +
          Math.cos(t * Math.PI * 1.5 + 1.2) * 3;
        temperature += (Math.random() - 0.5) * 2;
        temperature = clamp(temperature, -70, 40);
        break;

      case "desert":
        temperature +=
          Math.sin(t * Math.PI * 3 + 2.3) * 8 +
          Math.cos(t * Math.PI * 2.5 + 0.9) * 6;
        if (t > 0.3 && t < 0.6) {
          temperature += Math.sin((t - 0.3) * Math.PI * 6) * 10;
        }
        temperature += (Math.random() - 0.5) * 3;
        temperature = clamp(temperature, -25, 60);
        break;

      case "arctic":
        temperature +=
          Math.sin(t * Math.PI * 4 + 1.1) * 12 +
          Math.cos(t * Math.PI * 3 + 2.4) * 10;
        temperature += Math.sin(t * Math.PI * 6 + 0.6) * 8;
        if (t > 0.6) {
          temperature += Math.cos((t - 0.6) * Math.PI * 8) * 15;
        }
        temperature += (Math.random() - 0.5) * 5;
        temperature = clamp(temperature, -95, 15);
        break;

      case "storm":
        temperature +=
          Math.sin(t * Math.PI * 6 + 1.6) * 10 +
          Math.cos(t * Math.PI * 5 + 2.9) * 12;
        temperature +=
          Math.sin(t * Math.PI * 8 + 0.2) * 6 +
          Math.cos(t * Math.PI * 7 + 1.3) * 8;
        if (t > 0.7) {
          temperature += Math.sin((t - 0.7) * Math.PI * 10 + 2.7) * 12;
        }
        if (t > 0.2 && t < 0.5) {
          temperature += Math.cos((t - 0.2) * Math.PI * 15) * 10;
        }
        temperature += (Math.random() - 0.5) * 4;
        temperature = clamp(temperature, -65, 50);
        break;
    }

    data.temperatures.push(temperature);

    // Generate atmospheric pressure for gradient
    const basePressure = 1013 * Math.exp(-currentHeight / 8000);
    const pressureVariation =
      Math.sin(t * Math.PI * 2) * 50 + Math.cos(t * Math.PI * 1.5) * 30;
    data.pressures.push(basePressure + pressureVariation);

    // Generate speed data - completely random across the full range
    const randomSpeed = 15 + Math.random() * (130 - 15); // Random between 15-130 km/h
    data.speeds.push(randomSpeed);
  }

  return data;
};

const SmoothHeightTemperaturePlot = () => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("Ready to load");
  const [isGenerating, setIsGenerating] = useState(false);
  const [totalPointsLoaded, setTotalPointsLoaded] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  // Unit conversion state
  const [distanceUnit, setDistanceUnit] = useState("meters");
  const [temperatureUnit, setTemperatureUnit] = useState("celsius");
  const [speedUnit, setSpeedUnit] = useState("kmh");

  // Use refs to store data to avoid re-render loops
  const climateDataRef = useRef<Record<string, ClimateData>>({
    temperate: { heights: [], temperatures: [], speeds: [], pressures: [] },
    desert: { heights: [], temperatures: [], speeds: [], pressures: [] },
    arctic: { heights: [], temperatures: [], speeds: [], pressures: [] },
    storm: { heights: [], temperatures: [], speeds: [], pressures: [] },
  });

  const [plotData, setPlotData] = useState<any[]>([]);

  // Configuration
  const config = useMemo(
    () => ({
      NUM_POINTS: 100000, // 100K points per curve
      MAX_HEIGHT: 10000,
      CHUNK_SIZE: 10000, // Larger chunks for faster loading (was 5000)
      climateTypes: ["temperate", "desert", "arctic", "storm"] as const,
    }),
    []
  );

  // Create initial placeholder data
  const placeholderData = useMemo(() => {
    const createQuickTrace = (
      name: string,
      _colorScale: any,
      yOffset: number
    ) => {
      const heights = Array.from({ length: 500 }, (_, i) => (i / 500) * 10000);
      const temperatures = heights.map((h) => {
        const t = h / 10000;
        return 20 - h / 200 + Math.sin(t * Math.PI * 2) * 8 + yOffset;
      });
      const speeds = heights.map(() => {
        return 15 + Math.random() * (130 - 15); // Random between 15-130 km/h
      });

      // Apply unit conversions
      const convertedHeights = heights.map((h) =>
        convertDistance(h, "meters", distanceUnit)
      );
      const convertedTemperatures = temperatures.map((t) =>
        convertTemperature(t, "celsius", temperatureUnit)
      );
      const convertedSpeeds = speeds.map((s) =>
        convertSpeed(s, "kmh", speedUnit)
      );

      return {
        x: convertedTemperatures,
        y: convertedHeights,
        mode: "markers" as const,
        type: "scattergl" as const,
        name: `${name} (Preview)`,
        marker: {
          size: 2,
          color: convertedSpeeds,
          colorscale: colorScale,
          showscale: name.includes("Temperate"),
          colorbar: name.includes("Temperate")
            ? {
                title: getSpeedLabel(speedUnit),
                x: 1.02,
                y: 0.5,
                len: 0.8,
              }
            : undefined,
          cmin: 15,
          cmax: 130,
        },
      };
    };

    return [
      createQuickTrace("Temperate Climate", "Viridis", 0),
      createQuickTrace("Desert/Tropical", "Hot", 5),
      createQuickTrace("Arctic/Polar", "Blues", -8),
      createQuickTrace("Storm System", "Plasma", 8),
    ];
  }, [distanceUnit, temperatureUnit, speedUnit]);

  // Function to update plot data from current climate data
  const updatePlotData = useCallback(() => {
    const currentData = climateDataRef.current;

    const createTrace = (
      climateType: string,
      name: string,
      showColorbar: boolean
    ) => {
      const data = currentData[climateType];
      if (data.heights.length === 0) return null;

      // Apply unit conversions
      const convertedHeights = data.heights.map((h) =>
        convertDistance(h, "meters", distanceUnit)
      );
      const convertedTemperatures = data.temperatures.map((t) =>
        convertTemperature(t, "celsius", temperatureUnit)
      );
      const convertedSpeeds = data.speeds.map((s) =>
        convertSpeed(s, "kmh", speedUnit)
      );

      return {
        x: convertedTemperatures,
        y: convertedHeights,
        mode: "markers" as const,
        type: "scattergl" as const,
        name: `${name} (${data.heights.length.toLocaleString()} pts)`,
        marker: {
          size: 2,
          color: convertedSpeeds,
          colorscale: colorScale,
          showscale: showColorbar,
          colorbar: showColorbar
            ? {
                title: getSpeedLabel(speedUnit),
                x: 1.02,
                y: 0.5,
                len: 0.8,
                thickness: 15,
              }
            : undefined,
          cmin: convertSpeed(15, "kmh", speedUnit),
          cmax: convertSpeed(130, "kmh", speedUnit),
        },
      };
    };

    const traces = [
      createTrace("temperate", "Temperate Climate", "Viridis", true),
      createTrace("desert", "Desert/Tropical", "Hot", false),
      createTrace("arctic", "Arctic/Polar", "Blues", false),
      createTrace("storm", "Storm System", "Plasma", false),
    ].filter((trace) => trace !== null);

    setPlotData(traces.length > 0 ? traces : placeholderData);
  }, [placeholderData, distanceUnit, temperatureUnit, speedUnit]);

  // Smooth data generation with progressive updates and performance optimizations
  const generateDataSmooth = useCallback(async () => {
    setIsGenerating(true);
    setProgress(0);
    setTotalPointsLoaded(0);
    setIsComplete(false); // Reset completion state
    setCurrentPhase("Starting optimized data generation...");

    // Reset data
    climateDataRef.current = {
      temperate: { heights: [], temperatures: [], speeds: [], pressures: [] },
      desert: { heights: [], temperatures: [], speeds: [], pressures: [] },
      arctic: { heights: [], temperatures: [], speeds: [], pressures: [] },
      storm: { heights: [], temperatures: [], speeds: [], pressures: [] },
    };

    const { NUM_POINTS, MAX_HEIGHT, CHUNK_SIZE, climateTypes } = config;
    const totalChunks =
      Math.ceil(NUM_POINTS / CHUNK_SIZE) * climateTypes.length;
    let completedChunks = 0;

    // Process each climate type with optimized batching
    for (const climateType of climateTypes) {
      setCurrentPhase(`Loading ${climateType} climate data... (Optimized)`);

      for (
        let startIndex = 0;
        startIndex < NUM_POINTS;
        startIndex += CHUNK_SIZE
      ) {
        const remainingPoints = Math.min(CHUNK_SIZE, NUM_POINTS - startIndex);

        // Use requestAnimationFrame for smooth updates with optimized timing
        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            // Immediate execution with just frame sync for faster processing
            resolve(undefined);
          });
        });

        const chunkData = generateClimateDataChunk(
          startIndex,
          remainingPoints,
          NUM_POINTS,
          MAX_HEIGHT,
          climateType
        );

        // Add chunk to existing data
        const currentClimateData = climateDataRef.current[climateType];
        currentClimateData.heights.push(...chunkData.heights);
        currentClimateData.temperatures.push(...chunkData.temperatures);
        currentClimateData.speeds.push(...chunkData.speeds);
        currentClimateData.pressures.push(...chunkData.pressures);

        completedChunks++;
        const newProgress = (completedChunks / totalChunks) * 100;
        const newTotalPoints = Object.values(climateDataRef.current).reduce(
          (sum, data) => sum + data.heights.length,
          0
        );

        setProgress(newProgress);
        setTotalPointsLoaded(newTotalPoints);

        // Update plot every 4 chunks for faster loading while maintaining smoothness
        if (completedChunks % 4 === 0) {
          updatePlotData();
        }
      }
    }

    setCurrentPhase("Finalizing visualization...");
    updatePlotData(); // Final update
    setProgress(100);

    setTimeout(() => {
      setIsGenerating(false);
      setIsComplete(true);
      setCurrentPhase(`Complete - 400K points loaded (Optimized)`);
    }, 200); // Reduced delay for faster completion
  }, [config, updatePlotData]);

  // Start generation on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      generateDataSmooth();
    }, 100); // Small delay to ensure component is ready

    return () => clearTimeout(timer);
  }, [generateDataSmooth]);

  // Update plot when units change
  useEffect(() => {
    if (!isGenerating && climateDataRef.current.temperate.heights.length > 0) {
      // Reset completion state and show conversion indicator
      setIsComplete(false);
      setIsConverting(true);

      updatePlotData();

      // Set completion back after brief delay to show the change processed
      setTimeout(() => {
        setIsConverting(false);
        setIsComplete(true);
      }, 300); // Quick conversion feedback
    }
  }, [distanceUnit, temperatureUnit, speedUnit, updatePlotData, isGenerating]);

  // Layout configuration
  const plotLayout = useMemo(
    () => ({
      title: {
        text: "Height vs. Temperature with Speed Gradient - 100K Points Per Curve",
        font: { size: 16 },
      },
      xaxis: {
        title: { text: getTemperatureLabel(temperatureUnit) },
      },
      yaxis: {
        title: { text: getDistanceLabel(distanceUnit) },
      },
      showlegend: true,
      legend: {
        x: 1.25,
        y: 1.0,
        xanchor: "left" as const,
        yanchor: "top" as const,
      },
      margin: { r: 250 }, // Increased margin for colorbar
      hovermode: "closest" as const,
    }),
    [distanceUnit, temperatureUnit]
  );

  const plotConfig = useMemo(
    () => ({
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ["lasso2d", "select2d"] as any,
      displaylogo: false,
    }),
    []
  );

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        border: isComplete ? "3px solid #4CAF50" : "3px solid transparent",
        borderRadius: "12px",
        transition: "border 0.5s ease-in-out",
        boxShadow: isComplete ? "0 0 20px rgba(76, 175, 80, 0.3)" : "none",
      }}
    >
      {/* Unit Controls */}
      <div
        style={{
          position: "absolute",
          top: "15px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1001,
          display: "flex",
          gap: "15px",
          alignItems: "center",
          background: "rgba(255,255,255,0.95)",
          padding: "8px 16px",
          borderRadius: "8px",
          border: "1px solid rgba(0,0,0,0.1)",
          backdropFilter: "blur(5px)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ fontSize: "12px", fontWeight: "500", color: "#333" }}>
            Distance:
          </label>
          <select
            value={distanceUnit}
            onChange={(e) => setDistanceUnit(e.target.value)}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "12px",
              backgroundColor: "white",
            }}
          >
            <option value="meters">Meters</option>
            <option value="feet">Feet</option>
            <option value="kilometers">Kilometers</option>
            <option value="miles">Miles</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ fontSize: "12px", fontWeight: "500", color: "#333" }}>
            Temperature:
          </label>
          <select
            value={temperatureUnit}
            onChange={(e) => setTemperatureUnit(e.target.value)}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "12px",
              backgroundColor: "white",
            }}
          >
            <option value="celsius">Celsius (°C)</option>
            <option value="fahrenheit">Fahrenheit (°F)</option>
            <option value="kelvin">Kelvin (K)</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ fontSize: "12px", fontWeight: "500", color: "#333" }}>
            Speed:
          </label>
          <select
            value={speedUnit}
            onChange={(e) => setSpeedUnit(e.target.value)}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "12px",
              backgroundColor: "white",
            }}
          >
            <option value="kmh">km/h</option>
            <option value="mph">mph</option>
            <option value="ms">m/s</option>
          </select>
        </div>
      </div>
      {/* Smooth progress indicator */}
      {isGenerating && (
        <div
          style={{
            position: "absolute",
            top: "15px",
            left: "15px",
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.9), rgba(30,30,30,0.9))",
            color: "white",
            padding: "12px 16px",
            borderRadius: "10px",
            fontSize: "12px",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: "350px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              border: "3px solid #4CAF50",
              borderTop: "3px solid transparent",
              borderRadius: "50%",
              animation: "smoothSpin 1s linear infinite",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              flex: 1,
            }}
          >
            <span style={{ fontWeight: "bold", color: "#4CAF50" }}>
              {currentPhase}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "11px" }}>
                Progress: {Math.round(progress)}%
              </span>
              <div
                style={{
                  flex: 1,
                  height: "6px",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #4CAF50, #8BC34A)",
                    borderRadius: "3px",
                    transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </div>
            </div>
            <span style={{ fontSize: "10px", opacity: 0.8, color: "#81C784" }}>
              Points loaded: {totalPointsLoaded.toLocaleString()} • No browser
              freeze guaranteed
            </span>
          </div>
          <style>{`
            @keyframes smoothSpin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes completionPulse {
              0% { 
                transform: scale(0.8);
                opacity: 0;
              }
              50% { 
                transform: scale(1.05);
                opacity: 1;
              }
              100% { 
                transform: scale(1);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}

      {/* Live status indicator */}
      <div
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          background: isComplete
            ? "rgba(76, 175, 80, 0.9)"
            : isConverting
            ? "rgba(255, 193, 7, 0.9)"
            : "rgba(0,0,0,0.8)",
          color: "white",
          padding: "8px 12px",
          borderRadius: "6px",
          fontSize: "11px",
          zIndex: 1000,
          border: isComplete
            ? "1px solid rgba(76, 175, 80, 1)"
            : isConverting
            ? "1px solid rgba(255, 193, 7, 1)"
            : "1px solid rgba(76, 175, 80, 0.3)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {isComplete
          ? "✅ Complete"
          : isConverting
          ? "🔄 Converting"
          : "⚡ WebGL"}{" "}
        • {totalPointsLoaded.toLocaleString()} Points Live
      </div>

      {/* Completion celebration badge */}
      {isComplete && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "15px",
            background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold",
            zIndex: 1000,
            border: "2px solid #4CAF50",
            animation: "completionPulse 2s ease-in-out",
            boxShadow: "0 4px 15px rgba(76, 175, 80, 0.4)",
          }}
        >
          🎉 Data Loading Complete!
        </div>
      )}

      <Plot
        data={plotData}
        layout={plotLayout}
        config={plotConfig}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "450px",
          transition: "all 0.3s ease-in-out",
          filter: isGenerating ? "brightness(0.9)" : "brightness(1)",
        }}
        useResizeHandler={true}
      />
    </div>
  );
};

export default SmoothHeightTemperaturePlot;
