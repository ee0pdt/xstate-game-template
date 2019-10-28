import * as React from "react";
import ErrorBoundary from "../../Shared/ErrorBoundary";
import { Button } from "@material-ui/core";
import { AppEventType } from "../AppMachine";

interface IMenuProps {
  send: (event: AppEventType) => void;
}

export const Menu = ({ send }: IMenuProps) => (
  <ErrorBoundary>
    <Button variant="contained" onClick={() => send(AppEventType.StartNewGame)}>
      Start
    </Button>
  </ErrorBoundary>
);

export default Menu;
