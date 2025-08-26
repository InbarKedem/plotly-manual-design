import React, { useMemo } from "react";
import GenericPlotter from "./GenericPlotter";
import type { SeriesConfig, PlotConfig } from "./GenericPlotter";

// Quick demonstration showing the generic component can replicate your existing patterns
const QuickDemo: React.FC = () => {
  const series: SeriesConfig[] = useMemo(
    () => [
      {
        name: "Climate Data Sample",
        data: Array.from({ length: 100 }, (_, i) => {
          const x = i * 80; // Height 0-8000m
          const y = 3 + Math.sin(i * 0.05) * 2 + Math.random(); // Fuel consumption
          const speed = 30 + Math.random() * 70; // Speed 30-100 km/h
          const temp = 20 - x * 0.006 + Math.random() * 10; // Temperature with altitude

          return {
            x,
            y,
            z: speed,
            speed,
            temperature: temp,
            pressure: 1013 * Math.pow(1 - (x * 0.0065) / 288.15, 5.255),
          };
        }),
        mode: "lines+markers",
        line: {
          width: 3,
          dash: "solid",
          color: "rgba(55, 126, 184, 0.8)",
        },
        marker: {
          size: 4,
          colorFeature: "z", // Color by speed
          colorScale: [
            [0, "rgba(0, 0, 255, 0.8)"],
            [0.5, "rgba(255, 128, 0, 0.8)"],
            [1, "rgba(255, 0, 0, 0.8)"],
          ],
          showColorBar: true,
          colorBarTitle: "Speed (km/h)",
        },
        gradientLines: true,
      },
    ],
    []
  );

  const config: PlotConfig = {
    title: "Generic Component Demo - Replicating Your Graph Patterns",
    xAxisTitle: "Height (m)",
    yAxisTitle: "Fuel Consumption (L/100km)",
    legendPosition: { x: 1.1, y: 1.0 },
    margin: { r: 280 },
  };

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <GenericPlotter
        series={series}
        config={config}
        progressiveLoading={{
          enabled: true,
          chunkSize: 20,
          showProgress: true,
          showPhase: true,
        }}
      />
    </div>
  );
};

export default QuickDemo;
