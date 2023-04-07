import { render } from "preact";
import { App } from "src/components/App";

import "src/global.css";

render(<App />, document.getElementById("root") as HTMLElement);
