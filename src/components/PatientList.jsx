import PropTypes from "prop-types";
import { useLocalization } from "src/contexts/Localization";

import { PencilIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const PatientList = ({ patients }) => {
  const { translate } = useLocalization();
  return (
    <div className="grid gap-4">
      {patients.map((patient) => (
        <div
          key={patient.patientId}
          className="flex items-center bg-white p-4 rounded-lg shadow-md"
        >
          {/* Patient photo */}
          <img
            src={patient.avatar}
            alt={`${patient.name}'s avatar`}
            className="w-16 h-16 rounded-full mr-4"
          />
          {/* Patient details */}
          <div className="flex-grow">
            <h3 className="text-xl font-semibold">{patient.name}</h3>
          </div>
          {/* Action buttons */}
          <div className="flex space-x-2">
            <Link
              to={`/patient/${patient.patientId}`}
              className="flex items-center bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition"
            >
              <PencilIcon className="h-5 w-5 mr-1" /> {translate("view_edit")}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientList;

PatientList.propTypes = {
  patients: PropTypes.arrayOf(
    PropTypes.shape({
      patientId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  isUnsynced: PropTypes.bool,
};
