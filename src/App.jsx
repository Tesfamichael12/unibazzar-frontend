import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CreateListingPage from "./pages/CreateListingPage";
import ListingDetailPage from "./pages/ListingDetails";
import MarketplacePage from "./pages/MarketplacePage";
import Account from "./pages/Accout";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import CartPage from "./pages/CartPage";
import Dashboard from "./pages/Dashboard";
import SimilarItemsPage from "./pages/SimilarItemsPage";
import TutorDashboard from "./pages/TutorDashboard";
import CampusAdminDashboard from "./pages/CampusAdminDashboard";
import Chat from "./components/Chat/Chat";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { IoMoon, IoSunny } from "react-icons/io5"; // Import icons
import ProfilePage from "./pages/ProfilePage";
import PasswordResetPage from "./pages/PasswordResetPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, verifyToken } from "./redux/slices/authSlice";
import ThemeToggle from "./components/ui/ThemeToggle";
import ThankYou from "./pages/ThankYou";
import ProductDetail from "./pages/ProductDetail";

// Import profile form components
import StudentProfileForm from "./pages/profile/forms/StudentProfileForm";
import MerchantProfileForm from "./pages/profile/forms/MerchantProfileForm";
import TutorProfileForm from "./pages/profile/forms/TutorProfileForm";
import SignupCompletionHandler from "./components/SignupCompletionHandler";

// Routes where Navbar and Footer should be hidden
const noNavbarRoutes = [
  // "/login", // No longer hiding Navbar for login
  // "/signup", // No longer hiding Navbar for signup
  // "/forgot-password",
  // "/reset-password",
  // "/profile/student/create",
  // "/profile/student/edit",
  // "/profile/merchant/create",
  // "/profile/merchant/edit",
  // "/profile/tutor/create",
  // "/profile/tutor/edit",
  // "/signup/complete",
];

// AppContent component to access route location
function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Check if the current path or its parent path is in the noNavbarRoutes list
  // const shouldShowNavbar = !noNavbarRoutes.some(
  //   (route) =>
  //     location.pathname === route || location.pathname.startsWith(route + "/")
  // );
  const shouldShowNavbar = true; // Always show Navbar

  // Fetch user profile and verify token on app initialization
  useEffect(() => {
    if (isAuthenticated) {
      // Verify token and fetch user profile
      dispatch(verifyToken());
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, dispatch]);

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      {/* Theme Toggle Button for pages without Navbar */}
      {/* {!shouldShowNavbar && (
        <div className="text-right p-4">
          <ThemeToggle />
        </div>
      )} */}
      {shouldShowNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* Publicly accessible product routes */}
          <Route path="/listings" element={<MarketplacePage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
          <Route path="/similar/:id" element={<SimilarItemsPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/thank-you" element={<ThankYou />} />

          {/* Password Reset Routes */}
          <Route path="/forgot-password" element={<PasswordResetPage />} />
          <Route path="/reset-password" element={<PasswordResetPage />} />
          <Route
            path="/reset-password/:uidb64/:token"
            element={<PasswordResetPage />}
          />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <CreateListingPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <Account />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <CartPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/tutordashboard"
            element={
              <PrivateRoute>
                <TutorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/campusadmindashboard"
            element={
              <PrivateRoute>
                <CampusAdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/merchant-dashboard"
            element={
              <PrivateRoute requiredRoles={["merchant"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/tutor-dashboard"
            element={
              <PrivateRoute requiredRoles={["tutor"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute requiredRoles={["campus_admin"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Add signup completion routes */}
          <Route
            path="/signup/complete"
            element={<SignupCompletionHandler />}
          />
          <Route
            path="/profile/student/create"
            element={
              <PrivateRoute>
                <StudentProfileForm mode="create" />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/merchant/create"
            element={
              <PrivateRoute>
                <MerchantProfileForm mode="create" />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/tutor/create"
            element={
              <PrivateRoute>
                <TutorProfileForm mode="create" />
              </PrivateRoute>
            }
          />

          {/* Edit profile routes */}
          <Route
            path="/profile/student/edit"
            element={
              <PrivateRoute requiredRoles={["student"]}>
                <StudentProfileForm mode="edit" />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/merchant/edit"
            element={
              <PrivateRoute requiredRoles={["merchant"]}>
                <MerchantProfileForm mode="edit" />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/tutor/edit"
            element={
              <PrivateRoute requiredRoles={["tutor"]}>
                <TutorProfileForm mode="edit" />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      {shouldShowNavbar && <Footer />}
    </div>
  );
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

export default App;
