import * as React from 'react';
import { render } from 'react-dom';
import Game from './Game';

import './styles.css';
import ErrorBoundary from './Components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Game />
    </ErrorBoundary>
  );
}

const rootElement = document.getElementById('root');
render(<App />, rootElement);
