import React, { useMemo } from "react";
import UnifiedPlotter from "../../UnifiedPlotter";
import type { SeriesConfig } from "../../types/PlotterTypes";
import { LIGHT_THEME } from "../../config/themes";
import { scientificScatterPreset } from "../../presets/scientific";

const FuelSimpleChart: React.FC = () => {
  // Generate simple fuel efficiency data
  const fuelData = useMemo(() => {
    const data = [];
    const numPoints = 200;

    for (let i = 0; i < numPoints; i++) {
      const speed = 30 + (i / numPoints) * 90; // Speed from 30 to 120 km/h

      // Fuel efficiency curve (optimal around 60-80 km/h)
      const optimalSpeed = 70;
      const efficiency =
        25 - Math.abs(speed - optimalSpeed) * 0.1 - Math.random() * 2;

      data.push({
        x: speed,
        y: Math.max(5, efficiency), // Minimum 5 km/L
        metadata: {
          speed: speed.toFixed(0),
          efficiency: efficiency.toFixed(2),
        },
      });
    }

    return data;
  }, []);

  const series: SeriesConfig[] = useMemo(
    () => [
      {
        name: "Fuel Efficiency",
        data: fuelData,
        type: "scatter",
        mode: "lines+markers",
        marker: {
          size: 3,
          color: "#10b981",
          opacity: 0.8,
        },
        line: {
          color: "#10b981",
          width: 2,
          shape: "spline",
          smoothing: 0.9,
        },
        hovertemplate:
          "<b>Speed:</b> %{x:.0f} km/h<br>" +
          "<b>Efficiency:</b> %{y:.2f} km/L<br>" +
          "<extra></extra>",
      },
    ],
    [fuelData]
  );

  return (
    <div style={{ width: "100%", height: "600px", padding: "20px" }}>
      <h3>🚗 Simple Fuel Efficiency (Migrated to UnifiedPlotter)</h3>
      <UnifiedPlotter
        series={series}
        config={{
          ...scientificScatterPreset.config,
          title: "Fuel Efficiency vs Speed",
          xAxis: {
            title: "Speed (km/h)",
            showgrid: true,
          },
          yAxis: {
            title: "Fuel Efficiency (km/L)",
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

export default FuelSimpleChart;
