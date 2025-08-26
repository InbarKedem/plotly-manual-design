// Data types for the generic plotter
export interface DataPoint {
  x: number;
  y: number;
  z?: number; // Third feature for coloring
  speed?: number;
  temperature?: number;
  pressure?: number;
  altitude?: number;
  fuelConsumption?: number;
  price?: number;
  volume?: number;
  change?: number;
  windSpeed?: number;
  text?: string;
  error_x?: number;
  error_y?: number;
}

export interface BezierPoints {
  p0: number;
  p1: number;
  p2: number;
  p3: number;
}

export interface ClimateDataConfig {
  name: string;
  color: string;
  bezier: BezierPoints;
  baseSpeed?: number;
  speedVariation?: number;
  temperatureRange?: [number, number];
  pressureRange?: [number, number];
}

// Cubic Bezier calculation for realistic curves
const calculateCubicBezier = (t: number, bezier: BezierPoints): number => {
  const { p0, p1, p2, p3 } = bezier;
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return uuu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p3;
};

// Predefined climate configurations
export const CLIMATE_CONFIGS: Record<string, ClimateDataConfig> = {
  temperate: {
    name: "Temperate Climate",
    color: "#3498db",
    bezier: { p0: 3.2, p1: 5.8, p2: 4.5, p3: 1.4 },
    baseSpeed: 60,
    speedVariation: 25,
    temperatureRange: [5, 25],
    pressureRange: [1010, 1025],
  },
  desert: {
    name: "Desert Climate",
    color: "#e74c3c",
    bezier: { p0: 2.8, p1: 4.2, p2: 3.8, p3: 1.8 },
    baseSpeed: 70,
    speedVariation: 30,
    temperatureRange: [15, 45],
    pressureRange: [1005, 1020],
  },
  arctic: {
    name: "Arctic Climate",
    color: "#9b59b6",
    bezier: { p0: 4.5, p1: 6.2, p2: 5.1, p3: 2.2 },
    baseSpeed: 45,
    speedVariation: 20,
    temperatureRange: [-30, 5],
    pressureRange: [1015, 1030],
  },
  tropical: {
    name: "Tropical Climate",
    color: "#27ae60",
    bezier: { p0: 3.8, p1: 5.2, p2: 4.8, p3: 1.6 },
    baseSpeed: 55,
    speedVariation: 22,
    temperatureRange: [20, 35],
    pressureRange: [1008, 1018],
  },
};

// Generate realistic climate data
export const generateClimateData = (
  numPoints: number,
  config: ClimateDataConfig,
  maxX: number = 10000
): DataPoint[] => {
  const data: DataPoint[] = [];
  const {
    bezier,
    baseSpeed = 50,
    speedVariation = 30,
    temperatureRange = [0, 30],
    pressureRange = [1000, 1020],
  } = config;

  for (let i = 0; i < numPoints; i++) {
    const t = i / numPoints;
    const x = t * maxX;
    const y = calculateCubicBezier(t, bezier);

    // Generate realistic speed with some correlation to fuel consumption
    const speedNoise = (Math.random() - 0.5) * speedVariation;
    const fuelInfluence = (y - bezier.p0) / (bezier.p3 - bezier.p0); // 0-1 based on fuel consumption
    const speed = Math.max(
      15,
      Math.min(130, baseSpeed + speedNoise - fuelInfluence * 20)
    );

    // Generate temperature with altitude correlation
    const altitude = x;
    const baseTemp =
      temperatureRange[0] +
      (temperatureRange[1] - temperatureRange[0]) * Math.random();
    const altitudeEffect = -0.0065 * altitude; // Standard lapse rate
    const temperature = baseTemp + altitudeEffect + (Math.random() - 0.5) * 10;

    // Generate pressure with altitude correlation
    const basePressure =
      pressureRange[0] + (pressureRange[1] - pressureRange[0]) * Math.random();
    const pressureAltitudeEffect =
      basePressure * Math.pow(1 - (0.0065 * altitude) / 288.15, 5.255);
    const pressure = Math.max(
      300,
      pressureAltitudeEffect + (Math.random() - 0.5) * 50
    );

    data.push({
      x,
      y,
      z: speed,
      speed,
      temperature,
      pressure,
      altitude,
      fuelConsumption: y,
    });
  }

  return data;
};

// ================================================================================
// MATHEMATICAL FUNCTIONS
// ================================================================================

// Generate sine wave data
export const generateSineWave = (
  numPoints: number,
  amplitude: number = 1,
  frequency: number = 1,
  phase: number = 0,
  noise: number = 0,
  xRange: [number, number] = [0, 10]
): DataPoint[] => {
  const data: DataPoint[] = [];
  const [xMin, xMax] = xRange;

  for (let i = 0; i < numPoints; i++) {
    const x = xMin + (i / numPoints) * (xMax - xMin);
    const y =
      amplitude * Math.sin(frequency * x + phase) +
      (Math.random() - 0.5) * noise;
    const z = Math.abs(y) + Math.random() * 10; // Use absolute value for coloring

    data.push({ x, y, z });
  }

  return data;
};

