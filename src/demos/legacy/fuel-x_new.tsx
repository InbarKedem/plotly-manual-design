import React, { useMemo } from "react";
import UnifiedPlotter from "../../UnifiedPlotter";
import type { SeriesConfig } from "../../types/PlotterTypes";
import { SCIENTIFIC_THEME } from "../../config/themes";
import { scientificScatterPreset } from "../../presets/scientific";

const FuelXChart: React.FC = () => {
  // Generate fuel consumption data with X-pattern
  const fuelData = useMemo(() => {
    const data = [];
    const numPoints = 300;

    for (let i = 0; i < numPoints; i++) {
      const t = (i / numPoints) * 2 * Math.PI; // Full rotation
      const time = i * 0.1; // Time in hours

      // Create X pattern with fuel consumption
      const baseConsumption = 15; // Base fuel consumption L/100km
      const xPatternConsumption = Math.abs(Math.sin(t * 2)) * 10; // X-pattern variation
      const randomVariation = (Math.random() - 0.5) * 3;

      const fuelConsumption =
        baseConsumption + xPatternConsumption + randomVariation;
      const speed = 60 + Math.sin(t) * 20 + randomVariation;

      data.push({
        x: time,
        y: fuelConsumption,
        metadata: {
          time: time.toFixed(1),
          fuel: fuelConsumption.toFixed(2),
          speed: speed.toFixed(1),
        },
      });
    }

    return data;
  }, []);

  const series: SeriesConfig[] = useMemo(
    () => [
      {
        name: "Fuel Consumption Pattern",
        data: fuelData,
        type: "scatter",
        mode: "lines+markers",
        marker: {
          size: 4,
          color: "#f59e0b",
          opacity: 0.8,
        },
        line: {
          color: "#f59e0b",
          width: 2,
          shape: "spline",
          smoothing: 0.8,
        },
        hovertemplate:
          "<b>Time:</b> %{x:.1f}h<br>" +
          "<b>Fuel:</b> %{y:.2f} L/100km<br>" +
          "<extra></extra>",
      },
    ],
    [fuelData]
  );

  return (
    <div style={{ width: "100%", height: "600px", padding: "20px" }}>
      <h3>⛽ Fuel Consumption Pattern (Migrated to UnifiedPlotter)</h3>
      <UnifiedPlotter
        series={series}
        config={{
          ...scientificScatterPreset.config,
          title: "Fuel Consumption Over Time - X Pattern",
          xAxis: {
            title: "Time (hours)",
            showgrid: true,
          },
          yAxis: {
            title: "Fuel Consumption (L/100km)",
            showgrid: true,
          },
        }}
        interactions={scientificScatterPreset.interactions}
        theme={SCIENTIFIC_THEME}
        debug={false}
        progressiveLoading={{ enabled: true, chunkSize: 50 }}
      />
    </div>
  );
};

export default FuelXChart;
