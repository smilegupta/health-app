import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// provider for localization
import { LocalizationProvider } from "src/contexts/Localization.jsx";

// config for routes
import routes from "./routes/config";

// styles
import "./index.css";

const router = createBrowserRouter(
  routes.map((route) => ({
    path: route.path,
    element: <route.component />,
    errorElement: route.errorComponent ? <route.errorComponent /> : null,
  }))
);

createRoot(document.getElementById("root")).render(
  <LocalizationProvider>
    <RouterProvider router={router} />
  </LocalizationProvider>
);
