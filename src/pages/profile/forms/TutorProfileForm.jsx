import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaBook,
  FaCalendarAlt,
  FaList,
  FaFileAlt,
  FaPlus,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import useProfiles from "../../../hooks/useProfiles";
import Layout from "../../common/Layout";
import Spinner from "../../../components/ui/Spinner";
import Alert from "../../../components/ui/Alert";

const TutorProfileForm = ({ mode = "create" }) => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    department: "",
    year: "",
    teaching_levels: [],
    subjects_scores: {},
    edu_docs: null,
  });
  const [subjectInput, setSubjectInput] = useState("");
  const [scoreInput, setScoreInput] = useState("");
  const [error, setError] = useState(null);

  const {
    currentProfile,
    createProfile,
    updateProfile,
    getProfile,
    isLoading,
    error: profileError,
    clearError,
  } = useProfiles("tutor");
  const navigate = useNavigate();

  useEffect(() => {
    // On mount, if mode is 'create', check if a tutor profile already exists for this user
    // If so, redirect to dashboard to avoid duplicate profile errors
    const checkExistingTutorProfile = async () => {
      if (mode === "create" && user?.id) {
        try {
          const url = `/api/users/tutor-profiles/?user=${user.id}`;
          const response = await import("../../../redux/api/uniBazzarApi").then(
            (m) => m.default.get(url)
          );
          const data = response.data;
          if (
            (Array.isArray(data) && data.length > 0) ||
            (data && data.results && data.results.length > 0)
          ) {
            // Profile exists, redirect to dashboard
            navigate("/tutor-dashboard", { replace: true });
          }
        } catch (err) {
          // Only ignore 404 (not found), rethrow others
          if (!(err.response && err.response.status === 404)) {
            // Optionally show an error
            setError(
              "Could not verify existing tutor profile. Please try again later."
            );
          }
        }
      }
    };
    checkExistingTutorProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, user, navigate]);

  useEffect(() => {
    // If in edit mode, fetch current profile
    if (mode === "edit" && user?.profile_id) {
      getProfile(user.profile_id);
    }
  }, [mode, user, getProfile]);

  useEffect(() => {
    // Populate form with existing data in edit mode
    if (mode === "edit" && currentProfile) {
      setFormData({
        department: currentProfile.department || "",
        year: currentProfile.year || "",
        teaching_levels: currentProfile.teaching_levels || [],
        subjects_scores: currentProfile.subjects_scores || {},
        edu_docs: null, // Don't populate file input
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

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (name === "edu_docs" && files) {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      // Handle teaching levels checkboxes
      const levelsCopy = [...formData.teaching_levels];
      if (checked) {
        levelsCopy.push(value);
      } else {
        const index = levelsCopy.indexOf(value);
        if (index !== -1) {
          levelsCopy.splice(index, 1);
        }
      }
      setFormData({ ...formData, teaching_levels: levelsCopy });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddSubject = () => {
    if (subjectInput && scoreInput) {
      setFormData({
        ...formData,
        subjects_scores: {
          ...formData.subjects_scores,
          [subjectInput]: scoreInput,
        },
      });

      // Clear inputs
      setSubjectInput("");
      setScoreInput("");
    }
  };

  const handleRemoveSubject = (subject) => {
    const { [subject]: _, ...rest } = formData.subjects_scores;
    setFormData({
      ...formData,
      subjects_scores: rest,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    clearError();

    // Create FormData object to handle file upload
    const submitData = new FormData();

    // Append simple fields
    submitData.append("department", formData.department);
    submitData.append("year", formData.year);

    // Append arrays and objects as JSON strings
    submitData.append(
      "teaching_levels",
      JSON.stringify(formData.teaching_levels)
    );
    submitData.append(
      "subjects_scores",
      JSON.stringify(formData.subjects_scores)
    );

    // Append file if present
    if (formData.edu_docs) {
      submitData.append("edu_docs", formData.edu_docs);
    }

    try {
      if (mode === "create") {
        await createProfile(submitData);
        navigate("/listings", { replace: true });
      } else if (mode === "edit" && user?.profile_id) {
        await updateProfile(user.profile_id, submitData);
        navigate("/profile", { replace: true });
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
      // Error is handled via the useEffect above
      console.log("Submit error:", error);
    }
  };

  // Add this function to reset the form
  const handleCancel = () => {
    setFormData({
      department: "",
      year: "",
      teaching_levels: [],
      subjects_scores: {},
      edu_docs: null,
    });
    setSubjectInput("");
    setScoreInput("");
    setError(null);
  };

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
      <div className="p-8 pt-20 bg-white dark:bg-gray-900 rounded-xl shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white font-poppins">
            {mode === "create"
              ? "Complete Your Tutor Profile"
              : "Edit Your Tutor Profile"}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 font-inter">
            {mode === "create"
              ? "Please provide your teaching information to complete your profile."
              : "Update your teaching information below."}
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
              htmlFor="department"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Department
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaBook className="text-gray-500" />
              </div>
              <input
                id="department"
                name="department"
                type="text"
                className="w-full px-4 py-3 pl-10 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder-gray-400 text-gray-800 dark:text-white"
                placeholder="e.g. Computer Science, Mathematics"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="year"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Year
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaCalendarAlt className="text-gray-500" />
              </div>
              <select
                id="year"
                name="year"
                className="w-full px-4 py-3 pl-10 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder-gray-400 text-gray-800 dark:text-white"
                value={formData.year}
                onChange={handleChange}
                required
              >
                <option value="">Select your year</option>
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center">
              <FaList className="mr-2 text-gray-500" />
              Teaching Levels
            </label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="flex items-center">
                <input
                  id="level_elementary"
                  name="teaching_levels"
                  type="checkbox"
                  value="Elementary"
                  checked={formData.teaching_levels.includes("Elementary")}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="level_elementary"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-200"
                >
                  Elementary
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="level_middle_school"
                  name="teaching_levels"
                  type="checkbox"
                  value="Middle School"
                  checked={formData.teaching_levels.includes("Middle School")}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="level_middle_school"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-200"
                >
                  Middle School
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="level_high_school"
                  name="teaching_levels"
                  type="checkbox"
                  value="High School"
                  checked={formData.teaching_levels.includes("High School")}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="level_high_school"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-200"
                >
                  High School
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="level_college"
                  name="teaching_levels"
                  type="checkbox"
                  value="College"
                  checked={formData.teaching_levels.includes("College")}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="level_college"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-200"
                >
                  College
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Subjects and Scores
            </label>
            <div className="flex space-x-2 mb-3">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Subject name"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder-gray-400 text-gray-800 dark:text-white"
                />
              </div>
              <div className="w-20">
                <input
                  type="text"
                  placeholder="Score"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder-gray-400 text-gray-800 dark:text-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddSubject}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 w-12 h-12 rounded-md flex items-center justify-center"
              >
                <FaPlus />
              </button>
            </div>

            <div className="space-y-2">
              {Object.entries(formData.subjects_scores).map(
                ([subject, score]) => (
                  <div
                    key={subject}
                    className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-md"
                  >
                    <div className="flex-grow">
                      <span className="font-medium">{subject}</span>
                      <span className="ml-2 text-sm">({score})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(subject)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )
              )}

              {Object.keys(formData.subjects_scores).length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-300 italic">
                  No subjects added yet. Add at least one subject with its
                  score.
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="edu_docs"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Educational Documents
            </label>
            <div className="relative">
              <input
                id="edu_docs"
                name="edu_docs"
                type="file"
                className="w-full px-4 py-3 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-gray-800 dark:text-white"
                onChange={handleChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                required={mode === "create"}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 font-inter">
              Please upload documents proving your educational background.
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
    </Layout>
  );
};

export default TutorProfileForm;
