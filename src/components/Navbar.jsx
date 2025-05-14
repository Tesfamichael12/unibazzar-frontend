import { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import { IoMoon, IoSunny } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    // Hide user menu on outside click
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

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

  const handleLogout = () => {
    dispatch(logoutUser())
      .then(() => {
        localStorage.removeItem("authTokens");
        localStorage.removeItem("newUserData");
        sessionStorage.clear();

        console.log("Logout successful, redirecting to login page");
        navigate("/login", { replace: true });
      })
      .catch((error) => {
        console.error("Error during logout:", error);
        localStorage.removeItem("authTokens");
        localStorage.removeItem("newUserData");
        sessionStorage.clear();
        navigate("/login", { replace: true });
      });
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Marketplace", path: "/listings" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Post", path: "/create" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-xl ${
        isScrolled
          ? "bg-white/70 dark:bg-[#0a1535]/80 shadow-2xl " // Reduced padding
          : "bg-white/30 dark:bg-[#0a1535]/40 " // Reduced padding
      }`}
    >
      {/* Glassmorphic & Glow Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute -top-10 left-1/3 w-72 h-72 rounded-full bg-[#152B67]/20 blur-3xl animate-pulse-slower"></div>
        <div className="absolute top-10 right-1/4 w-56 h-56 rounded-full bg-blue-300/10 blur-3xl animate-pulse-slow"></div>
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo with animation */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.img
              src="/assets/unibazzar_log.webp"
              alt="UniBazzar Logo"
              className="w-10 drop-shadow-lg rounded-full p-1 border border-blue-200 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300"
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 10 }}
            />
            <span className="hidden sm:inline-block text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#152B67] to-blue-400 bg-clip-text text-transparent animate-gradient-move">
              UniBazzar
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="relative text-gray-800 dark:text-gray-200 font-medium px-2 py-1 transition group hover:text-blue-500"
              >
                {link.name}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
              </Link>
            ))}
            <button
              onClick={() => {
                setIsToggling(true);
                toggleTheme();
                setTimeout(() => setIsToggling(false), 1500);
              }}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200 text-lg text-gray-800 dark:text-gray-300 focus:outline-none cursor-pointer group"
              aria-label="Toggle Theme"
            >
              <motion.span
                key={isDarkMode ? "sun" : "moon"}
                initial={{ rotate: 0, scale: 0.7, opacity: 0 }}
                animate={{ rotate: 360, scale: 1.1, opacity: 1 }}
                exit={{ rotate: -180, scale: 0.7, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className="inline-block"
                style={{ willChange: "transform, opacity" }}
              >
                {isDarkMode ? (
                  <IoSunny className="drop-shadow-[0_0_8px_rgba(15,107,174,0.7)] text-xl" />
                ) : (
                  <IoMoon className="drop-shadow-[0_0_8px_rgba(15,107,174,0.7)] text-xl" />
                )}
              </motion.span>
            </button>
            {user ? (
              <>
                <Link
                  to="/cart"
                  className="relative text-gray-800 dark:text-gray-300 hover:text-blue-500"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
                {/* User Icon Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu((v) => !v)}
                    className="ml-2 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-400/60 to-[#152B67]/70 p-1.5 shadow-lg hover:scale-105 transition-transform border-2 border-white/30 focus:outline-none cursor-pointer"
                  >
                    <FaUserCircle className="text-white text-3xl drop-shadow-lg" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white dark:bg-[#0a1535] shadow-2xl ring-1 ring-blue-100/30 dark:ring-blue-900/40 py-2 z-50 animate-fade-in">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate("/account");
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors font-medium cursor-pointer"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-500 transition font-medium cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <IoSunny
                  className={`text-blue-400 ${
                    isToggling ? "animate-toggle-rotate" : ""
                  }`}
                />
              ) : (
                <IoMoon
                  className={`text-blue-400 ${
                    isToggling ? "animate-toggle-rotate" : ""
                  }`}
                />
              )}
            </button>
            <button
              type="button"
              className="text-gray-800 dark:text-gray-200 cursor-pointer"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Drawer */}
      <Transition show={mobileMenuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setMobileMenuOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
          </Transition.Child>
          <Dialog.Panel className="fixed inset-y-0 left-0 w-72 bg-white/90 dark:bg-[#0a1535]/95 backdrop-blur-xl shadow-2xl p-4 z-50">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <span className="flex items-center gap-2">
                <motion.img
                  src="/assets/unibazzar_log.webp"
                  alt="UniBazzar Logo"
                  className="h-9 w-9 drop-shadow-lg rounded-full bg-white/30 p-1 border border-blue-200 dark:bg-white/20"
                  initial={{ scale: 0.7, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 10 }}
                />
                <span className="text-lg font-bold bg-gradient-to-r from-[#152B67] to-blue-400 bg-clip-text text-transparent animate-gradient-move">
                  UniBazzar
                </span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-800 dark:text-gray-300 cursor-pointer"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col space-y-4 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="hover:text-blue-500 transition font-medium text-gray-800 dark:text-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    to="/cart"
                    className="hover:text-blue-500 transition text-gray-800 dark:text-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cart ({cartCount})
                  </Link>
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    Profile
                  </Link>
                  <span className="text-gray-800 dark:text-gray-100 font-semibold">
                    {user.name}
                  </span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition shadow-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hover:text-blue-500 transition font-medium text-gray-800 dark:text-gray-100 cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </Dialog.Panel>
        </Dialog>
      </Transition>
    </nav>
  );
}
