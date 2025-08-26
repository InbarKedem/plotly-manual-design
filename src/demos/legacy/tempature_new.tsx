import React, { useMemo } from "react";
import UnifiedPlotter from "../../UnifiedPlotter";
import type { SeriesConfig } from "../../types/PlotterTypes";
import { SCIENTIFIC_THEME } from "../../config/themes";
import { scientificScatterPreset } from "../../presets/scientific";

const TemperatureScatterPlot: React.FC = () => {
  // Generate modernized data using the new architecture
  const seriesData = useMemo(() => {
    const numPoints = 500;
    const data = [];

    for (let i = 0; i < numPoints; i++) {
      const distance = (i / numPoints) * 10000; // Distance from 0 to 10000 meters
      const speed = 60 + (Math.random() - 0.5) * 30; // Random speed around 60 km/h
      const temperature = Math.random() * 150; // Random temperature from 0 to 150

      data.push({
        x: distance,
        y: speed,
        metadata: {
          temperature: temperature.toFixed(1),
          distance: distance.toFixed(0),
          speed: speed.toFixed(1),
          color: temperature, // Store color value in metadata
        },
      });
    }

    return data;
  }, []);

  // Series configuration with modern approach
  const series: SeriesConfig[] = useMemo(
    () => [
      {
        name: "Speed vs Distance (Temperature Colored)",
        data: seriesData,
        type: "scatter",
        mode: "markers",
        marker: {
          size: 4,
          colorscale: "Bluered",
          showscale: true,
          colorbar: {
            title: "Temperature (°C)",
          },
          cmin: 0,
          cmax: 150,
        },
        hovertemplate:
          "<b>Distance:</b> %{x:.0f}m<br>" +
          "<b>Speed:</b> %{y:.1f} km/h<br>" +
          "<b>Temperature:</b> %{customdata[0]:.1f}°C<br>" +
          "<extra></extra>",
        customdata: seriesData.map((d) => [d.metadata.color]),
      },
    ],
    [seriesData]
  );

  return (
    <div style={{ width: "100%", height: "600px", padding: "20px" }}>
      <h3>🌡️ Temperature Scatter Plot (Migrated to UnifiedPlotter)</h3>
      <UnifiedPlotter
        series={series}
        config={{
          ...scientificScatterPreset.config,
          title: "Speed vs. Distance, Colored by Temperature",
          xAxis: {
            title: "Distance (meters)",
            showgrid: true,
          },
          yAxis: {
            title: "Speed (km/h)",
            showgrid: true,
          },
        }}
        interactions={scientificScatterPreset.interactions}
        theme={SCIENTIFIC_THEME}
        debug={false}
        progressiveLoading={{ enabled: true, chunkSize: 100 }}
      />
    </div>
  );
};

export default TemperatureScatterPlot;
