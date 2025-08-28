import React from "react";
import UnifiedPlotter from "../../UnifiedPlotter";
import {
  generateTemperatureData,
  generateLinearData,
} from "../../data/generators";

// =============================================================================
// SIMPLIFIED LEGACY DEMO
// =============================================================================

const UnifiedDemo: React.FC = () => {
  // Simple data generation
  const temperatureData = generateTemperatureData(100);
  const linearData = generateLinearData(50, 2, 10, 0.5);

  const series = [
    {
      name: "Temperature",
      data: temperatureData,
      type: "scatter" as const,
      mode: "lines" as const,
    },
    {
      name: "Linear Trend",
      data: linearData,
      type: "scatter" as const,
      mode: "markers" as const,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Unified Demo (Legacy)</h1>
      <div style={{ marginBottom: "20px" }}>
        <UnifiedPlotter
          series={series}
          config={{
            title: "Legacy Demo Chart",
            height: 400,
            xAxis: { title: "Time" },
            yAxis: { title: "Value" },
          }}
        />
      </div>
    </div>
  );
};

export default UnifiedDemo;
