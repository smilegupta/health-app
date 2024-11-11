import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalization } from "src/contexts/Localization";

import InputField from "./InputField";
import Header from "./Header";
import { useUser } from "src/contexts/UserContext";

const AddCaregiverForm = () => {
  const navigate = useNavigate();
  const [caregiver, setCaregiver] = useState({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const { user } = useUser();
  const { translate } = useLocalization();

  // Validate fields
  const validateField = (field, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorMessages = {
      name: translate("name_required"),
      email: translate("valid_email"),
    };

    setErrors((prev) => ({
      ...prev,
      [field]:
        field === "email" && !emailRegex.test(value)
          ? errorMessages.email
          : field === "name" && !value
          ? errorMessages.name
          : "",
    }));
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setCaregiver((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.name || errors.email) return;

    const payload = {
      ...caregiver,
      avatar: `https://robohash.org/${Math.round(
        Math.random() * 1000
      ).toString()}.png?size=200x200`,
      facility: user.name,
    };

    try {
      const response = await fetch(
        `https://ecictj5926.execute-api.ap-south-1.amazonaws.com/dev/caregiver`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error("Failed to add caregiver");
      navigate("/");
    } catch (error) {
      console.error("Error adding caregiver:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
        <div className="bg-white p-6 mt-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">
            {translate("add_caregiver")}
          </h2>
          <form onSubmit={handleSubmit}>
            <InputField
              label={translate("caregiver_name")}
              type="text"
              value={caregiver.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
            />
            <InputField
              label={translate("caregiver_email")}
              type="email"
              value={caregiver.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 mt-4"
            >
              {translate("submit")}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddCaregiverForm;
