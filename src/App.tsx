import "./App.css";
import HeightTemperatureMillion from "./height-temperature-million";
import HeightTemperature from "./height-temperature";
import HeightTemperatureSimple from "./height-temperature-simple";
import FuelSimple from "./fuel-simple";
import FuelConsumption1000 from "./fuel-1000";
import FuelX from "./fuel-x";
import Temperature from "./tempature";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Test App - All Components</h1>

      <h2>Height Temperature Million (100K points per curve)</h2>
      <div
        style={{
          border: "2px solid red",
          minHeight: "400px",
          marginBottom: "20px",
        }}
      >
        <HeightTemperatureMillion />
      </div>

      <h2>Height Temperature (Standard)</h2>
      <div
        style={{
          border: "2px solid blue",
          minHeight: "400px",
          marginBottom: "20px",
        }}
      >
        <HeightTemperature />
      </div>

      <h2>Height Temperature Simple (10 points)</h2>
      <div
        style={{
          border: "2px solid green",
          minHeight: "400px",
          marginBottom: "20px",
        }}
      >
        <HeightTemperatureSimple />
      </div>

      <h2>Fuel Consumption Simple (10 points)</h2>
      <div
        style={{
          border: "2px solid orange",
          minHeight: "400px",
          marginBottom: "20px",
        }}
      >
        <FuelSimple />
      </div>

      <h2>Fuel Consumption 1000 (1000 points per curve)</h2>
      <div
        style={{
          border: "2px solid purple",
          minHeight: "400px",
          marginBottom: "20px",
        }}
      >
        <FuelConsumption1000 />
      </div>

      <h2>Fuel X</h2>
      <div
        style={{
          border: "2px solid teal",
          minHeight: "400px",
          marginBottom: "20px",
        }}
      >
        <FuelX />
      </div>

      <h2>Temperature Component</h2>
      <div
        style={{
          border: "2px solid brown",
          minHeight: "400px",
          marginBottom: "20px",
        }}
      >
        <Temperature />
      </div>
    </div>
  );
}

export default App;
