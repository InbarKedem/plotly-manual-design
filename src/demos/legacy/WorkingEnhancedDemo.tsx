import React from "react";
import EnhancedGenericPlotter from "./components/EnhancedGenericPlotter";
import { generateLinearData } from "../../data/generators";

const WorkingEnhancedDemo: React.FC = () => {
  const data = [
    {
      name: "Working Demo",
      data: generateLinearData(30, 1, 0, 0.3),
      type: "scatter" as const,
      mode: "lines+markers" as const,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Working Enhanced Demo</h1>
      <EnhancedGenericPlotter
        data={data}
        config={{
          title: "Working Enhanced Plotter Demo",
          height: 400,
        }}
      />
    </div>
  );
};

export default WorkingEnhancedDemo;
