import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import TemperatureScatterPlot from "./tempature";
import HeightTemperaturePlot from "./height-temperature";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div style={{ marginBottom: "50px" }}>
        <h2>Temperature Scatter Plot</h2>
        <TemperatureScatterPlot />
      </div>
      <div style={{ marginBottom: "50px" }}>
        <h2>Height vs Temperature Plot</h2>
        <HeightTemperaturePlot />
      </div>
    </>
  );
}

export default App;
