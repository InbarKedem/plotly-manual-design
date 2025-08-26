import React, { useMemo } from "react";
import UnifiedPlotter from "../../UnifiedPlotter";
import type { SeriesConfig } from "../../types/PlotterTypes";
import { LIGHT_THEME } from "../../config/themes";
import { scientificScatterPreset } from "../../presets/scientific";

const HeightTemperatureSimple: React.FC = () => {
  // Generate simple height vs temperature data
  const simpleData = useMemo(() => {
    const data = [];
    const numPoints = 100;

    for (let i = 0; i < numPoints; i++) {
      const height = (i / numPoints) * 5000; // Height from 0 to 5000m
      const baseTemp = 20 - (height / 1000) * 6.5; // Standard atmospheric lapse rate
      const variation = (Math.random() - 0.5) * 4; // Add some variation
      const temperature = baseTemp + variation;
      
      data.push({
        x: height,
        y: temperature,
        metadata: {
          height: height.toFixed(0),
          temperature: temperature.toFixed(1),
        },
      });
    }

    return data;
  }, []);

  const series: SeriesConfig[] = useMemo(
    () => [
      {
        name: "Temperature vs Altitude",
        data: simpleData,
        type: "scatter",
        mode: "lines+markers",
        marker: {
          size: 4,
          color: "#3b82f6",
          opacity: 0.7,
        },
        line: {
          color: "#3b82f6",
          width: 2,
        },
        hovertemplate: 
          "<b>Height:</b> %{x:.0f}m<br>" +
          "<b>Temperature:</b> %{y:.1f}°C<br>" +
          "<extra></extra>",
      },
    ],
    [simpleData]
  );

  return (
    <div style={{ width: "100%", height: "600px", padding: "20px" }}>
      <h3>📈 Simple Height-Temperature (Migrated to UnifiedPlotter)</h3>
      <UnifiedPlotter
        series={series}
        config={{
          ...scientificScatterPreset.config,
          title: "Temperature vs Altitude (Simple Model)",
          xAxis: {
            title: "Height (meters)",
            showgrid: true,
          },
          yAxis: {
            title: "Temperature (°C)",
            showgrid: true,
          },
        }}
        interactions={scientificScatterPreset.interactions}
        theme={LIGHT_THEME}
        debug={false}
        progressiveLoading={{ enabled: false }}
      />
    </div>
  );
};

export default HeightTemperatureSimple;
