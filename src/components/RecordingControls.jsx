import PropTypes from "prop-types";

const RecordingControls = ({
  isRecording,
  audioURL,
  onStart,
  onStop,
  recordings,
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 font-medium mb-2">
      Recorded Observations
    </label>
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={isRecording ? onStop : onStart}
        className={`px-4 py-2 rounded-md text-white ${
          isRecording
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        } transition duration-200`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioURL && (
        <audio controls src={audioURL} className="ml-4 mt-2 w-full max-w-xs" />
      )}
    </div>
    {recordings.length > 0 && (
      <div className="mt-4">
        <h4 className="text-gray-700 font-medium mb-2">Previous Recordings:</h4>
        <ul className="space-y-2">
          {recordings.map((recording, index) => (
            <li
              key={index}
              className="flex items-center space-x-3 bg-gray-50 p-2 rounded-md shadow-sm"
            >
              <span className="text-sm text-gray-500">
                {new Date(recording.time).toLocaleString()} -{" "}
                <a
                  href={recording.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Recording
                </a>
              </span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

RecordingControls.propTypes = {
  isRecording: PropTypes.bool.isRequired,
  audioURL: PropTypes.string,
  onStart: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  recordings: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      isBase64: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default RecordingControls;
