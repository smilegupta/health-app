import PropTypes from "prop-types";

const InputField = ({
  label,
  type,
  value,
  onChange,
  error,
  isTextArea,
  readOnly,
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 font-medium mb-2">{label}</label>
    {isTextArea ? (
      <textarea
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="4"
      ></textarea>
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        readOnly={readOnly}
      />
    )}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  isTextArea: PropTypes.bool,
  readOnly: PropTypes.bool,
};

export default InputField;
