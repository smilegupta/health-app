import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ErrorPage = ({
  message = "The page you're looking for doesn't exist.",
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700 p-4">
      <h1 className="text-6xl font-bold text-blue-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">
        Oops! Something went wrong.
      </h2>
      <p className="text-lg mb-6 text-center">{message}</p>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Go Home
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

ErrorPage.propTypes = {
  message: PropTypes.string,
};

export default ErrorPage;
