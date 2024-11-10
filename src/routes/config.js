import ErrorPage from "./ErrorPage";
import App from "../App";
import PatientDetails from "./PatientDetails";
import LoginPage from "./Login";
import AddCaregiverForm from "src/components/AddCaregiverForm";

const routes = [
  {
    path: "/",
    component: App,
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
  {
    path: "/caregiver/new",
    component: AddCaregiverForm,
    errorComponent: ErrorPage,
  },
];

export default routes;
