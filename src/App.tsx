import React, { useState } from "react";
import "./App.css";
import OrganizedScientificDemo from "./demos/OrganizedScientificDemo";
import InteractiveMultiSeriesDemo from "./demos/InteractiveMultiSeriesDemo";
import PerformanceTestDemo from "./demos/PerformanceTestDemo";
import EnhancedCurveStylingDemo from "./demos/EnhancedCurveStylingDemo";

interface TabConfig {
  name: string;
  component: React.ComponentType;
  category: "Unified";
  icon: string;
}

const tabs: TabConfig[] = [
  {
    name: "🎨 Enhanced Curve Styling",
    component: EnhancedCurveStylingDemo,
    category: "Unified",
    icon: "🎨",
  },
  {
    name: "⚡ Performance Test",
    component: PerformanceTestDemo,
    category: "Unified",
    icon: "⚡",
  },
  {
    name: "🧪 Organized Demo",
    component: OrganizedScientificDemo,
    category: "Unified",
    icon: "🧪",
  },
  {
    name: "📊 Interactive Multi-Series",
    component: InteractiveMultiSeriesDemo,
    category: "Unified",
    icon: "📊",
  },
];

const categoryColors = {
  Unified: "#8b5cf6",
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0); // Start with Enhanced Curve Styling

  const ActiveComponent = tabs[activeTab].component;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{ margin: "0 0 10px 0", fontSize: "28px", fontWeight: "bold" }}
        >
          🚀 Enhanced UnifiedPlotter Demo
        </h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: "16px" }}>
          Showcasing performance monitoring, validation, and enhanced features
        </p>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          padding: "0 20px",
          display: "flex",
          gap: "5px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            style={{
              background:
                activeTab === index
                  ? categoryColors[tab.category]
                  : "transparent",
              color: activeTab === index ? "white" : "#374151",
              border: "none",
              padding: "15px 20px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: activeTab === index ? "600" : "500",
              borderRadius: activeTab === index ? "8px 8px 0 0" : "0",
              transition: "all 0.3s ease",
              transform: activeTab === index ? "translateY(-2px)" : "none",
              boxShadow:
                activeTab === index ? "0 -2px 8px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Demo Content - Full Width */}
      <div style={{ minHeight: "calc(100vh - 140px)" }}>
        <ActiveComponent />
      </div>
    </div>
  );
};

export default App;
