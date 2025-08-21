import Plot from "react-plotly.js";

const HeightTemperaturePlot = () => {
  // 1. Generate sample data with realistic relationships
  const numPoints = 80; // More sparse data points

  // Arrays for 4 different lines
  const height1 = [],
    temperature1 = [],
    speed1 = [];
  const height2 = [],
    temperature2 = [],
    speed2 = [];
  const height3 = [],
    temperature3 = [],
    speed3 = [];
  const height4 = [],
    temperature4 = [],
    speed4 = [];

  // Generate data for 4 different flight paths/behaviors
  for (let i = 0; i < numPoints; i++) {
    const currentHeight = i * 125; // Height from 0 to ~10000 meters

    // Line 1: Standard atmospheric behavior
    height1.push(currentHeight);
    const baseTemp1 =
      25 - (currentHeight / 1000) * 6.5 + (Math.random() - 0.5) * 8;
    temperature1.push(Math.max(-50, Math.min(30, baseTemp1)));
    const baseSpeed1 = 50 + Math.sin(i * 0.2) * 25 + Math.cos(i * 0.1) * 15;
    speed1.push(
      Math.max(20, Math.min(120, baseSpeed1 + (Math.random() - 0.5) * 8))
    );

    // Line 2: Warmer climate behavior (shifted temperature)
    height2.push(currentHeight);
    const baseTemp2 =
      35 - (currentHeight / 1000) * 5.5 + (Math.random() - 0.5) * 10;
    temperature2.push(Math.max(-40, Math.min(40, baseTemp2)));
    const baseSpeed2 = 70 + Math.sin(i * 0.15) * 30 + Math.cos(i * 0.25) * 20;
    speed2.push(
      Math.max(30, Math.min(140, baseSpeed2 + (Math.random() - 0.5) * 12))
    );

    // Line 3: Cold climate behavior
    height3.push(currentHeight);
    const baseTemp3 =
      10 - (currentHeight / 1000) * 7.0 + (Math.random() - 0.5) * 12;
    temperature3.push(Math.max(-60, Math.min(20, baseTemp3)));
    const baseSpeed3 = 40 + Math.sin(i * 0.3) * 20 + Math.cos(i * 0.2) * 25;
    speed3.push(
      Math.max(15, Math.min(100, baseSpeed3 + (Math.random() - 0.5) * 10))
    );

    // Line 4: High-speed behavior
    height4.push(currentHeight);
    const baseTemp4 =
      20 - (currentHeight / 1000) * 6.0 + (Math.random() - 0.5) * 6;
    temperature4.push(Math.max(-45, Math.min(35, baseTemp4)));
    const baseSpeed4 = 90 + Math.sin(i * 0.25) * 40 + Math.cos(i * 0.18) * 30;
    speed4.push(
      Math.max(50, Math.min(180, baseSpeed4 + (Math.random() - 0.5) * 15))
    );
  }

  // 2. Define the plot data and layout with 4 lines using markers for speed coloring
  const plotData = [
    {
      x: temperature1,
      y: height1,
      mode: "lines+markers" as const,
      type: "scatter" as const,
      name: "Standard Climate",
      line: {
        width: 3,
        color: "rgba(55, 126, 184, 0.6)",
      },
      marker: {
        size: 4,
        color: speed1,
        colorscale: "Viridis",
        showscale: true,
        colorbar: {
          title: "Speed (km/h)",
          x: 1.02,
        },
      },
    },
    {
      x: temperature2,
      y: height2,
      mode: "lines+markers" as const,
      type: "scatter" as const,
      name: "Warm Climate",
      line: {
        width: 3,
        color: "rgba(228, 26, 28, 0.6)",
      },
      marker: {
        size: 4,
        color: speed2,
        colorscale: "Plasma",
        showscale: false,
      },
    },
    {
      x: temperature3,
      y: height3,
      mode: "lines+markers" as const,
      type: "scatter" as const,
      name: "Cold Climate",
      line: {
        width: 3,
        color: "rgba(77, 175, 74, 0.6)",
      },
      marker: {
        size: 4,
        color: speed3,
        colorscale: "Blues",
        showscale: false,
      },
    },
    {
      x: temperature4,
      y: height4,
      mode: "lines+markers" as const,
      type: "scatter" as const,
      name: "High Speed",
      line: {
        width: 3,
        color: "rgba(152, 78, 163, 0.6)",
      },
      marker: {
        size: 4,
        color: speed4,
        colorscale: "Reds",
        showscale: false,
      },
    },
  ];

  const plotLayout = {
    title: {
      text: "Height vs. Temperature - Multiple Flight Behaviors",
    },
    xaxis: {
      title: {
        text: "Temperature (°C)",
      },
    },
    yaxis: {
      title: {
        text: "Height (meters)",
      },
    },
    showlegend: true,
    legend: {
      x: 0.02,
      y: 0.98,
    },
    // Optional: set a fixed size for the plot
    // width: 800,
    // height: 600,
  };

  console.log(
    "HeightTemperaturePlot rendering with",
    plotData.length,
    "traces"
  );
  return <Plot data={plotData} layout={plotLayout} />;
};

export default HeightTemperaturePlot;
