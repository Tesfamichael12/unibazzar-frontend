import { useState, useEffect } from "react";
import { IoMoon, IoSunny } from "react-icons/io5";
import { motion } from "framer-motion";

export default function ThemeToggle({ className = "" }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    <button
      onClick={toggleTheme}
      className={`relative text-2xl text-gray-800 dark:text-gray-300 transition focus:outline-none overflow-visible cursor-pointer ${className}`}
      aria-label="Toggle Theme"
      type="button"
    >
      <motion.span
        key={isDarkMode ? "sun" : "moon"}
        initial={{ rotate: 0, scale: 0.7, opacity: 0 }}
        animate={{ rotate: 360, scale: 1.2, opacity: 1 }}
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
          <IoSunny className="drop-shadow-[0_0_8px_rgba(15,107,174,0.7)]" />
        ) : (
          <IoMoon className="drop-shadow-[0_0_8px_rgba(15,107,174,0.7)]" />
        )}
      </motion.span>
      <span
        className="absolute -inset-2 rounded-full pointer-events-none transition-all duration-300 group-hover:shadow-[0_0_16px_4px_rgba(15,107,174,0.3)]"
        aria-hidden="true"
      ></span>
    </button>
  );
}
