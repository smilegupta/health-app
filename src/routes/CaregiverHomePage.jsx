import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "src/components/Header";
import PatientList from "src/components/PatientList";
import { PlusIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";

import { useUser } from "src/contexts/UserContext";
import { useLocalization } from "src/contexts/Localization";

import {
  getPendingPatients,
  saveCachedPatients,
  getCachedPatients,
  clearCachedPatients,
} from "src/indexedDB";
import { signOut } from "src/services/authService";

const CaregiverHomePage = () => {
  const { translate } = useLocalization();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [unsyncedPatients, setUnsyncedPatients] = useState([]);
  const { user, setUser } = useUser();

  // Fetch patients from API with IndexedDB fallback
  useEffect(() => {
    if (!user) return;

    const fetchPatients = async () => {
      if (!navigator.onLine) {
        const cachedData = await getCachedPatients();
        if (cachedData.length > 0) {
          setPatients(cachedData);
        }
        return;
      }

      try {
        const response = await fetch(
          `https://ecictj5926.execute-api.ap-south-1.amazonaws.com/dev/patients?caregiverId=${user?.sub}`
        );
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setPatients(data);

        // Clear the old cached data and save the new data
        await clearCachedPatients();
        await saveCachedPatients(data);
      } catch (error) {
        console.error(
          "Error fetching patient data, loading from cache:",
          error
        );
        const cachedData = await getCachedPatients();
        if (cachedData.length > 0) {
          setPatients(cachedData);
        }
      }
    };

    fetchPatients();
  }, [user]);

  // Load unsynced patients from IndexedDB
  useEffect(() => {
    async function loadUnsyncedPatients() {
      const unsynced = await getPendingPatients();
      setUnsyncedPatients(unsynced);
    }
    loadUnsyncedPatients();
  }, []);

  const handleLogout = () => {
    try {
      signOut();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleAddPatient = () => navigate("/patient/new");

  if (!user) {
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">
            {translate("welcome", { name: user?.name })}
          </h2>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
            {translate("logout")}
          </button>
        </div>

        {/* Unsynced Patients Section */}
        {unsyncedPatients.length > 0 && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">
              {translate("unsynced_patients")}
            </h3>
            <p className="text-yellow-700 mb-4">
              {translate("unsynced_patients_description")}
            </p>
            <PatientList patients={unsyncedPatients} />
          </div>
        )}

        {/* Main Patient List Section */}
        {patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 mt-10 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {translate("no_patients")}
            </h3>
            <p className="text-gray-500 mb-4">
              {translate("no_patients_description")}
            </p>
            <button
              onClick={handleAddPatient}
              className="flex items-center bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              <PlusIcon className="h-6 w-6 mr-2" />
              {translate("add_patient")}
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">
                {translate("patient_list")}
              </h3>
              <button
                onClick={handleAddPatient}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                <PlusIcon className="h-5 w-5 mr-2" /> {translate("add_patient")}
              </button>
            </div>
            <PatientList patients={patients} />
          </>
        )}
      </main>
    </div>
  );
};

export default CaregiverHomePage;
