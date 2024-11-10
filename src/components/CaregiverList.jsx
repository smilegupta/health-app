import PropTypes from "prop-types";

const CaregiverList = ({ caregivers }) => {
  return (
    <div className="grid gap-4">
      {caregivers.map((caregiver) => (
        <div
          key={caregiver.caregiverId}
          className="flex items-center bg-white p-4 rounded-lg shadow-md"
        >
          {/* Caregiver photo */}
          <img
            src={caregiver.avatar}
            alt={`${caregiver.name}'s avatar`}
            className="w-16 h-16 rounded-full mr-4"
          />
          {/* Caregiver details */}
          <div className="flex-grow">
            <h3 className="text-xl font-semibold">{caregiver.name}</h3>
            <p className="text-gray-600">{caregiver.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

CaregiverList.propTypes = {
  caregivers: PropTypes.arrayOf(
    PropTypes.shape({
      caregiverId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CaregiverList;
