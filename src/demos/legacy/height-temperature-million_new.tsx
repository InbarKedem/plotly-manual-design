import React, { useMemo } from "react";
import UnifiedPlotter from "../../UnifiedPlotter";
import type { SeriesConfig } from "../../types/PlotterTypes";
import { DARK_THEME } from "../../config/themes";
import { timeSeriesPreset } from "../../presets/scientific";

const HeightTemperatureMillionChart: React.FC = () => {
  // Generate large dataset for performance testing
  const largeData = useMemo(() => {
    const data = [];
    const numPoints = 50000; // Reduced from 1M for practical performance
    console.log(`Generating ${numPoints} data points...`);

    for (let i = 0; i < numPoints; i++) {
      const height = (i / numPoints) * 15000; // Height from 0 to 15000m

      // More complex temperature model
      const baseTemp = 15 - (height / 1000) * 6.5; // Standard lapse rate
      const troposphereEffect = height < 11000 ? 0 : (height - 11000) / 1000; // Stratosphere warming
      const seasonalVariation = Math.sin((i / numPoints) * 4 * Math.PI) * 5;
      const microVariation = (Math.random() - 0.5) * 3;

      const temperature =
        baseTemp + troposphereEffect + seasonalVariation + microVariation;

      data.push({
        x: height,
        y: temperature,
        metadata: {
          height: height.toFixed(0),
          temperature: temperature.toFixed(1),
          index: i,
        },
      });
    }

    console.log(`Generated ${data.length} data points`);
    return data;
  }, []);

  const series: SeriesConfig[] = useMemo(
    () => [
      {
        name: "Large Dataset Temperature Profile",
        data: largeData,
        type: "scatter",
        mode: "markers",
        marker: {
          size: 2,
          color: "#8b5cf6",
          opacity: 0.6,
        },
        hovertemplate:
          "<b>Height:</b> %{x:.0f}m<br>" +
          "<b>Temperature:</b> %{y:.1f}°C<br>" +
          "<b>Point:</b> %{customdata[2]}<br>" +
          "<extra></extra>",
        customdata: largeData.map((d) => [
          d.metadata.height,
          d.metadata.temperature,
          d.metadata.index,
        ]),
      },
    ],
    [largeData]
  );

  return (
    <div style={{ width: "100%", height: "600px", padding: "20px" }}>
      <h3>🔥 Large Dataset Performance Test (Migrated to UnifiedPlotter)</h3>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        Testing with {largeData.length.toLocaleString()} data points -
        Progressive loading enabled
      </p>
      <UnifiedPlotter
        series={series}
        config={{
          ...timeSeriesPreset.config,
          title: `Temperature vs Altitude - ${largeData.length.toLocaleString()} Points`,
          xAxis: {
            title: "Height (meters)",
            showgrid: true,
          },
          yAxis: {
            title: "Temperature (°C)",
            showgrid: true,
          },
        }}
        interactions={{
          ...timeSeriesPreset.interactions,
          enableZoom: true,
          enablePan: true,
        }}
        theme={DARK_THEME}
        debug={true}
        progressiveLoading={{
          enabled: true,
          chunkSize: 1000,
          showProgress: true,
        }}
      />
    </div>
  );
};

export default HeightTemperatureMillionChart;
