import * as React from "react";
import { render } from "react-dom";
import App from "./App/App";

import "./styles.css";
import ErrorBoundary from "./Shared/ErrorBoundary";

const rootElement = document.getElementById("root");
render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  rootElement
);
