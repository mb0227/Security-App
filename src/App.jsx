import { useState, useRef } from "react";
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider, useThemeContext } from "./pages/contexts/ThemeContext";
import Generator from "./pages/Generator";
import StrengthTester from "./pages/StrengthTester";
import Encryption from "./pages/Encryption";
import AES from "./pages/encryption/AES";
import RSA from "./pages/encryption/RSA";
import Base64 from "./pages/encryption/Base64";
import Cracker from "./pages/Cracker";
import BruteForce from "./pages/cracking/BruteForce";
import Dictionary from "./pages/cracking/Dictionary";
import Steganography from "./pages/Steganography";
import Encode from "./pages/steganography/Encode";
import Decode from "./pages/steganography/Decode";
import PasswordLeakChecker from "./pages/PasswordLeak";
import HashGenerator from "./pages/HashGenerator";
import RainbowTable from "./pages/RainbowTable";
import CipherGenerator from "./pages/CipherGenerator";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  );
}

function AppContent() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownTimeout = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useThemeContext();
  const location = useLocation();

  const themeClasses = theme === "dark"
    ? {
        navbar: "bg-gradient-to-br from-[#230042] via-[#120026] to-[#1a002a] border-b-4 border-purple-900",
        text: "text-white",
        dropdown: "bg-gradient-to-br from-[#2d014f] via-[#1a002a] to-[#2a0049] border border-purple-900",
        navLink: "text-white hover:bg-purple-900/60",
        navLinkActive: "bg-purple-900/80 text-purple-200",
        navFont: "font-semibold",
        navTitle: "text-2xl font-extrabold tracking-widest text-[#E5D7FF] cursor-pointer",
        navShadow: "shadow-2xl",
        navDropdownButton: "bg-gray-700 text-white",
        mobileBg: "bg-[#1a002a]",
      }
    : {
        navbar: "bg-gradient-to-br from-blue-100 to-white border-b-4 border-teal-400",
        text: "text-black",
        dropdown: "bg-gradient-to-br from-blue-200 to-white border border-teal-300",
        navLink: "text-black hover:bg-teal-200",
        navLinkActive: "bg-teal-300 text-teal-700",
        navFont: "font-semibold",
        navTitle: "text-2xl font-extrabold tracking-widest text-teal-700 cursor-pointer",
        navShadow: "shadow-2xl",
        navDropdownButton: "bg-gray-200 text-black",
        mobileBg: "bg-white",
      };

  const dropdownMenus = {
    Encryption: [
      { to: "/encryption/aes", label: "AES" },
      { to: "/encryption/rsa", label: "RSA" },
      { to: "/encryption/base64", label: "Base64" },
    ],
    Cracker: [
      { to: "/cracker/brute-force", label: "Brute Force" },
      { to: "/cracker/dictionary", label: "Dictionary" },
    ],
    Steganography: [
      { to: "/steganography/hide", label: "Hide (Encode)" },
      { to: "/steganography/reveal", label: "Reveal (Decode)" },
    ],
  };

  const staticNavLinks = [
    { to: "/generator", label: "Generator" },
    { to: "/strength-tester", label: "Strength Tester" },
    { to: "/password-leak-checker", label: "Password Leak Checker" },
    { to: "/hash-generator", label: "Hash Generator" },
    { to: "/rainbow-table", label: "Rainbow Table" },
    { to: "/cipher-generator", label: "Cipher Generator" },
  ];
  const dropdownNavLinks = [
    { to: "/encryption", label: "Encryption", dropdown: "Encryption" },
    { to: "/cracker", label: "Cracker", dropdown: "Cracker" },
    { to: "/steganography", label: "Steganography", dropdown: "Steganography" },
  ];

  // Dropdown hover handlers
  const handleDropdownEnter = (dropdown) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(dropdown);
  };
  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 230);
  };
  const handleDropdownMenuEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
  };
  const handleDropdownMenuLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 230);
  };
  const handleMobileNavClick = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  const navigate = useNavigate();

  // Determines if a nav link is active (static or dropdown)
  const isLinkActive = (to) => location.pathname === to;
  const isDropdownActive = (to) => location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav
        className={`${themeClasses.navbar} ${themeClasses.navShadow} px-2 py-2 sm:px-4 sm:py-2`}
        style={{
          fontFamily: "'Montserrat', 'Poppins', 'Segoe UI', 'Arial', sans-serif",
          zIndex: 30,
        }}
      >
        <div className="container mx-auto flex justify-between items-center relative">
          {/* Make the title a clickable Link */}
          <span
            className={`${themeClasses.navTitle}`}
            onClick={() => navigate("/")}
            tabIndex={0}
            style={{
              letterSpacing: "0.13em",
              textShadow: theme === "dark" ? "0 2px 16px #a855f7, 0 1px 0 #000" : "",
              fontSize: "1.8rem",
              cursor: "pointer",
            }}
            role="button"
            aria-label="Go to home"
            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") navigate("/"); }}
          >
            Password Toolkit
          </span>
          <button
            className="sm:hidden flex items-center p-2 ml-2 rounded focus:outline-none focus:ring-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke={theme === "dark" ? "#a21caf" : "#0ea5e9"}
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 8h16M4 16h16"
                />
              )}
            </svg>
          </button>
          {/* Desktop Nav */}
          <div className="hidden ml-4 sm:flex space-x-2 sm:space-x-5 relative items-center">
            {staticNavLinks.map((link) => (
              <Link
                to={link.to}
                key={link.label}
                className={`text-base px-3 py-2 rounded-lg transition duration-200 ${themeClasses.navFont} ${
                  isLinkActive(link.to)
                    ? themeClasses.navLinkActive
                    : themeClasses.navLink
                }`}
                style={{
                  fontWeight: isLinkActive(link.to) ? 700 : 500,
                  background: isLinkActive(link.to)
                    ? (theme === "dark" ? "rgba(168,85,247,0.12)" : "rgba(20,184,166,0.13)")
                    : undefined,
                  transition: "all 0.18s"
                }}
              >
                {link.label}
              </Link>
            ))}
            {dropdownNavLinks.map((link) => (
              <div
                className="relative group"
                key={link.label}
                onMouseEnter={() => handleDropdownEnter(link.dropdown)}
                onMouseLeave={handleDropdownLeave}
              >
                <Link
                  to={link.to}
                  className={`text-base px-3 py-2 rounded-lg transition duration-200 flex items-center ${themeClasses.navFont} ${
                    isDropdownActive(link.to)
                      ? themeClasses.navLinkActive
                      : themeClasses.navLink
                  }`}
                  style={{
                    fontWeight: isDropdownActive(link.to) ? 700 : 500,
                    background: isDropdownActive(link.to)
                      ? (theme === "dark" ? "rgba(168,85,247,0.10)" : "rgba(20,184,166,0.10)")
                      : undefined,
                    transition: "all 0.18s"
                  }}
                >
                  {link.label}
                  <svg
                    className="ml-1 w-4 h-4 text-purple-200 group-hover:text-purple-100 transition"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                {openDropdown === link.dropdown && (
                  <div
                    className={`absolute left-0 mt-2 z-40 ${themeClasses.dropdown} rounded-xl shadow-2xl py-2 min-w-[170px] animate-fadeIn`}
                    onMouseEnter={handleDropdownMenuEnter}
                    onMouseLeave={handleDropdownMenuLeave}
                  >
                    {dropdownMenus[link.dropdown].map((sub) => (
                      <Link
                        to={sub.to}
                        key={sub.label}
                        className={`block px-4 py-2 text-sm hover:bg-opacity-70 transition rounded-lg text-left ${themeClasses.navFont} ${
                          isLinkActive(sub.to)
                            ? themeClasses.navLinkActive
                            : themeClasses.navLink
                        }`}
                        style={{
                          fontWeight: isLinkActive(sub.to) ? 700 : 500,
                          background: isLinkActive(sub.to)
                            ? (theme === "dark" ? "rgba(168,85,247,0.13)" : "rgba(20,184,166,0.15)")
                            : undefined,
                          transition: "all 0.18s"
                        }}
                        onClick={() => setOpenDropdown(null)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* Theme toggle at top right */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`ml-3 p-2 rounded-full ${themeClasses.navDropdownButton}`}
              style={{ fontSize: "1.15em" }}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
          </div>
          {/* Mobile Nav */}
          {mobileOpen && (
            <div
              className={`sm:hidden absolute top-full right-0 w-60 mt-2 shadow-2xl rounded-xl ${themeClasses.mobileBg} border z-50 border-purple-900 animate-fadeIn`}
            >
              <div className="flex flex-col py-4">
                {staticNavLinks.map((link) => (
                  <Link
                    to={link.to}
                    key={link.label}
                    className={`px-6 py-3 text-base rounded-lg transition duration-150 ${themeClasses.navFont} ${
                      isLinkActive(link.to)
                        ? themeClasses.navLinkActive
                        : themeClasses.navLink
                    }`}
                    style={{
                      fontWeight: isLinkActive(link.to) ? 700 : 500,
                      background: isLinkActive(link.to)
                        ? (theme === "dark" ? "rgba(168,85,247,0.12)" : "rgba(20,184,166,0.13)")
                        : undefined,
                    }}
                    onClick={handleMobileNavClick}
                  >
                    {link.label}
                  </Link>
                ))}
                {dropdownNavLinks.map((link) => (
                  <MobileDropdown
                    key={link.label}
                    link={link}
                    menu={dropdownMenus[link.dropdown]}
                    themeClasses={themeClasses}
                    onNavigate={handleMobileNavClick}
                    location={location}
                    theme={theme}
                  />
                ))}
                {/* Theme toggle */}
                <button
                  onClick={() => {
                    setTheme(theme === "dark" ? "light" : "dark");
                    setMobileOpen(false);
                  }}
                  className={`mt-3 mx-6 p-2 rounded-full ${themeClasses.navDropdownButton} text-lg`}
                  aria-label="Toggle theme"
                  title="Toggle theme"
                >
                  {theme === "dark" ? "🌙" : "☀️"}
                  <span className="ml-2 text-base align-middle">{theme === "dark" ? "Dark" : "Light"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="/strength-tester" element={<StrengthTester />} />
        <Route path="/encryption" element={<Encryption />} />
        <Route path="/encryption/aes" element={<AES />} />
        <Route path="/encryption/rsa" element={<RSA />} />
        <Route path="/encryption/base64" element={<Base64 />} />
        <Route path="/cracker" element={<Cracker />} />
        <Route path="/cracker/dictionary" element={<Dictionary />} />
        <Route path="/cracker/brute-force" element={<BruteForce />} />
        <Route path="/steganography" element={<Steganography />} />
        <Route path="/steganography/hide" element={<Encode />} />
        <Route path="/steganography/reveal" element={<Decode />} />
        <Route path="/password-leak-checker" element={<PasswordLeakChecker />} />
        <Route path="/hash-generator" element={<HashGenerator />} />
        <Route path="/rainbow-table" element={<RainbowTable />} />
        <Route path="/cipher-generator" element={<CipherGenerator />} />
        <Route path="*" element={<div className="text-center text-red-500">404 Not Found</div>} />
      </Routes>
    </div>
  );
}

function MobileDropdown({ link, menu, themeClasses, onNavigate, location, theme }) {
  const [open, setOpen] = useState(false);
  // Helper for active styling
  const isLinkActive = (to) => location.pathname === to;
  return (
    <div>
      <button
        className={`w-full px-6 py-3 text-base rounded-lg flex justify-between items-center ${themeClasses.navLink} ${themeClasses.navFont} transition`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{link.label}</span>
        <svg
          className={`ml-2 w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open &&
        menu.map((sub) => (
          <Link
            to={sub.to}
            key={sub.label}
            className={`block pl-10 pr-6 py-2 text-sm rounded-lg transition ${themeClasses.navFont} ${
              isLinkActive(sub.to)
                ? themeClasses.navLinkActive
                : themeClasses.navLink
            }`}
            style={{
              fontWeight: isLinkActive(sub.to) ? 700 : 500,
              background: isLinkActive(sub.to)
                ? (theme === "dark" ? "rgba(168,85,247,0.13)" : "rgba(20,184,166,0.15)")
                : undefined,
              transition: "all 0.18s"
            }}
            onClick={onNavigate}
          >
            {sub.label}
          </Link>
        ))}
    </div>
  );
}

export default App;