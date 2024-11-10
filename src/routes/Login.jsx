import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

import { signIn } from "src/services/authService";
import { useUser } from "src/contexts/UserContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({ email: "", password: "" });
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    validateEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setError((prevError) => ({
      ...prevError,
      email: emailRegex.test(email)
        ? ""
        : "Please enter a valid email address.",
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError({
        email: !email ? "Email is required." : "",
        password: !password ? "Password is required." : "",
      });
      return;
    }
    try {
      const user = await signIn({
        username: email,
        password,
      });
      setUser(user.attributes);
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Check your username and password.");
    }
  };

  // Quick login with immediate sign-in
  const quickLogin = (email, password) => {
    setEmail(email);
    setPassword(password);
    setError({ email: "", password: "" }); // Clear any previous errors
    handleSubmit(); // Directly invoke handleSubmit to log in immediately
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Quick login buttons */}
        <div className="flex flex-col gap-3 mb-4">
          <button
            onClick={() => quickLogin("dallas@abc.com", "dallas@Caregiver1234")}
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
           Login as Admin 1 for Dallas Facility
          </button>
          <button
            onClick={() =>
              quickLogin("california@abc.com", "california@Caregiver1234")
            }
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
           Login as Admin 2 for California Facility
          </button>
          <button
            onClick={() => quickLogin("sheldon@gmail.com", "sheldon@Caregiver1234")}
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Login as Caregiver
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
            {error.email && (
              <p className="text-red-500 text-sm mt-1">{error.email}</p>
            )}
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[30px] bottom-0 right-3 flex items-center text-gray-600"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeIcon className="h-5 w-5" />
              ) : (
                <EyeSlashIcon className="h-5 w-5" />
              )}
            </button>
            {error.password && (
              <p className="text-red-500 text-sm mt-1">{error.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
