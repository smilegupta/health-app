import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";

// provider for localization
import { LocalizationProvider } from "src/contexts/Localization.jsx";
import { UserProvider } from "src/contexts/UserContext.jsx";

// styles
import "./index.css";

// config for routes
import routes from "./routes/config";

const router = createBrowserRouter(
  routes.map((route) => ({
    path: route.path,
    element: <route.component />,
    errorElement: route.errorComponent ? <route.errorComponent /> : null,
  }))
);

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <LocalizationProvider>
      <RouterProvider router={router} />
    </LocalizationProvider>
  </UserProvider>
);

// config for Amplify - which is used for authentication
Amplify.configure(awsconfig);

// Service Worker registration and event listeners
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration,
          registration.scope
        );

        if (registration.active) {
          registration.active.postMessage({
            type: "SET_GITHUB_TOKEN",
            token: import.meta.env.VITE_GITHUB_TOKEN,
          });
        }

        const registerSync = async () => {
          if ("sync" in registration) {
            try {
              await registration.sync.register("sync-pending-patients");
              console.log("Background sync registered");
            } catch (error) {
              console.error("Background sync registration failed:", error);
            }
          }
        };

        if (navigator.onLine) {
          registerSync();
        }

        window.addEventListener("online", () => {
          registerSync();
        });
      })
      .catch((error) =>
        console.error("Service Worker registration failed:", error)
      );
  });
}
