import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { LocalizationProvider } from "src/contexts/Localization.jsx";

createRoot(document.getElementById("root")).render(
  <LocalizationProvider>
    <App />
  </LocalizationProvider>
);
