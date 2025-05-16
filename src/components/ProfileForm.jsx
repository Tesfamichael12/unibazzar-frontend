import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateUserProfile,
  updateStudentProfile,
  updateMerchantProfile,
  updateTutorProfile,
  updateCampusAdminProfile,
  fetchUniversities,
  resetSuccessFlags,
} from "../redux/slices/userSlice";
import { fetchUserProfile } from "../redux/slices/authSlice";
import { FaSave, FaTimes } from "react-icons/fa";

function ProfileForm({ onCancel }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { universities, loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    phone_number: "",
  });

  const [roleFormData, setRoleFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchUniversities());
    return () => {
      dispatch(resetSuccessFlags());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;

    // Common fields
    setFormData((prev) => ({
      ...prev,
      full_name: user.full_name || "",
      phone_number: user.phone_number || "",
    }));

    // Role-specific fields
    switch (user.role) {
      case "student":
        setRoleFormData({
          university_id: user.student_profile?.university_id || "",
        });
        break;
      case "merchant":
        setRoleFormData({
          store_name: user.merchant_profile?.store_name || "",
          nearest_university: user.merchant_profile?.nearest_university || "",
          phone_number: user.merchant_profile?.phone_number || "",
          tin_number: user.merchant_profile?.tin_number || "",
        });
        break;
      case "tutor":
        setRoleFormData({
          department: user.tutor_profile?.department || "",
          year: user.tutor_profile?.year || "",
          subjects_scores: user.tutor_profile?.subjects_scores || "",
          teaching_levels: user.tutor_profile?.teaching_levels || "",
        });
        break;
      case "campus_admin":
        setRoleFormData({
          university: user.campus_admin_profile?.university || "",
          admin_role: user.campus_admin_profile?.admin_role || "",
        });
        break;
      default:
        break;
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleInputChange = (e) => {
    const { name, value } = e.target;
    setRoleFormData({
      ...roleFormData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    try {
      // Update common user profile data
      await dispatch(updateUserProfile(formData)).unwrap();

      // Update role-specific profile
      if (user.role === "student") {
        await dispatch(updateStudentProfile(roleFormData)).unwrap();
      } else if (user.role === "merchant") {
        await dispatch(updateMerchantProfile(roleFormData)).unwrap();
      } else if (user.role === "tutor") {
        await dispatch(updateTutorProfile(roleFormData)).unwrap();
      } else if (user.role === "campus_admin") {
        await dispatch(updateCampusAdminProfile(roleFormData)).unwrap();
      }

      // Refresh user data after successful update
      await dispatch(fetchUserProfile()).unwrap();

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        onCancel(); // Close the form after success
      }, 2000);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const renderRoleSpecificFields = () => {
    if (!user) return null;

    switch (user.role) {
      case "student":
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">University</label>
            <select
              name="university_id"
              value={roleFormData.university_id || ""}
              onChange={handleRoleInputChange}
              className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 text-white"
            >
              <option value="" className="bg-blue-800">
                Select University
              </option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id} className="bg-blue-800">
                  {uni.name}
                </option>
              ))}
            </select>
          </div>
        );

      case "merchant":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Store Name
              </label>
              <input
                type="text"
                name="store_name"
                value={roleFormData.store_name || ""}
                onChange={handleRoleInputChange}
                className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 placeholder-white/50 text-white"
                placeholder="Enter store name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Nearest University
              </label>
              <select
                name="nearest_university"
                value={roleFormData.nearest_university || ""}
                onChange={handleRoleInputChange}
                className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 text-white"
              >
                <option value="" className="bg-blue-800">
                  Select University
                </option>
                {universities.map((uni) => (
                  <option key={uni.id} value={uni.name} className="bg-blue-800">
                    {uni.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone_number"
                value={roleFormData.phone_number || ""}
                onChange={handleRoleInputChange}
                className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 placeholder-white/50 text-white"
                placeholder="Enter phone number"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                TIN Number
              </label>
              <input
                type="text"
                name="tin_number"
                value={roleFormData.tin_number || ""}
                onChange={handleRoleInputChange}
                className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 placeholder-white/50 text-white"
                placeholder="Enter TIN number"
              />
            </div>
          </>
        );

      case "tutor":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={roleFormData.department || ""}
                onChange={handleRoleInputChange}
                className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 placeholder-white/50 text-white"
                placeholder="Enter department"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Year</label>
              <input
                type="text"
                name="year"
                value={roleFormData.year || ""}
                onChange={handleRoleInputChange}
                className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 placeholder-white/50 text-white"
                placeholder="Enter year"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Subjects & Scores
              </label>
              <textarea
                name="subjects_scores"
                value={roleFormData.subjects_scores || ""}
                onChange={handleRoleInputChange}
                className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 placeholder-white/50 text-white"
                placeholder="Enter subjects and scores"
                rows={3}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Teaching Levels
              </label>
              <input
                type="text"
                name="teaching_levels"
                value={roleFormData.teaching_levels || ""}
                onChange={handleRoleInputChange}
                className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 placeholder-white/50 text-white"
                placeholder="Enter teaching levels"
              />
            </div>
          </>
        );

      case "campus_admin":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                University
              </label>
              <select
                name="university"
                value={roleFormData.university || ""}
                onChange={handleRoleInputChange}
                className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 text-white"
              >
                <option value="" className="bg-blue-800">
                  Select University
                </option>
                {universities.map((uni) => (
                  <option key={uni.id} value={uni.name} className="bg-blue-800">
                    {uni.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Admin Role
              </label>
              <input
                type="text"
                name="admin_role"
                value={roleFormData.admin_role || ""}
                onChange={handleRoleInputChange}
                className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 placeholder-white/50 text-white"
                placeholder="Enter admin role"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="text-center p-8 text-white">
        <p>Please log in to edit your profile.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Edit Profile</h2>
        <button onClick={onCancel} className="text-white/70 hover:text-white">
          <FaTimes />
        </button>
      </div>

      {error && (
        <div className="bg-red-500/30 backdrop-blur-md p-3 rounded-lg mb-6">
          <p className="text-white text-sm text-center">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-500/30 backdrop-blur-md p-3 rounded-lg mb-6">
          <p className="text-white text-sm text-center">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Common fields for all users */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 placeholder-white/50 text-white"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Role-specific fields */}
        {renderRoleSpecificFields()}

        <div className="flex justify-end mt-6 space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-white/30 rounded-md hover:bg-white/10 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md flex items-center transition-colors duration-200"
          >
            {loading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </div>
            ) : (
              <>
                <FaSave className="mr-2" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileForm;
