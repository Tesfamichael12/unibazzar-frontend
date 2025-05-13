import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaStore,
  FaBuilding,
  FaPhone,
  FaFileAlt,
  FaSave,
} from "react-icons/fa";
import { fetchUserProfile } from "../../../redux/slices/authSlice";
import useProfiles from "../../../hooks/useProfiles";
import Layout from "../../common/Layout";
import Spinner from "../../../components/ui/Spinner";
import Alert from "../../../components/ui/Alert";
import api from "../../../redux/api/uniBazzarApi";

const MerchantProfileForm = ({ mode = "create" }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    store_name: "",
    nearest_university: "",
    phone_number: "",
    tin_number: "",
    business_docs: null,
  });
  const [error, setError] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  const {
    universities,
    currentProfile,
    createProfile,
    updateProfile,
    getUniversities,
    getProfile,
    isLoading,
    error: profileError,
    clearError,
  } = useProfiles("merchant");
  const navigate = useNavigate();

  const [universitySearchTerm, setUniversitySearchTerm] = useState("");
  const [isUniversityDropdownOpen, setIsUniversityDropdownOpen] =
    useState(false);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [selectedUniversityName, setSelectedUniversityName] = useState("");
  const universityDropdownRef = useRef(null);

  // Check if user already has a merchant profile
  useEffect(() => {
    // Move retryCount outside the function so it persists across retries
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second between retries
    let timeoutId = null;
    let isUnmounted = false;

    const checkExistingProfile = async () => {
      if (mode === "create" && isAuthenticated) {
        let userId;
        try {
          setCheckingProfile(true);
          // Try to get user ID from auth state or from localStorage
          const newUserData = JSON.parse(
            localStorage.getItem("newUserData") || "{}"
          );
          userId = user?.id || newUserData?.id;

          console.log(
            "[MerchantProfileForm] Checking for existing profile with userId:",
            userId
          );

          if (userId) {
            // Check if user already has a merchant profile
            try {
              console.log(
                `[MerchantProfileForm] Making API request to: /api/users/merchant-profiles/?user=${userId}`
              );
              const response = await api.get(
                `/api/users/merchant-profiles/?user=${userId}`
              );

              // Log the full response for debugging
              console.log(`[MerchantProfileForm] API Response:`, response);

              // If we get profiles back, user already has a profile
              // Check for both direct array response and paginated response with results array
              if (
                (Array.isArray(response.data) && response.data.length > 0) ||
                (response.data &&
                  response.data.results &&
                  response.data.results.length > 0)
              ) {
                // Get the profile data - either directly or from results array
                const profileData = Array.isArray(response.data)
                  ? response.data[0]
                  : response.data.results[0];

                console.log(
                  "[MerchantProfileForm] User already has a merchant profile, redirecting to dashboard. Profile data:",
                  profileData
                );
                navigate("/merchant-dashboard", { replace: true });
                return;
              } else {
                console.log(
                  "[MerchantProfileForm] No existing profile found for user. Response data:",
                  response.data
                );
              }
            } catch (error) {
              // If error is not 404 (not found), log it
              console.error(
                "[MerchantProfileForm] Error checking for existing profile:",
                error.response || error
              );
              if (error.response?.status !== 404) {
                console.error(
                  "[MerchantProfileForm] Error checking for existing profile:",
                  error
                );
              }
            }
            // If we get here, no profile exists, so allow form to show
            setCheckingProfile(false);
          } else {
            console.log(
              "[MerchantProfileForm] No user ID available to check for profile. Retry count:",
              retryCount
            );
            // If we don't have a user ID yet but we're authenticated, we might need to wait for the profile fetch
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(
                `[MerchantProfileForm] Will retry in ${retryDelay}ms (attempt ${retryCount}/${maxRetries})`
              );

              // Set up retry with delay
              timeoutId = setTimeout(() => {
                checkExistingProfile();
              }, retryDelay);

              // Exit early without clearing checking state
              return;
            } else {
              // Retries exhausted, stop spinner
              setCheckingProfile(false);
            }
          }
        } finally {
          // Only set checkingProfile to false if not already handled
          if (
            userId === undefined &&
            retryCount >= maxRetries &&
            !isUnmounted
          ) {
            setCheckingProfile(false);
          }
        }
      } else {
        console.log(
          `[MerchantProfileForm] Skipping profile check. Mode: ${mode}, isAuthenticated: ${isAuthenticated}`
        );
        setCheckingProfile(false);
      }
    };

    checkExistingProfile();

    // Clean up any pending timeouts on unmount
    return () => {
      isUnmounted = true;
      if (timeoutId) clearTimeout(timeoutId);
      setCheckingProfile(false);
    };
  }, [isAuthenticated, user, navigate, mode]);

  // Fetch user profile if not available
  useEffect(() => {
    if (isAuthenticated && (!user || !user.id)) {
      console.log("Fetching user profile data");
      dispatch(fetchUserProfile());
    } else if (user && user.id) {
      console.log("User data available from auth state:", user.id);
    }

    // Log what we have in localStorage
    const storedData = JSON.parse(localStorage.getItem("newUserData") || "{}");
    console.log("User data in localStorage:", storedData);
  }, [isAuthenticated, user, dispatch]);

  useEffect(() => {
    // Fetch universities list
    getUniversities();

    // If in edit mode, fetch current profile
    if (mode === "edit" && user?.profile_id) {
      getProfile(user.profile_id);
    }
  }, [mode, user, getUniversities, getProfile]);

  useEffect(() => {
    // Populate form with existing data in edit mode
    if (mode === "edit" && currentProfile) {
      setFormData({
        store_name: currentProfile.store_name || "",
        nearest_university: currentProfile.nearest_university || "",
        phone_number: currentProfile.phone_number || "",
        tin_number: currentProfile.tin_number || "",
        business_docs: null, // Don't populate file input
      });
    }
  }, [mode, currentProfile]);

  useEffect(() => {
    // Handle API errors
    if (profileError) {
      if (profileError.detail) {
        setError(profileError.detail);
      } else if (typeof profileError === "object") {
        // Format field errors
        const fieldErrors = Object.entries(profileError)
          .map(
            ([field, messages]) =>
              `${field}: ${
                Array.isArray(messages) ? messages.join(", ") : messages
              }`
          )
          .join("; ");
        setError(fieldErrors);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  }, [profileError]);

  // University search filter logic
  useEffect(() => {
    if (!universities) return;
    if (universitySearchTerm.trim() === "") {
      setFilteredUniversities(universities);
    } else {
      const filtered = universities.filter((uni) =>
        uni.name.toLowerCase().includes(universitySearchTerm.toLowerCase())
      );
      setFilteredUniversities(filtered);
    }
  }, [universitySearchTerm, universities]);

  // University dropdown close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        universityDropdownRef.current &&
        !universityDropdownRef.current.contains(event.target)
      ) {
        setIsUniversityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Set selected university name if editing
  useEffect(() => {
    if (mode === "edit" && currentProfile && universities.length > 0) {
      const uni = universities.find(
        (u) => u.name === currentProfile.nearest_university
      );
      if (uni) setSelectedUniversityName(uni.name);
    }
  }, [mode, currentProfile, universities]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "business_docs" && files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const selectUniversity = (uni) => {
    setSelectedUniversityName(uni.name);
    setFormData({ ...formData, nearest_university: uni.name });
    setIsUniversityDropdownOpen(false);
    setUniversitySearchTerm("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    clearError();

    // Try to get user ID from auth state or from localStorage
    const newUserData = JSON.parse(localStorage.getItem("newUserData") || "{}");
    console.log("Auth user:", user);
    console.log("localStorage user data:", newUserData);

    const userId = user?.id || newUserData?.id;
    console.log("Using user ID:", userId);

    if (!userId) {
      setError(
        "User data not available. Please try again or log out and back in."
      );
      console.error("Cannot submit profile - no user ID available");
      return;
    }

    // Create FormData object to handle file upload
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        submitData.append(key, value);
      }
    });

    // Debug what we're sending
    console.log("Submitting merchant profile with fields:", {
      store_name: formData.store_name,
      nearest_university: formData.nearest_university,
      phone_number: formData.phone_number,
      tin_number: formData.tin_number,
      business_docs: formData.business_docs ? "File attached" : "No file",
      user: userId,
    });

    try {
      if (mode === "create") {
        const result = await createProfile(submitData);
        console.log("Profile creation successful:", result);

        // Clear the stored user data since profile creation is complete
        localStorage.removeItem("newUserData");

        // Show a temporary success message
        setError(null);
        const successEl = document.createElement("div");
        successEl.className = "mb-6";
        successEl.innerHTML = `
          <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start justify-between">
            <div>
              <p class="font-medium">Profile created successfully!</p>
              <p>Redirecting to your dashboard...</p>
            </div>
          </div>
        `;
        document.querySelector(".mb-6")?.parentNode.appendChild(successEl);

        // Wait a moment for profile data to update in Redux state before redirecting
        setTimeout(() => {
          // Force refresh user profile
          dispatch(fetchUserProfile());

          // Wait a bit more to make sure profile data is loaded
          setTimeout(() => {
            console.log("Redirecting to merchant dashboard");
            navigate("/merchant-dashboard", { replace: true });
          }, 1000);
        }, 1000);
      } else if (mode === "edit" && user?.profile_id) {
        const result = await updateProfile(user.profile_id, submitData);
        console.log("Profile update successful:", result);

        // Force refresh user profile
        dispatch(fetchUserProfile());

        // Wait a moment for profile data to update
        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      }
    } catch (error) {
      // Error is handled via the useEffect above
      console.error("Submit error:", error);
    }
  };

  // Add this function to reset the form
  const handleCancel = () => {
    setFormData({
      store_name: "",
      nearest_university: "",
      phone_number: "",
      tin_number: "",
      business_docs: null,
    });
    setSelectedUniversityName("");
    setUniversitySearchTerm("");
    setError(null);
  };

  // Show loading indicator while checking for existing profile
  if (checkingProfile) {
    return (
      <Layout>
        <div className="h-96 flex items-center justify-center">
          <Spinner size="lg" />
          <p className="ml-3 text-gray-600">Checking profile status...</p>
        </div>
      </Layout>
    );
  }

  // Show loading indicator while fetching user data
  if (!user && isAuthenticated) {
    return (
      <Layout>
        <div className="h-96 flex items-center justify-center">
          <Spinner size="lg" />
          <p className="ml-3 text-gray-600">Loading user data...</p>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="h-96 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center pt-20">
        <div className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white font-poppins">
              {mode === "create"
                ? "Complete Your Merchant Profile"
                : "Edit Your Merchant Profile"}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300 font-inter">
              {mode === "create"
                ? "Please provide your business information to complete your profile."
                : "Update your business information below."}
            </p>
          </div>

          {error && (
            <div className="mb-6">
              <Alert
                type="error"
                message={error}
                onClose={() => {
                  setError(null);
                  clearError();
                }}
              />
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="store_name"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Store Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaStore className="text-gray-500" />
                </div>
                <input
                  id="store_name"
                  name="store_name"
                  type="text"
                  className="w-full px-4 py-3 pl-10 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder-gray-400 text-gray-800 dark:text-white"
                  placeholder="Enter your store name"
                  value={formData.store_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div ref={universityDropdownRef}>
              <label
                htmlFor="nearest_university_search"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Nearest University
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaBuilding className="text-gray-500" />
                </div>
                <input
                  type="text"
                  id="nearest_university_search"
                  placeholder="Search for nearest University"
                  className="w-full px-4 py-3 pl-10 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder-gray-400 text-gray-800 dark:text-white"
                  value={universitySearchTerm}
                  onChange={(e) => setUniversitySearchTerm(e.target.value)}
                  onFocus={() => setIsUniversityDropdownOpen(true)}
                  autoComplete="off"
                />
                {/* Hidden input for form submission */}
                <input
                  type="hidden"
                  name="nearest_university"
                  value={formData.nearest_university}
                  required
                />
                {isUniversityDropdownOpen &&
                  filteredUniversities.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white shadow-lg border border-gray-200">
                      {filteredUniversities.map((uni) => (
                        <div
                          key={uni.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                          onClick={() => selectUniversity(uni)}
                        >
                          {uni.name}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
              {selectedUniversityName && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-blue-700 text-sm font-medium">
                  Selected: {selectedUniversityName}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="phone_number"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Business Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaPhone className="text-gray-500" />
                </div>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  className="w-full px-4 py-3 pl-10 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder-gray-400 text-gray-800 dark:text-white"
                  placeholder="Enter business phone number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="tin_number"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                TIN Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaFileAlt className="text-gray-500" />
                </div>
                <input
                  id="tin_number"
                  name="tin_number"
                  type="text"
                  className="w-full px-4 py-3 pl-10 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder-gray-400 text-gray-800 dark:text-white"
                  placeholder="Enter your TIN number"
                  value={formData.tin_number}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="business_docs"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Business Documents
              </label>
              <div className="relative">
                <input
                  id="business_docs"
                  name="business_docs"
                  type="file"
                  className="w-full px-4 py-3 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-gray-800 dark:text-white"
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  required={mode === "create"}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 font-inter">
                Please upload documents proving your business registration.
                Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG.
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-poppins"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors shadow-md font-poppins"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    {mode === "create" ? "Create Profile" : "Save Changes"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default MerchantProfileForm;
