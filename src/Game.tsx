import * as React from 'react';
import { useMachine } from '@xstate/react';
import gameMachine, {
  GameContext,
  GameStates,
  PlayingStates,
} from './GameMachine';
import Splashscreen from './Components/Splashscreen';
import Menu from './Components/Menu';

export const Game = () => {
  const [current, send] = useMachine(gameMachine);
  const context = current.context as GameContext;

  switch (current.value) {
    case GameStates.Splashscreen: {
      return <Splashscreen />;
    }
    case GameStates.Menu: {
      return <Menu send={send} />;
    }
    case GameStates.Playing: {
      return <p>Now in playing state</p>;
    }
    case PlayingStates.Idle: {
      return <p>Now in idle state</p>;
    }
    default: {
      return <p>State not known</p>;
    }
  }
};

export default Game;
