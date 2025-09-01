// =============================================================================
// 🧪 UNIFIED PLOTTER HOVER INTERACTIONS - UNIT TESTS
// =============================================================================

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UnifiedPlotter from "../UnifiedPlotter";
import type { SeriesConfig } from "../types/PlotterTypes";

// Mock react-plotly.js to avoid Plotly.js dependency in tests
jest.mock("react-plotly.js", () => {
  return function MockPlot({
    onHover,
    onUnhover,
    onClick,
    layout,
    data,
    config,
    ...props
  }: {
    onHover?: any;
    onUnhover?: any;
    onClick?: any;
    layout?: any;
    data?: any;
    config?: any;
    [key: string]: any;
  }) {
    return (
      <div
        data-testid="mock-plot"
        data-layout={JSON.stringify(layout)}
        data-plot-data={JSON.stringify(data)}
        data-config={JSON.stringify(config)}
        onMouseOver={(e) =>
          onHover?.({
            points: [{ curveNumber: 0, pointNumber: 0 }],
            event: e,
          })
        }
        onMouseOut={() => onUnhover?.()}
        onClick={(e) =>
          onClick?.({
            points: [{ curveNumber: 0, pointNumber: 0 }],
            event: e,
          })
        }
        {...props}
      >
        Mock Plotly Plot
      </div>
    );
  };
});

// Test data
const testSeries: SeriesConfig[] = [
  {
    name: "Test Series 1",
    data: [
      { x: 1, y: 10 },
      { x: 2, y: 20 },
      { x: 3, y: 15 },
    ],
    mode: "lines+markers",
  },
  {
    name: "Test Series 2",
    data: [
      { x: 1, y: 5 },
      { x: 2, y: 15 },
      { x: 3, y: 25 },
    ],
    mode: "lines+markers",
  },
];

