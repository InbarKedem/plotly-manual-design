import "./App.css";
import TemperatureScatterPlot from "./tempature";
import HeightTemperaturePlot from "./height-temperature";
import HeightTemperatureSimplePlot from "./fuel-x";

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
        <h2>Fuel Consumption vs Height - Simplified (10 points per curve)</h2>
        <HeightTemperatureSimplePlot />
      </div>
    </>
  );
}

export default App;
