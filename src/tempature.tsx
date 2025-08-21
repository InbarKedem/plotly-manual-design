import React from "react";
import Plot from "react-plotly.js";

const TemperatureScatterPlot = () => {
  // 1. Generate sample data directly in JavaScript
  const numPoints = 50;
  const distance = [];
  const speed = [];
  const temperature = [];

  for (let i = 0; i < numPoints; i++) {
    distance.push(i * 100); // Distance from 0 to 4900 meters
    speed.push(60 + (Math.random() - 0.5) * 30); // Random speed around 60 km/h
    temperature.push(Math.random() * 150); // Random temperature from 0 to 150
  }

  // 2. Define the plot data and layout
  const plotData = [
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
      },
    },
  ];

  const plotLayout = {
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
    // Optional: set a fixed size for the plot
    // width: 800,
    // height: 600,
  };

  return <Plot data={plotData} layout={plotLayout} />;
};

export default TemperatureScatterPlot;
