import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  clearError,
  clearRegistrationSuccess,
} from "../redux/slices/authSlice";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  // FaEye,
  // FaEyeSlash,
} from "react-icons/fa";
import Alert from "../components/ui/Alert";
import Spinner from "../components/ui/Spinner";
import store from "../redux/store";

function SignUpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user, registrationSuccess } =
    useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");

  // Clear errors when component mounts or unmounts
  useEffect(() => {
    dispatch(clearError());
    dispatch(clearRegistrationSuccess());
    return () => {
      dispatch(clearError());
      dispatch(clearRegistrationSuccess());
    };
  }, [dispatch]);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath =
        user.role === "merchant" ? "/merchant-dashboard" : "/listings";
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate]);

  // Redirect to login if registration is successful
  useEffect(() => {
    if (registrationSuccess) {
      console.log(
        "Registration successful, preparing to show verification message"
      );

      // Save the user data to localStorage for later use
      const userData = {
        email: formData.email,
        role: formData.role,
      };

      // If registration response includes user_id, store it
      const authState = store.getState().auth;
      if (authState.registrationData && authState.registrationData.user_id) {
        userData.id = authState.registrationData.user_id;
        console.log(`Adding user ID ${userData.id} from registration response`);
      }

      console.log("Saving user data to localStorage:", userData);
      localStorage.setItem("newUserData", JSON.stringify(userData));

      // Show verification message instead of auto-redirecting
      setVerificationMessage(
        authState.registrationData?.email_verification ||
          "Please check your email to verify your account before logging in."
      );

      // After a delay, redirect to login page
      setTimeout(() => {
        console.log("Redirecting to login page");
        navigate("/login");
      }, 8000); // 8 second delay to allow user to read the longer message
    }
  }, [registrationSuccess, navigate, formData.email, formData.role]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  // Access field errors for individual field validation feedback
  const { fieldErrors } = useSelector((state) => state.auth);

  // Helper to get field-specific error messages
  const getFieldError = (fieldName) => {
    if (!fieldErrors || !fieldErrors[fieldName]) return null;

    const errors = fieldErrors[fieldName];
    if (Array.isArray(errors)) {
      return errors.join(", ");
    }
    return errors;
  };

  const emailError = getFieldError("email");
  const passwordError = getFieldError("password");
  const fullNameError = getFieldError("full_name");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      // Create API-ready data with confirm_password instead of confirmPassword
      const apiData = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        role: formData.role,
      };

      await dispatch(registerUser(apiData));
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const handleCloseError = () => {
    setErrorMessage("");
    dispatch(clearError());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-4 pt-20">
      <div className="w-full max-w-md my-auto">
        <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-white">
          <div className="px-6 pt-8 pb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white font-poppins">
              Join UniBazzar
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300 font-inter">
              Create your account
            </p>
          </div>

          {errorMessage && (
            <div className="px-6 pb-4">
              <Alert
                type="error"
                message={errorMessage}
                onClose={handleCloseError}
              />
            </div>
          )}

          {verificationMessage && (
            <div className="px-6 pb-4">
              <Alert
                type="success"
                message={verificationMessage}
                autoClose={false}
              />
            </div>
          )}

          {registrationSuccess && !verificationMessage && (
            <div className="px-6 pb-4">
              <Alert
                type="success"
                message={registrationSuccess}
                autoClose={true}
              />
            </div>
          )}

          <form
            className="px-6 pt-2 pb-8 space-y-5 font-inter"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="full_name"
                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaUser className="text-gray-500" />
                </div>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  autoComplete="name"
                  required
                  className={`w-full px-4 py-2 pl-10 rounded-md bg-white dark:bg-gray-800 border ${
                    fullNameError
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder-gray-400 text-gray-800 dark:text-white`}
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>
              {fullNameError && (
                <p className="mt-1 text-sm text-red-600">{fullNameError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaEnvelope className="text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`w-full px-4 py-2 pl-10 rounded-md bg-white dark:bg-gray-800 border ${
                    emailError
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder-gray-400 text-gray-800 dark:text-white`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`w-full px-4 py-2 pl-10 rounded-md bg-white dark:bg-gray-800 border ${
                    passwordError
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder-gray-400 text-gray-800 dark:text-white`}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full px-4 py-3 pl-10 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder-gray-400 text-gray-800 dark:text-white"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`flex items-center justify-center p-3 border rounded-md cursor-pointer transition-colors ${
                    formData.role === "student"
                      ? "bg-blue-50 border-blue-400 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-white border-gray-300 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    className="sr-only"
                    checked={formData.role === "student"}
                    onChange={handleChange}
                  />
                  <span>Student</span>
                </label>
                <label
                  className={`flex items-center justify-center p-3 border rounded-md cursor-pointer transition-colors ${
                    formData.role === "merchant"
                      ? "bg-blue-50 border-blue-400 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-white border-gray-300 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="merchant"
                    className="sr-only"
                    checked={formData.role === "merchant"}
                    onChange={handleChange}
                  />
                  <span>Merchant</span>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold flex justify-center items-center transition duration-300 shadow-md"
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : "Create Account"}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
