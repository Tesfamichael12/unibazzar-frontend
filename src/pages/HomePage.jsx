import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion
import {
  Upload,
  ShoppingCart,
  Users,
  Search,
  ShieldCheck,
  Quote,
} from "lucide-react";
import JoinCommunity from "../components/JoinCommunity";
import CatagorySection from "../components/CategorySection";
import FeaturedProduct from "../components/FeaturedProduct";
import TestimonialSection from "../components/TestimonialSection";

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white pt-10">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url('./assets/hero_background.webp')",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-white text-center px-4 max-w-2xl p-8 rounded-lg drop-shadow-lg">
          <h1 className="text-5xl md:text-8xl font-extrabold mb-6">
            <span className="text-white">Welcome to </span>
            <span
              className="bg-gradient-to-r from-[#172F6C] via-[#248BD6] via-40% via-[#5BE6FF] via-70% to-[#248BD6] bg-clip-text text-transparent animate-gradient-move font-extrabold"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #172F6C 0%, #248BD6 40%, #5BE6FF 70%, #248BD6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              UniBazzar
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Your one-stop campus marketplace for Textbooks, Notes, Services,
            Products and more.
          </p>
          <motion.custom // Wrap Link with motion.custom
            component={Link} // Specify the component to render
            to="/listings"
            className="relative inline-flex items-center justify-center px-10 py-3 rounded-full text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300/40 group overflow-hidden"
            whileHover={{ scale: 1.1 }} // Add hover animation
            transition={{ type: "spring", stiffness: 400, damping: 10 }} // Add transition
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 blur-lg animate-pulse"></span>
            <span className="relative z-10 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-yellow-300 animate-bounce"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"
                />
              </svg>
              Start Browsing
            </span>
          </motion.custom>
        </div>
      </section>
      <CatagorySection />
      <FeaturedProduct />
      {/* What You Can Do Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-14">
            What You Can Do with UniBazzar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Sell Easily",
                desc: "List your textbooks, notes, and services in seconds.",
                icon: <Upload className="w-16 h-16 text-blue-600 mx-auto" />,
              },
              {
                title: "Buy Affordably",
                desc: "Find verified campus deals that match your budget.",
                icon: (
                  <ShoppingCart className="w-16 h-16 text-blue-600 mx-auto" />
                ),
              },
              {
                title: "Support Locals",
                desc: "Trade within your university and support fellow students.",
                icon: <Users className="w-16 h-16 text-blue-600 mx-auto" />,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {item.icon}
                <h3 className="text-2xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-14">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Post Items",
                desc: "Upload textbooks, notes, or tutoring services to sell easily.",
                icon: <Upload className="w-16 h-16 text-blue-600 mx-auto" />,
              },
              {
                title: "Browse Listings",
                desc: "Find academic materials, tutors, or even part-time jobs.",
                icon: <Search className="w-16 h-16 text-blue-600 mx-auto" />,
              },
              {
                title: "Secure Payments",
                desc: "Pay safely via Telebirr or trusted payment methods.",
                icon: (
                  <ShieldCheck className="w-16 h-16 text-blue-600 mx-auto" />
                ),
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {item.icon}
                <h3 className="text-2xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialSection />

      <JoinCommunity />
    </div>
  );
}

export default HomePage;

/* Add this to your global CSS (e.g., index.css or App.css):
@keyframes glassFade {
  0% {
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 0 0 rgba(59,130,246,0.3);
    transform: scale(1) rotate(-1deg);
  }
  50% {
    box-shadow: 0 12px 48px 0 rgba(59,130,246,0.25), 0 0 40px 10px rgba(59,130,246,0.15);
    transform: scale(1.03) rotate(1deg);
  }
  100% {
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 0 0 rgba(59,130,246,0.3);
    transform: scale(1) rotate(-1deg);
  }
}
*/