// Generate polynomial data
export const generatePolynomial = (
  numPoints: number,
  coefficients: number[],
  xRange: [number, number] = [0, 10],
  noise: number = 0
): DataPoint[] => {
  const data: DataPoint[] = [];
  const [xMin, xMax] = xRange;

  for (let i = 0; i < numPoints; i++) {
    const x = xMin + (i / numPoints) * (xMax - xMin);
    let y = 0;

    // Calculate polynomial value
    coefficients.forEach((coef, power) => {
      y += coef * Math.pow(x, power);
    });

    y += (Math.random() - 0.5) * noise;
    const z = x + Math.random() * 5; // Use x-value plus noise for coloring

    data.push({ x, y, z });
  }

  return data;
};

// Generate exponential data
export const generateExponential = (
  numPoints: number,
  base: number = Math.E,
  scale: number = 1,
  xRange: [number, number] = [0, 5],
  noise: number = 0
): DataPoint[] => {
  const data: DataPoint[] = [];
  const [xMin, xMax] = xRange;

  for (let i = 0; i < numPoints; i++) {
    const x = xMin + (i / numPoints) * (xMax - xMin);
    const y = scale * Math.pow(base, x) + (Math.random() - 0.5) * noise;
    const z = y + Math.random() * (y * 0.1); // Color based on y-value with variation

    data.push({ x, y, z });
  }

  return data;
};

// ================================================================================
// REALISTIC DATA GENERATORS
// ================================================================================

// Generate atmospheric profile data
export const generateAtmosphericProfile = (
  numPoints: number,
  maxAltitude: number = 15000
): DataPoint[] => {
  const data: DataPoint[] = [];

  for (let i = 0; i < numPoints; i++) {
    const altitude = (i / numPoints) * maxAltitude;

    // Standard atmosphere model
    const seaLevelTemp = 15; // °C
    const lapseRate = 0.0065; // °C/m
    const temperature =
      seaLevelTemp - lapseRate * altitude + (Math.random() - 0.5) * 5;

    // Pressure calculation
    const seaLevelPressure = 1013.25; // hPa
    const pressure =
      seaLevelPressure * Math.pow(1 - (lapseRate * altitude) / 288.15, 5.255);

    // Wind speed (simplified model)
    const windSpeed = 10 + altitude * 0.01 + (Math.random() - 0.5) * 20;

    data.push({
      x: altitude,
      y: temperature,
      z: pressure,
      altitude,
      temperature,
      pressure,
      windSpeed: Math.max(0, windSpeed),
    });
  }

  return data;
};

// Generate stock price data
export const generateStockData = (
  numPoints: number,
  initialPrice: number = 100,
  volatility: number = 0.02,
  trend: number = 0.001
): DataPoint[] => {
  const data: DataPoint[] = [];
  let currentPrice = initialPrice;

  for (let i = 0; i < numPoints; i++) {
    // Random walk with trend
    const randomChange = (Math.random() - 0.5) * volatility * currentPrice;
    const trendChange = trend * currentPrice;
    currentPrice = Math.max(1, currentPrice + randomChange + trendChange);

    // Volume (random with some correlation to price changes)
    const volume = 1000 + Math.random() * 5000 + Math.abs(randomChange) * 100;

    data.push({
      x: i,
      y: currentPrice,
      z: volume,
      price: currentPrice,
      volume,
      change: randomChange,
    });
  }

  return data;
};

// ================================================================================
// UTILITY FUNCTIONS
// ================================================================================

// Add noise to existing data
export const addNoise = (
  data: DataPoint[],
  noiseLevel: number
): DataPoint[] => {
  return data.map((point) => ({
    ...point,
    y: point.y + (Math.random() - 0.5) * noiseLevel,
  }));
};

// Smooth data using moving average
export const smoothData = (
  data: DataPoint[],
  windowSize: number
): DataPoint[] => {
  if (windowSize <= 1) return data;

  const smoothed: DataPoint[] = [];
  const halfWindow = Math.floor(windowSize / 2);

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - halfWindow);
    const end = Math.min(data.length - 1, i + halfWindow);

    let sumY = 0;
    let count = 0;

    for (let j = start; j <= end; j++) {
      sumY += data[j].y;
      count++;
    }

    smoothed.push({
      ...data[i],
      y: sumY / count,
    });
  }

  return smoothed;
};

// Resample data to different density
export const resampleData = (
  data: DataPoint[],
  newSize: number
): DataPoint[] => {
  if (newSize >= data.length) return data;

  const resampled: DataPoint[] = [];
  const step = data.length / newSize;

  for (let i = 0; i < newSize; i++) {
    const index = Math.round(i * step);
    if (index < data.length) {
      resampled.push(data[index]);
    }
  }

  return resampled;
};

// Normalize data to 0-1 range
export const normalizeData = (
  data: DataPoint[],
  property: keyof DataPoint = "y"
): DataPoint[] => {
  const values = data
    .map((d) => d[property] as number)
    .filter((v) => typeof v === "number");
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  if (range === 0) return data;

  return data.map((point) => ({
    ...point,
    [property]:
      typeof point[property] === "number"
        ? ((point[property] as number) - min) / range
        : point[property],
  }));
};
