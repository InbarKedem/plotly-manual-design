import Plot from "react-plotly.js";
import { useMemo } from "react";

const TemperatureScatterPlot = () => {
  // Generate data only once using useMemo to prevent regeneration on every render
  const { plotData, plotLayout } = useMemo(() => {
    // 1. Generate sample data directly in JavaScript
    const numPoints = 500; // Reduced to 500 points for better performance
    const distance = [];
    const speed = [];
    const temperature = [];

    for (let i = 0; i < numPoints; i++) {
      distance.push((i / numPoints) * 10000); // Distance from 0 to 10000 meters
      speed.push(60 + (Math.random() - 0.5) * 30); // Random speed around 60 km/h
      temperature.push(Math.random() * 150); // Random temperature from 0 to 150
    }

    // 2. Define the plot data and layout
    const data = [
      {
        x: distance,
        y: speed,
        mode: "markers" as const,
        type: "scatter" as const,
        marker: {
          color: temperature, // This array determines the color of each point
          colorscale: "Bluered", // The blue-to-red color gradient
          showscale: true, // This displays the color bar legend
          cmin: 0, // Manually set the minimum for the color scale
          cmax: 150, // Manually set the maximum for the color scale
          colorbar: {
            title: "Temperature (°C)", // Title for the color bar
          },
          size: 3, // Slightly smaller markers for better performance
        },
      },
    ];

    const layout = {
      title: {
        text: "Speed vs. Distance, Colored by Temperature",
      },
      xaxis: {
        title: {
          text: "Distance (meters)",
        },
      },
      yaxis: {
        title: {
          text: "Speed (km/h)",
        },
      },
    };

    return { plotData: data, plotLayout: layout };
  }, []); // Empty dependency array means this runs only once

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Plot
        data={plotData}
        layout={plotLayout}
        config={{
          responsive: true,
        }}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "450px",
        }}
        useResizeHandler={true}
      />
    </div>
  );
};

export default TemperatureScatterPlot;
