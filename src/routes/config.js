import ErrorPage from "./ErrorPage";
import CaregiverHomePage from "./CaregiverHomePage";
import PatientDetails from "./PatientDetails";
import LoginPage from "./Login";

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
  {
    path: "/login",
    component: LoginPage,
    errorComponent: ErrorPage,
  },
];

export default routes;
