import { h, render } from "preact";

import cnsl from "./util/cnsl";

import { Store } from "./Store";
import Chat from "./Chat";

const PreactApp = () => (
  <Store>
    <Chat />
  </Store>
);

class App {
  private node: HTMLElement;

  constructor(node: HTMLElement) {
    cnsl.log("New Chat instance invoked", node);

    this.node = node;
    render(<PreactApp />, this.node);

    cnsl.log("And it's rendered");
  }

  public unmount = () => {
    cnsl.log("Chat instance unmount invoked", this.node);

    render(null, this.node);

    cnsl.log("Unmounted");
  };
}

export default App;
