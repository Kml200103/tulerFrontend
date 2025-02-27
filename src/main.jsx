import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import ErrorBoundary from "./shared/Error/ErrorBoundary";

const Notification = lazy(() => import("./components/Notifications"));

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={null}>
        <Notification />
      </Suspense>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);