import "./App.css";
import TemperatureScatterPlot from "./tempature";
import HeightTemperaturePlot from "./height-temperature";
import SmoothHeightTemperaturePlot from "./height-temperature-million";
import HeightTemperatureSimplePlot from "./fuel-x";
import FuelConsumptionSimple from "./fuel-simple";

function App() {
  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "60px",
      }}
    >
      <div
        style={{
          minHeight: "600px",
          width: "100%",
          marginBottom: "40px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: "#fafafa",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#333" }}>
          Temperature Scatter Plot
        </h2>
        <div style={{ width: "100%", height: "500px" }}>
          <TemperatureScatterPlot />
        </div>
      </div>

      <div
        style={{
          minHeight: "600px",
          width: "100%",
          marginBottom: "40px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: "#fafafa",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#333" }}>
          Height vs Temperature Plot (1000 points per curve)
        </h2>
        <div style={{ width: "100%", height: "500px" }}>
          <HeightTemperaturePlot />
        </div>
      </div>

      <div
        style={{
          minHeight: "600px",
          width: "100%",
          marginBottom: "40px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: "#fafafa",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#333" }}>
          Smooth Loading High-Density Plot (100K points per curve - No Browser
          Freeze)
        </h2>
        <div style={{ width: "100%", height: "500px" }}>
          <SmoothHeightTemperaturePlot />
        </div>
      </div>

      <div
        style={{
          minHeight: "600px",
          width: "100%",
          marginBottom: "40px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: "#fafafa",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#333" }}>
          Fuel Consumption Analysis - 3 Variants per Climate (12 curves)
        </h2>
        <div style={{ width: "100%", height: "500px" }}>
          <HeightTemperatureSimplePlot />
        </div>
      </div>

      <div
        style={{
          minHeight: "600px",
          width: "100%",
          marginBottom: "40px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: "#fafafa",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#333" }}>
          Fuel Consumption - 5 Line Styles with Same Pressure Scale
        </h2>
        <div style={{ width: "100%", height: "500px" }}>
          <FuelConsumptionSimple />
        </div>
      </div>
    </div>
  );
}

export default App;
