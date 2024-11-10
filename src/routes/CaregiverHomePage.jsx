import Header from "src/components/Header";
import PatientList from "src/components/PatientList";
import { useLocalization } from "src/contexts/Localization";
import { useNavigate } from "react-router-dom";
import { PlusIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";

const CaregiverHomePage = () => {
  const { translate } = useLocalization();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);

  // Load patients from local storage or use fallback
  useEffect(() => {
    const storedPatients = localStorage.getItem("patient-list");
    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    } else {
      setPatients([
        {
          id: "1",
          name: "John Doe",
          age: 45,
          photo: "https://robohash.org/1.png?size=200x200",
        },
        {
          id: "2",
          name: "Jane Smith",
          age: 34,
          photo: "https://robohash.org/2.png?size=200x200",
        },
      ]);
    }
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleAddPatient = () => {
    navigate("/patient/new");
  };

  const handleDeletePatient = (patientId) => {
    const updatedPatients = patients.filter(
      (patient) => patient.id !== patientId
    );
    setPatients(updatedPatients);
    localStorage.setItem("patient-list", JSON.stringify(updatedPatients));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            {/** Todo: Update name once api is integrated */}
            <h2 className="text-3xl font-bold">
              {translate("welcome", { name: "Caregiver" })}
            </h2>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />{" "}
            {translate("logout")}
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold">Patient List</h3>
          <button
            onClick={handleAddPatient}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            <PlusIcon className="h-5 w-5 mr-2" /> {translate("add_patient")}
          </button>
        </div>
        <PatientList patients={patients} onDelete={handleDeletePatient} />
      </main>
    </div>
  );
};

export default CaregiverHomePage;
