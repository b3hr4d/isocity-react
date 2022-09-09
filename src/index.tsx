import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CanvasProvider } from "./context/context";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <CanvasProvider>
      <App />
    </CanvasProvider>
  </StrictMode>
);
