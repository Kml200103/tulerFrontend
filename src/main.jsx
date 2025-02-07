import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";
import ErrorBoundary from "./shared/Error/ErrorBoundary";
import Notification from "./components/Notifications";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <ErrorBoundary>
    <Notification></Notification>
    <App />
  </ErrorBoundary>
);
