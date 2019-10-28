import * as React from "react";
import { useMachine } from "@xstate/react";
import appMachine, { AppStates } from "./AppMachine";
import Splashscreen from "./Components/Splashscreen";
import Menu from "./Components/Menu";
import Game from "../Game/Game";

export const App = () => {
  const [current, send] = useMachine(appMachine);

  // console.table(current.value);
  const state =
    typeof current.value === "object"
      ? Object.keys(current.value)[0]
      : current.value;

  switch (state) {
    case AppStates.Splashscreen: {
      return <Splashscreen />;
    }
    case AppStates.Menu: {
      return <Menu send={send} />;
    }
    case AppStates.Playing: {
      return <Game sendToApp={send} />;
    }
    default: {
      return <p>State not known</p>;
    }
  }
};

export default App;
