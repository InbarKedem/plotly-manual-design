import "./App.css";
import TemperatureScatterPlot from "./tempature";
import HeightTemperaturePlot from "./height-temperature";
import HeightTemperatureSimplePlot from "./fuel-x";
import FuelConsumptionSimple from "./fuel-simple";

function App() {
  return (
    <>
      <div style={{ marginBottom: "50px" }}>
        <h2>Temperature Scatter Plot</h2>
        <TemperatureScatterPlot />
      </div>
      <div style={{ marginBottom: "50px" }}>
        <h2>Height vs Temperature Plot (1000 points per curve)</h2>
        <HeightTemperaturePlot />
      </div>
      <div style={{ marginBottom: "50px" }}>
        <h2>Fuel Consumption Analysis - 3 Variants per Climate (12 curves)</h2>
        <HeightTemperatureSimplePlot />
      </div>
      <div style={{ marginBottom: "50px" }}>
        <h2>Fuel Consumption - 5 Line Styles with Same Pressure Scale</h2>
        <FuelConsumptionSimple />
      </div>
    </>
  );
}

export default App;
