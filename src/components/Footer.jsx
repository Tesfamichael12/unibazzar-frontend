import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaTelegram } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="relative bg-[#0a1535] dark:bg-[#0a1535]/80 backdrop-blur-xl overflow-hidden shadow-2xl z-20 mt-10">
      {/* Glassmorphic & Glowing Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-blue-400/20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-[#152B67]/20 blur-3xl animate-pulse-slower"></div>
        <div className="absolute -bottom-10 right-1/4 w-64 h-64 rounded-full bg-blue-300/20 blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
          {/* UniBazzar Info */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-white font-poppins">
              UniBazzar
            </h2>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed font-inter">
              Connecting students across campuses with trusted local commerce —
              from books to tutoring and more.
            </p>
            <div className="flex space-x-4 mt-4">
              <SocialIcon
                href="https://facebook.com"
                icon={<FaFacebook size={18} />}
              />
              <SocialIcon
                href="https://twitter.com"
                icon={<FaTwitter size={18} />}
              />
              <SocialIcon
                href="https://instagram.com"
                icon={<FaInstagram size={18} />}
              />
              <SocialIcon
                href="https://telegram.org"
                icon={<FaTelegram size={18} />}
              />
            </div>
            <p className="text-xs text-blue-200 mt-4 font-inter">
              🌐 Ethiopian Universities ·
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-5 font-poppins">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <FooterLink to="/account" label="Profile" />
              <FooterLink to="/listings" label="Tutoring Services" />
              <FooterLink to="/about" label="About Us" />
              <FooterLink to="/contact" label="Contact" />
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold text-lg mb-5 font-poppins">
              Resources
            </h4>
            <ul className="space-y-3">
              <FooterLink to="/faq" label="FAQ" />
              <FooterLink to="/privacy" label="Privacy Policy" />
              <FooterLink to="/terms" label="Terms of Service" />
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-5 font-poppins">
              Contact Us
            </h4>
            <ul className="space-y-3 text-gray-300 text-sm font-inter">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">📍</span>
                <span>Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-400">📞</span>
                <span>+251 900 000 000</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-400">✉️</span>
                <span>support@unibazzar.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-white/10 text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {currentYear} UniBazzar. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Link
              to="/privacy"
              className="hover:text-blue-300 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-blue-300 transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link
              to="/faq"
              className="hover:text-blue-300 transition-colors duration-200"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, label }) {
  return (
    <li>
      <Link
        to={to}
        className="text-gray-300 text-sm hover:text-blue-300 transition-colors duration-200 flex items-center gap-1 group font-inter"
      >
        <span className="transform group-hover:translate-x-1 transition-transform duration-200">
          {label}
        </span>
      </Link>
    </li>
  );
}

function SocialIcon({ href, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full bg-gray-800/70 flex items-center justify-center text-gray-300 hover:bg-blue-500 hover:text-white transition-colors duration-200 transform hover:scale-105 shadow-lg"
    >
      {icon}
    </a>
  );
}

export default Footer;
