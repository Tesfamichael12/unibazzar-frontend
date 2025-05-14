import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../redux/slices/authSlice";
import {
  FaEdit,
  FaCamera,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaStore,
  FaBook,
  FaBuilding,
  FaUser,
  FaCalendarAlt,
  FaUserFriends
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ProfileSection = ({ title, children }) => (
  <motion.div
    className="mb-8"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4 font-poppins">
      {title}
    </h2>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {children}
    </div>
  </motion.div>
);

const ProfileField = ({ icon, label, value }) => (
  <div className="flex items-start mb-4 last:mb-0">
    <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900 mr-3">
      {icon}
    </div>
    <div>
      <p className="text-sm text-neutral-500 dark:text-gray-300 font-inter">
        {label}
      </p>
      <p className="text-neutral-800 dark:text-white font-medium font-inter">
        {value || "Not provided"}
      </p>
    </div>
  </div>
);

function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProfile());
    } else {
      navigate("/login");
    }
  }, [dispatch, isAuthenticated, navigate]);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSuccess("Profile picture updated successfully");
    }
  };

  const handleAvatarDelete = () => {
    setSuccess("Profile picture removed successfully");
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center items-center">
        <div className="flex flex-col items-center bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-white">
          <svg
            className="animate-spin h-10 w-10 text-blue-600"
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
          <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg font-inter">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center items-center">
        <div className="text-center bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-white">
          <p className="text-xl mb-4 font-inter">User profile not found</p>
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white font-poppins"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence>
        {error && (
          <motion.div 
            className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-lg mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-center font-inter">{error}</p>
            <button
              className="text-red-700 text-xs underline ml-2"
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </motion.div>
        )}
        {success && (
          <motion.div 
            className="bg-green-100 border border-green-200 text-green-700 p-3 rounded-lg mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-center font-inter">{success}</p>
            <button
              className="text-green-700 text-xs underline ml-2"
              onClick={() => setSuccess(null)}
            >
              Dismiss
            </button>
          </motion.div>
        )}
        </AnimatePresence>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <ProfileSection title="Profile">
              <div className="flex flex-col items-center">
                <motion.div className="relative mb-6" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }}>
                  <div className="w-32 h-32 rounded-full bg-neutral-200 overflow-hidden">
                    {user.profile_picture ? (
                      <img
                        src={user.profile_picture}
                        alt={user.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <FaUser size={64} />
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 flex gap-2">
                    <label className="p-2 rounded-full bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition-colors">
                      <FaCamera size={18} />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </label>
                    {user.profile_picture && (
                      <button
                        className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                        onClick={handleAvatarDelete}
                      >
                        <FaTrash size={18} />
                      </button>
                    )}
                  </div>
                </motion.div>
                <h3 className="text-xl font-bold font-poppins text-gray-800 dark:text-white">
                  {user.full_name}
                </h3>
                <p className="text-neutral-500 dark:text-gray-300 capitalize mb-4 font-inter">
                  {user.role === "campus_admin"
                    ? "Campus Admin"
                    : user.role === "merchant"
                    ? "Merchant"
                    : user.role === "tutor"
                    ? "Tutor"
                    : "Student"}
                </p>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md inline-flex items-center font-poppins"
                  onClick={handleEditProfile}
                >
                  <FaEdit size={16} className="mr-2" />
                  Edit Profile
                </button>
              </div>
            </ProfileSection>

            <ProfileSection title="Account Information">
              <ProfileField
                icon={<FaEnvelope size={20} className="text-blue-600" />}
                label="Email Address"
                value={user.email}
              />
              <div className="flex items-center mb-4">
                <div className="ml-12 text-xs font-inter">
                  {user.is_email_verified ? (
                    <span className="text-green-600">Verified</span>
                  ) : (
                    <span className="text-amber-600">Not verified</span>
                  )}
                </div>
              </div>
              <ProfileField
                icon={<FaPhone size={20} className="text-blue-600" />}
                label="Phone Number"
                value={user.phone_number}
              />
              <ProfileField
                icon={<FaGraduationCap size={20} className="text-blue-600" />}
                label="University"
                value={user.university}
              />
              {user.university_details && (
                <ProfileField
                  icon={<FaBuilding size={20} className="text-blue-600" />}
                  label="University Details"
                  value={user.university_details}
                />
              )}
              <p className="text-xs text-neutral-500 dark:text-gray-300 mt-4 font-inter">
                Member since {new Date(user.date_joined).toLocaleDateString()}
              </p>
            </ProfileSection>
          </div>

          <div className="lg:w-2/3">
            {user.role === "student" && (
              <ProfileSection title="Student Information">
                <ProfileField
                  icon={<FaGraduationCap size={20} className="text-blue-600" />}
                  label="University"
                  value={user.student_profile?.university_name}
                />
                {/* Add more student-specific fields */}
              </ProfileSection>
            )}

            {user.role === "merchant" && (
              <ProfileSection title="Merchant Information">
                <ProfileField
                  icon={<FaStore size={20} className="text-blue-600" />}
                  label="Store Name"
                  value={user.merchant_profile?.store_name}
                />
                <ProfileField
                  icon={<FaBuilding size={20} className="text-blue-600" />}
                  label="Nearest University"
                  value={user.merchant_profile?.nearest_university}
                />
                <ProfileField
                  icon={<FaPhone size={20} className="text-blue-600" />}
                  label="Business Phone"
                  value={user.merchant_profile?.phone_number}
                />
                {/* Add more merchant-specific fields */}
              </ProfileSection>
            )}

            {user.role === "tutor" && (
              <ProfileSection title="Tutor Information">
                <ProfileField
                  icon={<FaBook size={20} className="text-blue-600" />}
                  label="Department"
                  value={user.tutor_profile?.department}
                />
                <ProfileField
                  icon={<FaCalendarAlt size={20} className="text-blue-600" />}
                  label="Year"
                  value={user.tutor_profile?.year}
                />
                {/* Add more tutor-specific fields */}
              </ProfileSection>
            )}

            {user.role === "campus_admin" && (
              <ProfileSection title="Campus Admin Information">
                <ProfileField
                  icon={<FaBuilding size={20} className="text-blue-600" />}
                  label="University"
                  value={user.campus_admin_profile?.university}
                />
                <ProfileField
                  icon={<FaUserFriends size={20} className="text-blue-600" />}
                  label="Admin Role"
                  value={user.campus_admin_profile?.admin_role}
                />
                {/* Add more campus admin-specific fields */}
              </ProfileSection>
            )}

            {/* Activity Section */}
            <ProfileSection title="Recent Activity">
              <div className="py-6 text-center text-neutral-500 dark:text-gray-300 font-inter">
                <p>No recent activity to display</p>
              </div>
            </ProfileSection>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
