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

// Service Worker registration and event listeners 
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data && event.data.type === "UPDATE_LOCAL_STORAGE") {
      const patientData = event.data.patientData;

      // Retrieve the existing patient list from LocalStorage
      const storedPatients =
        JSON.parse(localStorage.getItem("patient-list")) || [];

      // Update the list with the new patient data
      //check if the patient is already in the list and update it
      const updatedPatients = storedPatients.map((patient) =>
        patient.id === patientData.id ? patientData : patient
      );

      // Save the updated list back to LocalStorage
      localStorage.setItem("patient-list", JSON.stringify(updatedPatients));

      alert(
        "Patient data synced have been synced, please refresh the page to see the changes"
      );
    }
  });

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
