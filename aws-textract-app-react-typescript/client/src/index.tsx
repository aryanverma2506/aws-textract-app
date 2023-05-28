import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import AllContext from "./context/AllContext";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLDivElement
);
root.render(
  <AllContext>
    <App />
  </AllContext>
);
