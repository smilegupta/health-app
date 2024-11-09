import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const PatientList = ({ patients }) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-xl font-semibold mb-4">Patients Assigned</h3>
      <ul>
        {patients.map((patient) => (
          <li
            key={patient.id}
            className="py-3 border-b last:border-none flex justify-between items-center"
          >
            <span>{patient.name}</span>
            <Link to={`/patient/${patient.id}`}>
              <button
                className="text-blue-500 hover:underline"
                aria-label={`View profile of ${patient.name}`}
              >
                View Profile
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PatientList;

PatientList.propTypes = {
  patients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};
