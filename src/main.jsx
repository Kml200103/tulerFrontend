import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";
import ErrorBoundary from "./shared/Error/ErrorBoundary";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
