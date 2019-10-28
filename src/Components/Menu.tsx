import * as React from "react";
import ErrorBoundary from "./ErrorBoundary";
import { Button } from "@material-ui/core";
import { GameEventType } from "../GameMachine";

interface IMenuProps {
  send: (event: GameEventType) => void;
}

export const Menu = ({ send }: IMenuProps) => (
  <ErrorBoundary>
    <Button
      variant="contained"
      onClick={() => send(GameEventType.StartNewGame)}
    >
      Start
    </Button>
  </ErrorBoundary>
);

export default Menu;
