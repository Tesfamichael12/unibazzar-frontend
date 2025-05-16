import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../redux/slices/authSlice";

const SignupCompletionHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const newUserData = JSON.parse(localStorage.getItem("newUserData") || "{}");

  // Check if we should have auth tokens
  const authTokens = localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;

  useEffect(() => {
    console.log("SignupCompletionHandler mounted");
    console.log("isAuthenticated:", isAuthenticated);
    console.log("user:", user);
    console.log("newUserData:", newUserData);
    console.log("authTokens present:", authTokens ? "Yes" : "No");

    // If we have auth tokens but no user data, fetch user profile
    if (authTokens && isAuthenticated && !user) {
      console.log("Auth tokens present, fetching user profile");
      dispatch(fetchUserProfile());
      return;
    }

    // With the new flow, we should redirect to login since email verification is required
    console.log("Email verification is required, redirecting to login");
    navigate("/login", {
      state: {
        message:
          "Please verify your email before logging in. Check your inbox for a verification link.",
      },
    });
  }, [isAuthenticated, user, authTokens, dispatch, navigate, newUserData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-100 text-gray-800 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 font-poppins">
            Preparing your account...
          </h1>
          <p className="text-gray-600 mb-6 font-inter">
            Redirecting you to login...
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupCompletionHandler;