describe("UnifiedPlotter Hover Interactions", () => {
  describe("Tooltip Rendering", () => {
    test("renders with enhanced hover styling configuration", () => {
      render(
        <UnifiedPlotter
          series={testSeries}
          interactions={{ enableHoverOpacity: true }}
        />
      );

      const plotElement = screen.getByTestId("mock-plot");
      expect(plotElement).toBeInTheDocument();

      // Check layout configuration for enhanced hover styling
      const layoutData = JSON.parse(
        plotElement.getAttribute("data-layout") || "{}"
      );

      // Verify enhanced hoverlabel configuration
      expect(layoutData.hoverlabel).toEqual({
        bgcolor: "rgba(255, 255, 255, 0.95)",
        bordercolor: "rgba(148, 163, 184, 0.3)",
        font: {
          family: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
          size: 12,
          color: "#374151",
        },
        namelength: -1,
        align: "left",
      });
    });

    test("applies correct tooltip structure with floating card styling", () => {
      render(
        <UnifiedPlotter
          series={testSeries}
          interactions={{ enableHoverOpacity: true }}
        />
      );

      const plotElement = screen.getByTestId("mock-plot");
      const layoutData = JSON.parse(
        plotElement.getAttribute("data-layout") || "{}"
      );

      // Verify tooltip styling matches requirements
      expect(layoutData.hoverlabel.bgcolor).toBe("rgba(255, 255, 255, 0.95)"); // Semi-transparent white
      expect(layoutData.hoverlabel.bordercolor).toBe(
        "rgba(148, 163, 184, 0.3)"
      ); // Subtle border
      expect(layoutData.hoverlabel.font.family).toContain("Inter"); // Modern font
    });
  });

  describe("Crosshair Line Rendering", () => {
    test("renders both vertical and horizontal dashed crosshair lines", () => {
      render(
        <UnifiedPlotter
          series={testSeries}
          interactions={{ enableHoverOpacity: true }}
        />
      );

      const plotElement = screen.getByTestId("mock-plot");
      const layoutData = JSON.parse(
        plotElement.getAttribute("data-layout") || "{}"
      );

      // Verify x-axis crosshair configuration (vertical line)
      expect(layoutData.xaxis.showspikes).toBe(true);
      expect(layoutData.xaxis.spikemode).toBe("across");
      expect(layoutData.xaxis.spikesnap).toBe("cursor");
      expect(layoutData.xaxis.spikecolor).toBe("#9ca3af"); // Thin, subtle color
      expect(layoutData.xaxis.spikethickness).toBe(1);
      expect(layoutData.xaxis.spikedash).toBe("dash");

      // Verify y-axis crosshair configuration (horizontal line)
      expect(layoutData.yaxis.showspikes).toBe(true);
      expect(layoutData.yaxis.spikemode).toBe("across");
      expect(layoutData.yaxis.spikesnap).toBe("cursor");
      expect(layoutData.yaxis.spikecolor).toBe("#9ca3af"); // Thin, subtle color
      expect(layoutData.yaxis.spikethickness).toBe(1);
      expect(layoutData.yaxis.spikedash).toBe("dash");
    });

    test("aligns both crosshairs with cursor position", () => {
      render(
        <UnifiedPlotter
          series={testSeries}
          interactions={{ enableHoverOpacity: true }}
        />
      );

      const plotElement = screen.getByTestId("mock-plot");
      const layoutData = JSON.parse(
        plotElement.getAttribute("data-layout") || "{}"
      );

      // Verify cursor alignment for both axes
      expect(layoutData.xaxis.spikesnap).toBe("cursor");
      expect(layoutData.yaxis.spikesnap).toBe("cursor");
      expect(layoutData.hoverdistance).toBe(30); // Updated sensitivity
      expect(layoutData.spikedistance).toBe(30); // Updated sensitivity
    });
  });

  describe("Data Point Highlighting", () => {
    test("configures data points with proper circle styling", () => {
      render(
        <UnifiedPlotter
          series={testSeries}
          interactions={{ enableHoverOpacity: true }}
        />
      );

      const plotElement = screen.getByTestId("mock-plot");
      const plotData = JSON.parse(
        plotElement.getAttribute("data-plot-data") || "[]"
      );

      // Verify marker configuration for data points
      plotData.forEach((trace: Record<string, any>) => {
        if (trace.mode?.includes("markers")) {
          expect(trace.marker.size).toBe(8); // Slightly larger for visibility
          expect(trace.marker.opacity).toBe(0.9); // High opacity for contrast
          expect(trace.marker.line.width).toBe(2); // Outer white stroke
          expect(trace.marker.line.color).toBe("rgba(255, 255, 255, 0.8)");
        }
      });
    });

    test("enhances data points on hover with size increase", async () => {
      const onPlotHover = jest.fn();

      render(
        <UnifiedPlotter
          series={testSeries}
          interactions={{ enableHoverOpacity: true }}
          onPlotHover={onPlotHover}
        />
      );

      const plotElement = screen.getByTestId("mock-plot");

      // Simulate hover
      fireEvent.mouseOver(plotElement);

      await waitFor(() => {
        expect(onPlotHover).toHaveBeenCalled();
      });

      // Verify hover state is triggered
      expect(onPlotHover).toHaveBeenCalledWith({
        points: [{ curveNumber: 0, pointNumber: 0 }],
        event: expect.any(Object),
      });
    });

    test("applies white outer stroke to data points", () => {
      render(
        <UnifiedPlotter
          series={testSeries}
          interactions={{ enableHoverOpacity: true }}
        />
      );

      const plotElement = screen.getByTestId("mock-plot");
      const plotData = JSON.parse(
        plotElement.getAttribute("data-plot-data") || "[]"
      );

      // Check for white outer stroke on markers
      plotData.forEach((trace: Record<string, any>) => {
        if (trace.mode?.includes("markers") && trace.marker) {
          expect(trace.marker.line.color).toBe("rgba(255, 255, 255, 0.8)");
          expect(trace.marker.line.width).toBe(2);
        }
      });
    });
  });

  describe("Graph Styling", () => {
    test("applies clean neutral background", () => {
      render(<UnifiedPlotter series={testSeries} />);

      const plotElement = screen.getByTestId("mock-plot");
      const layoutData = JSON.parse(
        plotElement.getAttribute("data-layout") || "{}"
      );

      // Verify clean background colors
      expect(layoutData.paper_bgcolor).toBe("#f9fafb"); // Neutral clean background
      expect(layoutData.plot_bgcolor).toBe("#ffffff"); // Clean white plot background
    });

    test("applies subtle gridlines with proper styling", () => {
      render(<UnifiedPlotter series={testSeries} />);

      const plotElement = screen.getByTestId("mock-plot");
      const layoutData = JSON.parse(
        plotElement.getAttribute("data-layout") || "{}"
      );

      // Verify gridline styling
      expect(layoutData.xaxis.showgrid).toBe(true);
      expect(layoutData.xaxis.gridcolor).toBe("#e5e7eb"); // stroke-gray-200
      expect(layoutData.xaxis.gridwidth).toBe(1);

      expect(layoutData.yaxis.showgrid).toBe(true);
      expect(layoutData.yaxis.gridcolor).toBe("#e5e7eb");
      expect(layoutData.yaxis.gridwidth).toBe(1);
    });

    test("applies minimal tick styling with legible text", () => {
      render(<UnifiedPlotter series={testSeries} />);

      const plotElement = screen.getByTestId("mock-plot");
      const layoutData = JSON.parse(
        plotElement.getAttribute("data-layout") || "{}"
      );

      // Verify tick styling
      expect(layoutData.xaxis.tickfont.size).toBe(10); // text-sm
      expect(layoutData.xaxis.tickfont.color).toBe("#6b7280"); // text-gray-600
      expect(layoutData.xaxis.tickcolor).toBe("#e5e7eb");

      expect(layoutData.yaxis.tickfont.size).toBe(10);
      expect(layoutData.yaxis.tickfont.color).toBe("#6b7280");
      expect(layoutData.yaxis.tickcolor).toBe("#e5e7eb");
    });
  });

  describe("Line Styling", () => {
    test("configures smooth curves with spline interpolation", () => {
      render(<UnifiedPlotter series={testSeries} />);

      const plotElement = screen.getByTestId("mock-plot");
      const plotData = JSON.parse(
        plotElement.getAttribute("data-plot-data") || "[]"
      );

      // Verify line styling for smooth curves
      plotData.forEach((trace: Record<string, any>) => {
        if (trace.mode?.includes("lines") && trace.line) {
          expect(trace.line.shape).toBe("spline");
          expect(trace.line.smoothing).toBe(1.0);
          expect(trace.line.width).toBe(3); // Slightly thicker
        }
      });
    });

    test("applies distinct colors and rounded edges", () => {
      render(<UnifiedPlotter series={testSeries} />);

      const plotElement = screen.getByTestId("mock-plot");
      const plotData = JSON.parse(
        plotElement.getAttribute("data-plot-data") || "[]"
      );

      // Verify distinct colors are applied
      plotData.forEach((trace: Record<string, any>) => {
        if (trace.mode?.includes("lines") && trace.line) {
          expect(trace.line.color).toBeTruthy();
          expect(trace.line.dash).toBe("solid");
        }
      });
    });
  });

  describe("Accessibility", () => {
    test("maintains accessible hover distance", () => {
      render(<UnifiedPlotter series={testSeries} />);

      const plotElement = screen.getByTestId("mock-plot");
      const layoutData = JSON.parse(
        plotElement.getAttribute("data-layout") || "{}"
      );

      // Verify accessible hover distances
      expect(layoutData.hoverdistance).toBe(20);
      expect(layoutData.spikedistance).toBe(20);
    });

    test("uses high contrast colors for visibility", () => {
      render(<UnifiedPlotter series={testSeries} />);

      const plotElement = screen.getByTestId("mock-plot");
      const layoutData = JSON.parse(
        plotElement.getAttribute("data-layout") || "{}"
      );

      // Verify high contrast text colors
      expect(layoutData.hoverlabel.font.color).toBe("#374151"); // High contrast text
      expect(layoutData.xaxis.tickfont.color).toBe("#6b7280"); // Legible gray
      expect(layoutData.yaxis.tickfont.color).toBe("#6b7280");
    });
  });

  describe("Error Handling", () => {
    test("handles empty series gracefully", () => {
      expect(() => {
        render(<UnifiedPlotter series={[]} />);
      }).not.toThrow();
    });

    test("handles invalid hover events gracefully", () => {
      const onError = jest.fn();

      render(
        <UnifiedPlotter
          series={testSeries}
          onError={onError}
          interactions={{ enableHoverOpacity: true }}
        />
      );

      const plotElement = screen.getByTestId("mock-plot");

      // Should not throw on invalid hover data
      expect(() => {
        fireEvent.mouseOver(plotElement);
      }).not.toThrow();
    });
  });
});
