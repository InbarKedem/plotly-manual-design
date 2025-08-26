# 📈 Generic Multi-Series Chart Generator

The `createMultiSeriesChart` function allows you to create complex multi-series visualizations like the fuel consumption chart shown in the attached image. Here's how to use it:

## 🎯 Basic Usage

```tsx
import { createMultiSeriesChart } from "./PlotterUtils";

const chartConfig = createMultiSeriesChart({
  title: "My Multi-Series Chart",
  subtitle: "Optional subtitle",
  xAxis: {
    title: "X Axis Label",
    unit: "units", // Optional
  },
  yAxis: {
    title: "Y Axis Label",
    unit: "measurement", // Optional
  },
  groups: [
    {
      name: "Group 1",
      baseColor: "#3b82f6",
      variants: [
        {
          name: "Variant A",
          data: myData, // Array of {x, y, ...} objects
          style: {
            color: "#3b82f6",
            lineStyle: "solid",
            lineWidth: 2,
            markerSize: 6,
            opacity: 0.8,
          },
        },
        // More variants...
      ],
    },
    // More groups...
  ],
});

// Use in your component
<UnifiedPlotter {...chartConfig} />;
```

## 🔥 Recreating the Fuel Consumption Chart

The complex fuel consumption chart from the image can be created with:

```tsx
import { createFuelConsumptionChart } from "./PlotterUtils";

const FuelChartExample = () => {
  const chartData = createFuelConsumptionChart();

  return <UnifiedPlotter {...chartData} />;
};
```

This generates:

- **4 climate conditions** (Arctic, Temperate, Tropical, Desert)
- **3 variants each** (solid, dashed, dotted lines)
- **12 total curves** with realistic fuel consumption data
- **Temperature color mapping** on one variant per climate

## 🛠️ Custom Multi-Variant Data

For any custom scenario, use `generateMultiVariantData`:

```tsx
const variants = generateMultiVariantData(
  {
    xRange: [0, 100], // X axis range
    yRange: [0, 1000], // Y axis range
    count: 80, // Points per series
  },
  [
    {
      name: "Linear",
      xFunction: (t) => t, // X as function of parameter t (0-1)
      yFunction: (t) => t, // Y as function of parameter t (0-1)
      color: "#3b82f6",
      style: "solid",
      noiseLevel: 0.05, // Optional noise (0-1)
    },
    {
      name: "Exponential",
      xFunction: (t) => t,
      yFunction: (t) => t * t, // Quadratic growth
      color: "#ef4444",
      style: "dash",
      noiseLevel: 0.03,
    },
    // Add more variants...
  ]
);
```

## 📊 Real-World Examples

### Stock Analysis

```tsx
const stockChart = createGenericChartExample(
  "Stock Price Comparison",
  "Time (days)",
  "Price ($)",
  [
    {
      name: "Tech Stocks",
      color: "#3b82f6",
      datasets: [
        { name: "AAPL", data: appleData, lineStyle: "solid" },
        { name: "MSFT", data: microsoftData, lineStyle: "dash" },
      ],
    },
    {
      name: "Energy Stocks",
      color: "#ef4444",
      datasets: [
        { name: "XOM", data: exxonData, lineStyle: "solid" },
        { name: "CVX", data: chevronData, lineStyle: "dot" },
      ],
    },
  ]
);
```

### Scientific Experiments

```tsx
const experimentChart = createExperimentResultsChart(); // Pre-built example
```

### Climate Data

```tsx
const climateChart = createMultiSeriesChart({
  title: "Temperature Analysis Across Regions",
  xAxis: { title: "Month", unit: "index" },
  yAxis: { title: "Temperature", unit: "°C" },
  groups: [
    {
      name: "Northern Region",
      baseColor: "#1e40af",
      variants: [
        {
          name: "2022",
          data: north2022Data,
          style: { color: "#1e40af", lineStyle: "solid" },
        },
        {
          name: "2023",
          data: north2023Data,
          style: { color: "#1e40af", lineStyle: "dash" },
        },
        {
          name: "2024",
          data: north2024Data,
          style: { color: "#1e40af", lineStyle: "dot" },
        },
      ],
    },
    {
      name: "Southern Region",
      baseColor: "#dc2626",
      variants: [
        {
          name: "2022",
          data: south2022Data,
          style: { color: "#dc2626", lineStyle: "solid" },
        },
        {
          name: "2023",
          data: south2023Data,
          style: { color: "#dc2626", lineStyle: "dash" },
        },
        {
          name: "2024",
          data: south2024Data,
          style: { color: "#dc2626", lineStyle: "dot" },
        },
      ],
    },
  ],
});
```

## 🎨 Styling Options

### Line Styles

- `"solid"` - Solid line
- `"dash"` - Dashed line
- `"dot"` - Dotted line
- `"dashdot"` - Alternating dash-dot
- `"longdash"` - Long dashes

### Color Mapping

```tsx
{
  colorMapping: {
    feature: "temperature",           // Data property to map
    colorScale: "viridis",           // Color scale name
    showColorBar: true,              // Show color legend
    colorBarTitle: "Temperature (°C)" // Color bar label
  }
}
```

### Available Color Scales

- `"viridis"` - Purple to yellow
- `"plasma"` - Purple to pink to yellow
- `"turbo"` - Rainbow-like
- `"cividis"` - Blue to yellow (colorblind-friendly)
- `"rainbow"` - Full spectrum

## ⚡ Performance Features

- **Progressive Loading**: Large datasets load smoothly in chunks
- **WebGL Support**: Automatic fallback for better performance
- **Memory Optimization**: Efficient data handling
- **Interactive Features**: Zoom, pan, hover, selection

## 🔧 Advanced Configuration

```tsx
const advancedChart = createMultiSeriesChart({
  // Basic config...
  legend: {
    show: true,
    position: { x: 1.02, y: 1 },
    orientation: "vertical",
  },
  theme: "dark", // "light", "dark", "scientific", "vibrant"
  interactions: "scientific", // "basic", "scientific", "presentation"
  progressiveLoading: "smooth", // "fast", "smooth", "detailed"
});
```

This generic system eliminates the need for specific chart implementations while providing maximum flexibility for creating complex visualizations like the fuel consumption example.
