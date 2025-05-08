import axios from "axios";

// Function to get store later - avoids circular dependency
let storeInstance = null;
export const injectStore = (store) => {
  storeInstance = store;
};

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Include credentials in cross-origin requests
});

// Add interceptor to attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    if (storeInstance) {
      const state = storeInstance.getState();
      const token = state.auth.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn(`No auth token available for request to ${config.url}`);
      }
    }

    // Special handling for FormData
    if (config.data instanceof FormData) {
      // Remove Content-Type so browser can set it with correct boundary
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add interceptor to handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Log all API errors for debugging
    console.error(
      `API Error (${originalRequest?.url}):`,
      error.response?.status,
      error.response?.data || error.message
    );

    // If the error is 401 and we haven't already tried to refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/api/users/login/" &&
      originalRequest.url !== "/api/token/refresh/"
    ) {
      originalRequest._retry = true;

      try {
        if (!storeInstance) {
          throw new Error("Store not available");
        }

        const state = storeInstance.getState();
        const refreshToken = state.auth.refreshToken;

        if (!refreshToken) {
          console.error("No refresh token available");
          throw new Error("No refresh token available");
        }

        // Attempt to refresh the token
        const response = await axios.post(
          "http://localhost:8000/api/token/refresh/",
          {
            refresh: refreshToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            withCredentials: true,
          }
        );

        // Check if the response contains the access token
        if (!response.data || !response.data.access) {
          console.error("Invalid token refresh response:", response.data);
          throw new Error("Invalid token refresh response");
        }

        const { access } = response.data;

        // Update the token in the store
        storeInstance.dispatch({
          type: "auth/refreshToken/fulfilled",
          payload: access,
        });

        // Update localStorage tokens
        const authTokens = JSON.parse(
          localStorage.getItem("authTokens") || "{}"
        );
        authTokens.access = access;
        localStorage.setItem("authTokens", JSON.stringify(authTokens));

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // If refresh fails, logout the user
        if (storeInstance) {
          storeInstance.dispatch({ type: "auth/logoutUser/fulfilled" });

          // Clear any cached auth data
          localStorage.removeItem("authTokens");
          localStorage.removeItem("newUserData");
        }

        // Redirect to login page for authentication errors
        // Use a small timeout to allow the logout to complete
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
