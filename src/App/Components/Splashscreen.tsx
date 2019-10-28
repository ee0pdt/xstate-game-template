import * as React from "react";
import ErrorBoundary from "../../Shared/ErrorBoundary";

export const SplashScreen = () => (
  <ErrorBoundary>
    <img src="https://picsum.photos/200" alt="Splashscreen" />
  </ErrorBoundary>
);

export default SplashScreen;
