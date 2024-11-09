import ErrorPage from "./ErrorPage";
import CaregiverHomePage from "./CaregiverHomePage";
import PatientDetails from "./PatientDetails";

const routes = [
  {
    path: "/",
    component: CaregiverHomePage,
    errorComponent: ErrorPage,
  },
  {
    path: "/patient/:id",
    component: PatientDetails,
    errorComponent: ErrorPage,
  },
];

export default routes;
