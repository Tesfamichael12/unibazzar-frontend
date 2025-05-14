// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/uniBazzarApi";
import axios from "axios";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      console.log("Registering user with data:", userData);
      // Make sure userData contains all required fields:
      // full_name, email, password, confirm_password, university, role
      const response = await api.post("/api/users/register/", userData);

      console.log("Registration API response:", response.data);

      // Store user data for profile creation with user_id from API response
      const userDataToStore = {
        email: userData.email,
        role: userData.role,
      };

      // API returns user_id directly in the response
      if (response.data && response.data.user_id) {
        userDataToStore.id = response.data.user_id;
        console.log(
          `Extracted user ID ${response.data.user_id} from registration response`
        );
      }

      console.log("Storing user data for profile creation:", userDataToStore);
      localStorage.setItem("newUserData", JSON.stringify(userDataToStore));

      return response.data;
    } catch (error) {
      console.error(
        "Registration error details:",
        error.response?.data || error.message
      );

      // Check for field-specific validation errors
      if (error.response?.data) {
        const errorData = error.response.data;

        // Handle email-specific errors
        if (errorData.email) {
          // Format email error messages into a readable string
          const emailErrors = Array.isArray(errorData.email)
            ? errorData.email.join(", ")
            : errorData.email;

          console.log(`Email validation error: ${emailErrors}`);

          // Check for common error messages
          if (
            emailErrors.includes("already exists") ||
            emailErrors.includes("already registered") ||
            emailErrors.includes("already taken")
          ) {
            return thunkAPI.rejectWithValue({
              message: `This email is already registered. Please try logging in or use a different email.`,
              fieldErrors: errorData,
            });
          }

          return thunkAPI.rejectWithValue({
            message: `Email error: ${emailErrors}`,
            fieldErrors: errorData,
          });
        }

        // For other field errors, create a formatted message
        if (
          typeof errorData === "object" &&
          Object.keys(errorData).length > 0
        ) {
          const formattedErrors = Object.entries(errorData)
            .map(([field, errors]) => {
              const errorMsg = Array.isArray(errors)
                ? errors.join(", ")
                : errors;
              return `${field}: ${errorMsg}`;
            })
            .join("; ");

          return thunkAPI.rejectWithValue({
            message: formattedErrors,
            fieldErrors: errorData,
          });
        }

        // For general error messages
        if (errorData.detail || errorData.message) {
          return thunkAPI.rejectWithValue({
            message: errorData.detail || errorData.message,
            fieldErrors: errorData,
          });
        }
      }

      // Default fallback error
      return thunkAPI.rejectWithValue({
        message: error.message || "Registration failed. Please try again.",
        fieldErrors: {},
      });
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      // Use axios directly to bypass all interceptors/configurations from our api instance
      const response = await axios.post(
        "http://localhost:8000/api/users/login/",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // Save tokens
      const { refresh, access } = response.data;

      // Store tokens in localStorage
      localStorage.setItem(
        "authTokens",
        JSON.stringify({
          access,
          refresh,
        })
      );

      // Store basic user data in localStorage for profile completion
      if (response.data.user) {
        const userData = {
          id: response.data.user.id,
          email: response.data.user.email,
          role: response.data.user.role,
        };
        console.log("Storing user data after login:", userData);
        localStorage.setItem("newUserData", JSON.stringify(userData));
      }

      return response.data;
    } catch (error) {
      // Only log error status, not details
      console.error("Login error status:", error.response?.status);

      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        "Login failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      // Get the refresh token from the state
      const state = thunkAPI.getState();
      const refreshToken = state.auth.refreshToken;

      if (refreshToken) {
        await api.post("/api/users/logout/", { refresh: refreshToken });
      }

      // Clear all relevant localStorage items
      localStorage.removeItem("authTokens");
      localStorage.removeItem("newUserData");

      // Force clear any cached data
      sessionStorage.clear();

      return null;
    } catch (error) {
      console.error("Logout error:", error);
      // Even if the server request fails, we still want to clear the local state
      localStorage.removeItem("authTokens");
      localStorage.removeItem("newUserData");
      sessionStorage.clear();
      return null;
    }
  }
);

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;

      if (!token) return thunkAPI.rejectWithValue("No token found");

      await api.post("/api/token/verify/", { token });
      return null; // Token is valid
    } catch {
      // We don't use the error, just return a rejected value
      return thunkAPI.rejectWithValue("Invalid token");
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const refreshToken = state.auth.refreshToken;

      if (!refreshToken)
        return thunkAPI.rejectWithValue("No refresh token found");

      const response = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      return response.data.access;
    } catch {
      // We don't use the error, just return a rejected value
      return thunkAPI.rejectWithValue("Failed to refresh token");
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/api/users/me/");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Load tokens from localStorage if available
const loadAuthState = () => {
  try {
    const serializedTokens = localStorage.getItem("authTokens");
    if (serializedTokens === null) {
      return undefined;
    }
    return JSON.parse(serializedTokens);
  } catch {
    // We don't use the error, just return undefined
    return undefined;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: loadAuthState()?.access || null,
    refreshToken: loadAuthState()?.refresh || null,
    loading: false,
    error: null,
    fieldErrors: {},
    isAuthenticated: !!loadAuthState()?.access,
    registrationSuccess: null,
    registrationData: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.fieldErrors = {};
    },
    clearRegistrationSuccess: (state) => {
      state.registrationSuccess = null;
      state.registrationData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registrationSuccess = null;
        state.registrationData = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // Set registration success state so we can redirect the user
        state.registrationSuccess =
          action.payload?.message || "Registration successful!";
        state.registrationData = action.payload;
        console.log("Registration successful:", state.registrationSuccess);
        console.log("Registration data stored:", state.registrationData);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;

        // Store both the formatted message and the detailed field errors
        if (action.payload && typeof action.payload === "object") {
          state.error = action.payload.message || "Registration failed";
          state.fieldErrors = action.payload.fieldErrors || {};
        } else {
          state.error = action.payload || "Registration failed";
          state.fieldErrors = {};
        }

        state.registrationSuccess = null;
        state.registrationData = null;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        // Clear all authentication and user data
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.registrationSuccess = null;
        state.registrationData = null;
        state.error = null;
        state.fieldErrors = {};
        // Remove tokens from localStorage
        localStorage.removeItem("authTokens");
        localStorage.removeItem("newUserData");
      })

      // Handle rejected logout the same way for safety
      .addCase(logoutUser.rejected, (state) => {
        // Clear all authentication and user data even on failure
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.registrationSuccess = null;
        state.registrationData = null;
        state.error = null;
        state.fieldErrors = {};
        // Remove tokens from localStorage
        localStorage.removeItem("authTokens");
        localStorage.removeItem("newUserData");
      })

      // Token verification
      .addCase(verifyToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        localStorage.removeItem("authTokens");
      })

      // Token refresh
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload;
        const tokens = {
          access: action.payload,
          refresh: state.refreshToken,
        };
        localStorage.setItem("authTokens", JSON.stringify(tokens));
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        localStorage.removeItem("authTokens");
      })

      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        // Set user state directly from the comprehensive payload from /api/users/me/
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearError, clearRegistrationSuccess } = authSlice.actions;
export default authSlice.reducer;
