import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../redux/slices/authSlice";
import api from "../redux/api/uniBazzarApi"; // Import the API instance
import GlobalSpinner from "../components/ui/GlobalSpinner"; // Import GlobalSpinner
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
  FaUserFriends, // This seems unused, consider removing if not needed for role profiles
  FaList, // This seems unused
  FaFilePdf, // This seems unused
  FaUserPlus, // This seems unused
  FaIdCard, // For TIN number
  FaInfoCircle, // For Bio/Store Bio/Tutor Bio
  FaMapMarkerAlt, // For Address
  FaBriefcase, // For Experience Years
  FaChalkboardTeacher, // For Teaching Levels
  FaDollarSign, // For Hourly Rate
} from "react-icons/fa";
import ThemeToggle from "../components/ui/ThemeToggle";

const ProfileSection = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4 font-poppins">
      {title}
    </h2>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {children}
    </div>
  </div>
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

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [roleSpecificProfile, setRoleSpecificProfile] = useState(null);
  const [roleProfileLoading, setRoleProfileLoading] = useState(false);
  const [roleProfileError, setRoleProfileError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProfile());
    } else {
      navigate("/login");
    }
  }, [dispatch, isAuthenticated, navigate]);

  useEffect(() => {
    if (user && user.id) {
      const fetchRoleProfile = async () => {
        let profileUrl = null;
        let profileId = null;
        let profileType = "";

        if (
          user.is_student &&
          user.student_profile_data &&
          user.student_profile_data.id
        ) {
          profileId = user.student_profile_data.id;
          profileUrl = `/api/users/student-profiles/${profileId}/`;
          profileType = "Student";
        } else if (
          user.is_tutor &&
          user.tutor_profile_data &&
          user.tutor_profile_data.id
        ) {
          profileId = user.tutor_profile_data.id;
          profileUrl = `/api/users/tutor-profiles/${profileId}/`;
          profileType = "Tutor";
        } else if (
          user.is_merchant &&
          user.merchant_profile_data &&
          user.merchant_profile_data.id
        ) {
          profileId = user.merchant_profile_data.id;
          profileUrl = `/api/users/merchant-profiles/${profileId}/`;
          profileType = "Merchant";
        }

        if (profileUrl) {
          setRoleProfileLoading(true);
          setRoleProfileError(null);
          setRoleSpecificProfile(null); // Reset previous profile data
          try {
            const response = await api.get(profileUrl);
            setRoleSpecificProfile(response.data);
          } catch (err) {
            console.error(`Failed to fetch ${profileType} profile:`, err);
            setRoleProfileError(
              err.response?.data?.detail ||
                err.message ||
                `Failed to load ${profileType} profile.`
            );
          } finally {
            setRoleProfileLoading(false);
          }
        } else {
          // If no specific profile ID is found, clear any previous role-specific data
          setRoleSpecificProfile(null);
          setRoleProfileLoading(false);
          setRoleProfileError(null);
        }
      };

      fetchRoleProfile();
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // In a real implementation, we would use this file for uploading
      // const file = e.target.files[0];

      // Mock success message - in production, this would happen after API call
      setSuccess("Profile picture updated successfully");
    }
  };

  const handleAvatarDelete = () => {
    // Here you would delete the avatar
    setSuccess("Profile picture removed successfully");
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  if (loading && !user) {
    // Show main loading spinner only if user is not yet loaded
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
        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-lg mb-6">
            <p className="text-sm text-center font-inter">{error}</p>
            <button
              className="text-red-700 text-xs underline ml-2"
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-200 text-green-700 p-3 rounded-lg mb-6">
            <p className="text-sm text-center font-inter">{success}</p>
            <button
              className="text-green-700 text-xs underline ml-2"
              onClick={() => setSuccess(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <ProfileSection title="Profile">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
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
                </div>
                <h3 className="text-xl font-bold font-poppins text-gray-800 dark:text-white">
                  {user.full_name}
                </h3>
                <p className="text-neutral-500 dark:text-gray-300 capitalize mb-4 font-inter">
                  {user.role ? user.role.replace("_", " ") : "User"}
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
                icon={
                  <FaEnvelope
                    size={20}
                    className="text-blue-600 dark:text-white"
                  />
                }
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
                icon={
                  <FaPhone
                    size={20}
                    className="text-blue-600 dark:text-white"
                  />
                }
                label="Phone Number"
                value={user.phone_number}
              />
              <ProfileField
                icon={
                  <FaGraduationCap
                    size={20}
                    className="text-blue-600 dark:text-white"
                  />
                }
                label="University"
                value={
                  user.university_details?.name ||
                  user.university ||
                  "Not Provided"
                }
              />
              {user.university_details && (
                <ProfileField
                  icon={
                    <FaBuilding
                      size={20}
                      className="text-blue-600 dark:text-white"
                    />
                  }
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
            {/* Student Information Section */}
            {user.is_student && (
              <ProfileSection title="Student Information">
                {roleProfileLoading && user.role === "student" && (
                  <GlobalSpinner message="Loading student details..." />
                )}
                {!roleProfileLoading &&
                  roleProfileError &&
                  user.role === "student" && (
                    <p className="text-red-500 dark:text-red-400 p-4">
                      Error: {roleProfileError}
                    </p>
                  )}
                {!roleProfileLoading &&
                  !roleProfileError &&
                  roleSpecificProfile &&
                  user.role === "student" && (
                    <>
                      <ProfileField
                        icon={
                          <FaGraduationCap
                            size={20}
                            className="text-blue-600 dark:text-white"
                          />
                        }
                        label="University Name"
                        value={roleSpecificProfile.university_name}
                      />
                      <ProfileField
                        icon={
                          <FaBook
                            size={20}
                            className="text-blue-600 dark:text-white"
                          />
                        }
                        label="Department"
                        value={roleSpecificProfile.department}
                      />
                      <ProfileField
                        icon={
                          <FaCalendarAlt
                            size={20}
                            className="text-blue-600 dark:text-white"
                          />
                        }
                        label="Year of Study"
                        value={roleSpecificProfile.year_of_study}
                      />
                      {/* Add other fields from StudentProfileSerializer as needed */}
                    </>
                  )}
                {/* Fallback if specific profile not loaded but basic data exists in user.student_profile_data */}
                {!roleSpecificProfile &&
                  !roleProfileLoading &&
                  user.student_profile_data &&
                  user.role !== "student" && (
                    <ProfileField
                      icon={
                        <FaGraduationCap
                          size={20}
                          className="text-blue-600 dark:text-white"
                        />
                      }
                      label="University (Basic)"
                      value={user.student_profile_data.university_name}
                    />
                  )}
                {/* Message if no detailed profile could be fetched and no basic data either */}
                {!roleProfileLoading &&
                  !roleSpecificProfile &&
                  !user.student_profile_data?.id && (
                    <p className="text-neutral-500 dark:text-gray-400 p-4">
                      Detailed student profile not available.
                    </p>
                  )}
              </ProfileSection>
            )}

            {/* Merchant Information Section */}
            {user.is_merchant && (
              <ProfileSection title="Merchant Information">
                {roleProfileLoading && user.role === "merchant" && (
                  <GlobalSpinner message="Loading merchant details..." />
                )}
                {!roleProfileLoading &&
                  roleProfileError &&
                  user.role === "merchant" && (
                    <p className="text-red-500 dark:text-red-400 p-4">
                      Error: {roleProfileError}
                    </p>
                  )}
                {!roleProfileLoading &&
                  !roleProfileError &&
                  roleSpecificProfile &&
                  user.role === "merchant" && (
                    <>
                      <ProfileField
                        icon={
                          <FaStore
                            size={20}
                            className="text-blue-600 dark:text-white"
                          />
                        }
                        label="Store Name"
                        value={roleSpecificProfile.store_name}
                      />
                      <ProfileField
                        icon={
                          <FaBuilding
                            size={20}
                            className="text-blue-600 dark:text-white"
                          />
                        }
                        label="Nearest University"
                        value={
                          roleSpecificProfile.nearest_university_details
                            ?.name || roleSpecificProfile.nearest_university
                        }
                      />
                      <ProfileField
                        icon={
                          <FaPhone
                            size={20}
                            className="text-blue-600 dark:text-white"
                          />
                        }
                        label="Business Phone"
                        value={roleSpecificProfile.phone_number}
                      />
                      <ProfileField
                        icon={
                          <FaIdCard
                            size={20}
                            className="text-blue-600 dark:text-white"
                          />
                        }
                        label="TIN Number"
                        value={roleSpecificProfile.tin_number}
                      />
                      <ProfileField
                        icon={
                          <FaMapMarkerAlt
                            size={20}
                            className="text-blue-600 dark:text-white"
                          />
                        }
                        label="Address"
                        value={roleSpecificProfile.address}
                      />
                      <ProfileField
                        icon={
                          <FaInfoCircle
                            size={20}
                            className="text-blue-600 dark:text-white"
                          />
                        }
                        label="Store Bio"
                        value={roleSpecificProfile.store_bio}
                      />
                      {/* Add other fields from MerchantProfileSerializer as needed */}
                    </>
                  )}
                {!roleProfileLoading &&
                  !roleSpecificProfile &&
                  !user.merchant_profile_data?.id && (
                    <p class="text-neutral-500 dark:text-gray-400 p-4">
                      Detailed merchant profile not available.
                    </p>
                  )}
              </ProfileSection>
            )}

            {/* Tutor Information Section */}
            {user.is_tutor && (
              <ProfileSection title="Tutor Information">
                {roleProfileLoading && user.role === "tutor" && (
                  <GlobalSpinner message="Loading tutor details..." />
                )}
                {!roleProfileLoading &&
                  roleProfileError &&
                  user.role === "tutor" && (
                    <p className="text-red-500 dark:text-red-400 p-4">
                      Error: {roleProfileError}
                    </p>
                  )}
                {!roleProfileLoading &&
                  !roleProfileError &&
                  roleSpecificProfile &&
                  user.role === "tutor" && (
                    <>
                      <ProfileField
                        icon={
                          <FaBook
                            size={20}
                            className="text-blue-600 dark:text-white"
                          />
                        }
                        label="Department"
                        value={roleSpecificProfile.department}
                      />
                      <ProfileField
                        icon={
                          <FaCalendarAlt
                            size={20}
                            className="text-blue-600 dark:text-white"
                          />
                        }
                        label="Year/Level"
                        value={roleSpecificProfile.year}
                      />
                      <ProfileField
                        icon={
                          <FaBriefcase
                            size={20}
                            className="text-blue-600 dark:text-white"
                          />
                        }
                        label="Experience Years"
                        value={roleSpecificProfile.experience_years}
                      />
                      <ProfileField
                        icon={
                          <FaDollarSign
                            size={20}
                            className="text-blue-600 dark:text-white"
                          />
                        }
                        label="Hourly Rate"
                        value={roleSpecificProfile.hourly_rate}
                      />
                      <ProfileField
                        icon={
                          <FaChalkboardTeacher
                            size={20}
                            className="text-blue-600 dark:text-white"
                          />
                        }
                        label="Teaching Levels"
                        value={
                          typeof roleSpecificProfile.teaching_levels ===
                          "object"
                            ? JSON.stringify(
                                roleSpecificProfile.teaching_levels
                              )
                            : roleSpecificProfile.teaching_levels
                        }
                      />
                      <ProfileField
                        icon={
                          <FaInfoCircle
                            size={20}
                            className="text-blue-600 dark:text-white"
                          />
                        }
                        label="Tutor Bio"
                        value={roleSpecificProfile.tutor_bio}
                      />
                      {/* Add other fields from TutorProfileSerializer as needed (e.g., subjects_scores, availability, resume) */}
                    </>
                  )}
                {!roleProfileLoading &&
                  !roleSpecificProfile &&
                  !user.tutor_profile_data?.id && (
                    <p className="text-neutral-500 dark:text-gray-400 p-4">
                      Detailed tutor profile not available.
                    </p>
                  )}
              </ProfileSection>
            )}

            {/* Fallback for users whose role doesn't match is_student, is_merchant, is_tutor, or if no specific profile data found */}
            {!user.is_student && !user.is_merchant && !user.is_tutor && (
              <ProfileSection title="Additional Information">
                <p className="text-neutral-500 dark:text-gray-400 p-4">
                  No specific role profile (Student, Merchant, Tutor) found for
                  this user.
                </p>
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

export default ProfilePage;
