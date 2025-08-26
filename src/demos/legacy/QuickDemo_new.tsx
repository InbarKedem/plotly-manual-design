import React, { useMemo } from "react";
import UnifiedPlotter from "../../UnifiedPlotter";
import type { SeriesConfig } from "../../types/PlotterTypes";
import { LIGHT_THEME } from "../../config/themes";
import { scientificScatterPreset } from "../../presets/scientific";

const QuickDemo: React.FC = () => {
  // Generate quick demo data
  const quickData = useMemo(() => {
    const data = [];
    const numPoints = 50; // Keep it small for a "quick" demo

    for (let i = 0; i < numPoints; i++) {
      const x = i;
      const y = Math.sin(i * 0.3) * 10 + Math.random() * 5;

      data.push({
        x,
        y,
        metadata: {
          point: i,
          value: y.toFixed(2),
        },
      });
    }

    return data;
  }, []);

  const series: SeriesConfig[] = useMemo(
    () => [
      {
        name: "Quick Demo Data",
        data: quickData,
        type: "scatter",
        mode: "lines+markers",
        marker: {
          size: 6,
          color: "#10b981",
          opacity: 0.8,
        },
        line: {
          color: "#10b981",
          width: 3,
          shape: "spline",
          smoothing: 1.0,
        },
        hovertemplate:
          "<b>Point:</b> %{x}<br>" +
          "<b>Value:</b> %{y:.2f}<br>" +
          "<extra></extra>",
      },
    ],
    [quickData]
  );

  return (
    <div style={{ width: "100%", height: "500px", padding: "20px" }}>
      <h3>⚡ Quick Demo (Migrated to UnifiedPlotter)</h3>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        A simple, fast-loading demo with 50 data points
      </p>
      <UnifiedPlotter
        series={series}
        config={{
          ...scientificScatterPreset.config,
          title: "Quick Demo - Sin Wave with Noise",
          xAxis: {
            title: "Index",
            showgrid: true,
          },
          yAxis: {
            title: "Value",
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

export default QuickDemo;
