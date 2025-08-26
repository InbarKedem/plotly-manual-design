import React, { useState } from "react";
import "./App.css";
import TemperatureChart from "./tempature";
import HeightTemperatureChart from "./height-temperature";
import HeightTemperatureSimple from "./height-temperature-simple";
import HeightTemperatureMillionChart from "./height-temperature-million";
import FuelXChart from "./fuel-x";
import FuelSimpleChart from "./fuel-simple";
import GenericPlotterDemo2 from "./GenericPlotterDemo2";
import QuickDemo from "./QuickDemo";
import WorkingEnhancedDemo from "./WorkingEnhancedDemo";

interface TabConfig {
  name: string;
  component: React.ComponentType;
  category: "Original" | "Generic" | "Enhanced";
  icon: string;
}

const tabs: TabConfig[] = [
  {
    name: "Temperature",
    component: TemperatureChart,
    category: "Original",
    icon: "🌡️",
  },
  {
    name: "Height-Temp",
    component: HeightTemperatureChart,
    category: "Original",
    icon: "📊",
  },
  {
    name: "Height-Simple",
    component: HeightTemperatureSimple,
    category: "Original",
    icon: "📈",
  },
  {
    name: "Height-Million",
    component: HeightTemperatureMillionChart,
    category: "Original",
    icon: "🔥",
  },
  { name: "Fuel-X", component: FuelXChart, category: "Original", icon: "⛽" },
  {
    name: "Fuel-Simple",
    component: FuelSimpleChart,
    category: "Original",
    icon: "🚗",
  },
  {
    name: "Generic Demo",
    component: GenericPlotterDemo2,
    category: "Generic",
    icon: "🎯",
  },
  { name: "Quick Demo", component: QuickDemo, category: "Generic", icon: "⚡" },
  {
    name: "Enhanced Demo",
    component: WorkingEnhancedDemo,
    category: "Enhanced",
    icon: "🚀",
  },
];

const categoryColors = {
  Original: "#64748b",
  Generic: "#0070f3",
  Enhanced: "#8b5cf6",
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(8); // Start with Enhanced Demo
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const filteredTabs =
    filterCategory === "All"
      ? tabs
      : tabs.filter((tab) => tab.category === filterCategory);

  const ActiveComponent = tabs[activeTab].component;
  const activeTabInfo = tabs[activeTab];

  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "30px",
            borderRadius: "16px",
            margin: "20px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="rgba(255,255,255,0.05)" points="0,0 1000,300 1000,1000 0,700"/></svg>\')',
              backgroundSize: "cover",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{ margin: 0, fontSize: "2.5em", fontWeight: "bold" }}>
              🚀 React Plotly Demo - Enhanced Edition
            </h1>
            <p
              style={{ margin: "10px 0 0 0", fontSize: "1.2em", opacity: 0.95 }}
            >
              From basic charts to modern enhanced visualization components
            </p>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <div
          style={{
            display: "inline-flex",
            gap: "10px",
            padding: "8px",
            background: "#f8fafc",
            borderRadius: "12px",
            border: "2px solid #e2e8f0",
          }}
        >
          {["All", "Original", "Generic", "Enhanced"].map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background:
                  filterCategory === category
                    ? category === "All"
                      ? "#64748b"
                      : categoryColors[category as keyof typeof categoryColors]
                    : "transparent",
                color: filterCategory === category ? "white" : "#64748b",
                fontWeight: filterCategory === category ? "600" : "normal",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontSize: "14px",
              }}
            >
              {category === "All"
                ? "All"
                : category === "Original"
                ? `📊 ${category}`
                : category === "Generic"
                ? `🎯 ${category}`
                : `🚀 ${category}`}
              {category !== "All" &&
                ` (${tabs.filter((tab) => tab.category === category).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Active Tab Info */}
      <div
        style={{
          textAlign: "center",
          margin: "20px",
          padding: "15px",
          background: `linear-gradient(135deg, ${
            categoryColors[activeTabInfo.category]
          }, ${categoryColors[activeTabInfo.category]}cc)`,
          color: "white",
          borderRadius: "12px",
        }}
      >
        <span style={{ fontSize: "24px", marginRight: "10px" }}>
          {activeTabInfo.icon}
        </span>
        <strong>{activeTabInfo.name}</strong> - {activeTabInfo.category} Example
      </div>

      {/* Tab Navigation */}
      <div
        className="tab-container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "0 20px",
          gap: "8px",
        }}
      >
        {(filterCategory === "All" ? tabs : filteredTabs).map((tab) => {
          const originalIndex = tabs.indexOf(tab);
          const categoryColor = categoryColors[tab.category];
          const isActive = originalIndex === activeTab;

          return (
            <button
              key={originalIndex}
              onClick={() => setActiveTab(originalIndex)}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: isActive
                  ? `3px solid ${categoryColor}`
                  : "2px solid #e2e8f0",
                background: isActive ? categoryColor : "white",
                color: isActive ? "white" : "#333",
                cursor: "pointer",
                fontWeight: isActive ? "bold" : "normal",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                minWidth: "140px",
                justifyContent: "center",
                boxShadow: isActive
                  ? `0 4px 12px ${categoryColor}40`
                  : "0 2px 4px rgba(0,0,0,0.05)",
                transform: isActive ? "translateY(-2px)" : "translateY(0px)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(0,0,0,0.05)";
                }
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      <main className="main-content" style={{ padding: "0 20px" }}>
        <ActiveComponent />
      </main>

      {/* Footer with Info */}
      <footer
        style={{
          margin: "50px 20px 20px 20px",
          padding: "30px",
          background: "#1e293b",
          color: "white",
          borderRadius: "16px",
          textAlign: "center",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>🎯 Evolution Timeline</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div>
            <div style={{ color: "#64748b", fontWeight: "bold" }}>
              📊 ORIGINAL
            </div>
            <div style={{ fontSize: "14px", opacity: 0.8, marginTop: "5px" }}>
              Individual chart components
              <br />
              Basic Plotly.js integration
            </div>
          </div>
          <div>
            <div style={{ color: "#0070f3", fontWeight: "bold" }}>
              🎯 GENERIC
            </div>
            <div style={{ fontSize: "14px", opacity: 0.8, marginTop: "5px" }}>
              Universal plotting component
              <br />
              Reusable configuration system
            </div>
          </div>
          <div>
            <div style={{ color: "#8b5cf6", fontWeight: "bold" }}>
              🚀 ENHANCED
            </div>
            <div style={{ fontSize: "14px", opacity: 0.8, marginTop: "5px" }}>
              Modern UI/UX patterns
              <br />
              Advanced features & performance
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "25px",
            fontSize: "14px",
            opacity: 0.7,
            borderTop: "1px solid #374151",
            paddingTop: "15px",
          }}
        >
          React {React.version} • TypeScript • Plotly.js • Vite
        </div>
      </footer>
    </div>
  );
};

export default App;
