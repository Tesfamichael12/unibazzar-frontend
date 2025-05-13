import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaGraduationCap,
  FaSave,
  FaIdCard,
  FaChalkboardTeacher,
  FaSearch,
  FaUniversity,
} from "react-icons/fa";
import useProfiles from "../../../hooks/useProfiles";
import Layout from "../../common/Layout";
import Spinner from "../../../components/ui/Spinner";
import Alert from "../../../components/ui/Alert";
import { fetchUserProfile } from "../../../redux/slices/authSlice";
import api from "../../../redux/api/uniBazzarApi";

const StudentProfileForm = ({ mode = "create" }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    university_id: "",
    student_id: "",
    offer_tutoring: false,
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [updatingRole, setUpdatingRole] = useState(false);

  // University search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [selectedUniversityName, setSelectedUniversityName] = useState("");
  const dropdownRef = useRef(null);

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
  } = useProfiles("student");
  const navigate = useNavigate();

  // Filter universities based on search term
  useEffect(() => {
    if (!universities) return;

    if (searchTerm.trim() === "") {
      setFilteredUniversities(universities);
    } else {
      const filtered = universities.filter((uni) =>
        uni.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUniversities(filtered);
    }
  }, [searchTerm, universities]);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch user profile to ensure we have the latest auth data
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

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
        university_id: currentProfile.university_id || "",
        student_id: currentProfile.student_id || "",
        offer_tutoring: currentProfile.offer_tutoring || false,
      });

      // Set the university name for display
      if (currentProfile.university_id && universities.length > 0) {
        const uni = universities.find(
          (u) => u.id.toString() === currentProfile.university_id.toString()
        );
        if (uni) {
          setSelectedUniversityName(uni.name);
        }
      }
    }
  }, [mode, currentProfile, universities]);

  // Function to select a university from the dropdown
  const selectUniversity = (uni) => {
    setSelectedUniversityName(uni.name);
    setFormData({ ...formData, university_id: uni.id });
    setIsDropdownOpen(false);
    setSearchTerm(""); // Clear search term after selection
  };

  // Function to update user role to tutor
  const updateUserRoleToTutor = async () => {
    try {
      setUpdatingRole(true);
      // Send PATCH request to update user role
      const response = await api.patch("/api/users/me/", {
        role: "tutor",
      });

      console.log("User role updated to tutor:", response.data);

      // Update the user data in Redux store
      await dispatch(fetchUserProfile());

      return true;
    } catch (error) {
      console.error("Failed to update user role:", error);
      setError("Failed to update your role to tutor. Please try again.");
      return false;
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox separately
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add this function to reset the form
  const handleCancel = () => {
    setFormData({ university_id: "", student_id: "", offer_tutoring: false });
    setSelectedUniversityName("");
    setSearchTerm("");
    setError(null);
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    clearError();

    // Ensure we have latest user data before proceeding
    await dispatch(fetchUserProfile())
      .unwrap()
      .catch((err) => {
        console.error("Failed to refresh user profile:", err);
        setError("Authentication error. Please try logging in again.");
        return;
      });

    // Debug log to show the exact data being submitted
    console.log("Submitting student profile data:", formData);

    try {
      if (mode === "create") {
        // Create student profile
        await createProfile(formData);

        // Check if user wants to offer tutoring services
        if (formData.offer_tutoring) {
          setSuccessMessage(
            "Student profile created! Updating your role to tutor..."
          );

          // Update user role to tutor
          const roleUpdated = await updateUserRoleToTutor();

          if (roleUpdated) {
            setSuccessMessage(
              "Student profile created and role updated! Redirecting to set up your tutoring profile..."
            );

            // Add a small delay to show the message
            setTimeout(() => {
              navigate("/profile/tutor/create");
            }, 1500);
          } else {
            // Role update failed, but student profile was created
            setSuccessMessage(
              "Student profile created but role update failed. You can still set up your tutoring profile."
            );

            setTimeout(() => {
              navigate("/profile/tutor/create");
            }, 1500);
          }
        } else {
          // Regular flow - navigate to listings
          setSuccessMessage("Profile created successfully!");
          setTimeout(() => {
            navigate("/listings");
          }, 1500);
        }
      } else if (mode === "edit" && user?.profile_id) {
        await updateProfile(user.profile_id, formData);

        // If user is switching to tutoring in edit mode
        if (formData.offer_tutoring && user.role === "student") {
          setSuccessMessage("Profile updated! Updating your role to tutor...");

          // Update user role to tutor
          const roleUpdated = await updateUserRoleToTutor();

          if (roleUpdated) {
            setSuccessMessage(
              "Profile updated and role changed to tutor! Redirecting to set up your tutoring profile..."
            );

            setTimeout(() => {
              navigate("/profile/tutor/create");
            }, 1500);
          } else {
            // Role update failed, but profile was updated
            setSuccessMessage(
              "Profile updated but role change failed. You can still set up your tutoring profile."
            );

            setTimeout(() => {
              navigate("/profile");
            }, 1500);
          }
        } else {
          setSuccessMessage("Profile updated successfully!");
          setTimeout(() => {
            navigate("/profile");
          }, 1500);
        }
      }
    } catch (error) {
      // Allow user to pass if tutor profile already exists
      if (
        error.response &&
        typeof error.response.data === "object" &&
        Object.values(error.response.data).some(
          (msg) =>
            typeof msg === "string" &&
            msg
              .toLowerCase()
              .includes("tutor profile with this user already exists")
        )
      ) {
        navigate("/listings", { replace: true });
        return;
      }
      // Log detailed error information
      console.log("Submit error:", error);

      // Check for specific university_name errors
      if (error.response?.data?.university_name) {
        const uniNameError = Array.isArray(error.response.data.university_name)
          ? error.response.data.university_name.join(", ")
          : error.response.data.university_name;
        setError(
          `University Name: ${uniNameError} - Please select a valid university.`
        );
      }
    }
  };

  if (isLoading || updatingRole) {
    return (
      <Layout>
        <div className="h-96 flex items-center justify-center flex-col">
          <Spinner size="lg" />
          {updatingRole && (
            <p className="mt-4 text-gray-600">Updating your role to tutor...</p>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 pt-20 bg-white dark:bg-gray-900 rounded-xl shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white font-poppins">
            {mode === "create"
              ? "Complete Your Student Profile"
              : "Edit Your Student Profile"}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 font-inter">
            {mode === "create"
              ? "Please provide your university information to complete your profile."
              : "Update your university information below."}
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

        {successMessage && (
          <div className="mb-6">
            <Alert
              type="success"
              message={successMessage}
              onClose={() => {
                setSuccessMessage(null);
              }}
            />
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div ref={dropdownRef}>
            <label
              htmlFor="university_search"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              University
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaGraduationCap className="text-gray-500" />
              </div>
              <input
                type="text"
                id="university_search"
                placeholder="Search for your university"
                className="w-full px-4 py-3 pl-10 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder-gray-400 text-gray-800 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
                autoComplete="off"
              />
              {/* Hidden input for form submission */}
              <input
                type="hidden"
                name="university_id"
                value={formData.university_id}
                required
              />
              {isDropdownOpen && filteredUniversities.length > 0 && (
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
              htmlFor="student_id"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              University Student ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaIdCard className="text-gray-500" />
              </div>
              <input
                id="student_id"
                name="student_id"
                type="text"
                className="w-full px-4 py-3 pl-10 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder-gray-400 text-gray-800 dark:text-white"
                placeholder="Enter your student ID number"
                value={formData.student_id}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex items-start space-x-3 pt-2">
            <div className="flex items-center h-6">
              <input
                id="offer_tutoring"
                name="offer_tutoring"
                type="checkbox"
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={formData.offer_tutoring}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="offer_tutoring"
                className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center"
              >
                <FaChalkboardTeacher className="mr-2 text-blue-500" />I want to
                offer tutoring services
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                Check this if you want to register as a tutor. This will update
                your role from student to tutor, and you'll be guided to set up
                your tutor profile next.
              </p>
            </div>
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
              disabled={isLoading || updatingRole}
            >
              {isLoading || updatingRole ? (
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
    </Layout>
  );
};

export default StudentProfileForm;
