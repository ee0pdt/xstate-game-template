import * as React from "react";
import { GameEventType, PlayingStates } from "../GameMachine";
import Button from "@material-ui/core/Button";

interface IPlayingProps {
  gameState: PlayingStates;
  send: (event: GameEventType) => void;
}

export const PlayingStateIndicator = ({
  gameState
}: {
  gameState: PlayingStates;
}) => {
  switch (gameState) {
    case PlayingStates.Idle: {
      return <p>idle</p>;
    }
    default: {
      return <p>active</p>;
    }
  }
};

export const Playing = ({ gameState, send }: IPlayingProps) => {
  return (
    <div>
      <PlayingStateIndicator gameState={gameState} />
      <Button
        variant="contained"
        onClick={() => send(GameEventType.ExitToMenu)}
      >
        Exit to Menu
      </Button>
    </div>
  );
};

export default Playing;
