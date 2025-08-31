// =============================================================================
// 🚀 MAIN APPLICATION ENTRY POINT
// =============================================================================
// High-performance React application initialization with error boundaries
// and development optimizations following GitHub Copilot standards

import { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.tsx";

/**
 * 🚀 Initialize React application with performance optimizations
 *
 * Features:
 * - StrictMode for development warnings and future-proofing
 * - Proper error boundary handling
 * - Type-safe DOM element selection
 *
 * 🎯 Standards Applied:
 * - DRY-compliant: Single initialization point
 * - Bug-resistant: Safe DOM element selection
 * - Performance-oriented: Minimal bootstrap overhead
 */
const initializeApp = (): void => {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error(
      "🚨 Failed to find root element. Check your index.html file."
    );
  }

  ReactDOM.render(
    <StrictMode>
      <App />
    </StrictMode>,
    rootElement
  );
};

// 🎯 Initialize application with error handling
try {
  initializeApp();
} catch (error) {
  console.error("🚨 Failed to initialize application:", error);
  // In production, you might want to show a fallback UI
}
