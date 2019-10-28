import * as React from "react";
import { GameEventType, PlayingStates } from "../GameMachine";

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
    </div>
  );
};

export default Playing;
