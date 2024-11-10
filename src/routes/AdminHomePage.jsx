import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "src/components/Header";
import CaregiverList from "src/components/CaregiverList"; // Assuming this component exists for listing caregivers
import { PlusIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";

import { useUser } from "src/contexts/UserContext";
import { useLocalization } from "src/contexts/Localization";

import { signOut } from "src/services/authService";

const AdminHomePage = () => {
  const { translate } = useLocalization();
  const navigate = useNavigate();
  const [caregivers, setCaregivers] = useState([]);
  const { user, setUser } = useUser();

  // Redirect to login if not authenticated
  if (!user) {
    navigate("/login");
  }

  // Fetch caregivers list for the facility
  useEffect(() => {
    const fetchCaregivers = async () => {
      try {
        const response = await fetch(
          `https://ecictj5926.execute-api.ap-south-1.amazonaws.com/dev/caregiver?facility=${user.name}`
        );
        const data = await response.json();
        setCaregivers(data);
      } catch (error) {
        console.error("Error fetching caregivers:", error);
      }
    };

    fetchCaregivers();
  }, [user.sub]);

  const handleLogout = () => {
    try {
      signOut();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Handle navigation to add caregiver page
  const handleAddCaregiver = () => {
    navigate("/caregiver/new");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">
            {translate("welcome_admin")}
          </h2>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
            {translate("logout")}
          </button>
        </div>

        {/* Facility Name */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-300 rounded-lg">
          <h3 className="text-xl font-semibold text-blue-800">
            {translate("facility_name")}: {user.name || "N/A"}
          </h3>
        </div>

        {/* Add Caregiver Button */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold">{translate("caregivers_list")}</h3>
          <button
            onClick={handleAddCaregiver}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {translate("add_caregiver")}
          </button>
        </div>

        {/* Caregivers List Section */}
        {caregivers.length === 0 ? (
          <p className="text-gray-500">{translate("no_caregivers_found")}</p>
        ) : (
          <CaregiverList caregivers={caregivers} />
        )}
      </main>
    </div>
  );
};

export default AdminHomePage;
