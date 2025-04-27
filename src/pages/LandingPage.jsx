import { FaGithub, FaLinkedin, FaGlobe, FaUser } from "react-icons/fa";
import { useThemeContext } from "./contexts/ThemeContext";

const features = [
  "Secure Password Generator",
  "Password Strength Tester",
  "Encryption & Decryption Tools (AES, RSA, Base64)",
  "Hash Generator & Rainbow Table Utilities",
  "Password Leak Checker",
  "Password Cracking Simulators (Brute Force, Dictionary)",
  "Steganography Encode/Decode",
  "Theme Toggle (Dark/Light Mode)",
  "Modern, Responsive UI",
];

export default function LandingPage() {
  const { theme } = useThemeContext();

  const themeClasses = theme === "dark"
    ? {
        background: "bg-gradient-to-br from-[#230042] via-[#120026] to-[#1a002a]",
        heading: "text-[#E5D7FF]",
        subheading: "text-teal-400",
        text: "text-purple-100",
        section: "bg-transparent",
        card: "bg-gradient-to-br from-[#2d014f] via-[#1a002a] to-[#2a0049]",
        link: "text-teal-400 hover:text-teal-200",
        icon: "text-purple-300",
        border: "border-purple-900",
        btn: "bg-[#161b22] text-white hover:bg-[#24292f]",
        btnLinkedin: "bg-blue-600 text-white hover:bg-blue-700",
        btnPortfolio: "bg-gradient-to-r from-teal-500 to-purple-700 text-white hover:from-teal-600 hover:to-purple-800",
        shadow: "shadow-2xl",
      }
    : {
        background: "bg-gradient-to-br from-blue-100 to-white",
        heading: "text-teal-700",
        subheading: "text-teal-600",
        text: "text-gray-700",
        section: "bg-transparent",
        card: "bg-white",
        link: "text-teal-700 hover:text-teal-900",
        icon: "text-teal-400",
        border: "border-teal-200",
        btn: "bg-gray-900 text-white hover:bg-gray-800",
        btnLinkedin: "bg-blue-600 text-white hover:bg-blue-700",
        btnPortfolio: "bg-gradient-to-r from-teal-400 to-blue-400 text-white hover:from-teal-500 hover:to-blue-500",
        shadow: "shadow-lg",
      };

  return (
    <div className={`w-full min-h-screen ${themeClasses.background} flex flex-col`}>
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-center gap-12 px-6 py-16 max-w-7xl mx-auto w-full">
        <div className="flex-1 flex flex-col items-start justify-center">
          <h1 className={`text-5xl md:text-6xl font-black mb-6 ${themeClasses.heading} drop-shadow-lg`}>
            Password Toolkit
          </h1>
          <p className={`text-lg md:text-xl mb-8 ${themeClasses.text} max-w-2xl`}>
            Your all-in-one modern toolkit for password security, generation, analysis, and cryptography.<br />
            Empower yourself and your users to manage credentials confidently and securely.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/mb0227"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold ${themeClasses.btn} ${themeClasses.shadow} transition`}
            >
              <FaGithub className="text-xl" /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/bilal-yaseen-234937264/"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold ${themeClasses.btnLinkedin} ${themeClasses.shadow} transition`}
            >
              <FaLinkedin className="text-xl" /> LinkedIn
            </a>
            <a
              href="https://mb0227.github.io/Portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold ${themeClasses.btnPortfolio} ${themeClasses.shadow} transition`}
            >
              <FaGlobe className="text-xl" /> Portfolio
            </a>
          </div>
        </div>
        <div className="flex-1 mt-12 lg:mt-0 px-2 flex flex-col items-center w-full">
          <div className={`rounded-3xl border-2 ${themeClasses.border} ${themeClasses.shadow} w-full lg:w-[500px] p-8`}>
            <h2 className={`text-2xl font-bold mb-2 ${themeClasses.subheading}`}>Features</h2>
            <ul className={`list-disc pl-6 ${themeClasses.text} space-y-1`}>
              {features.map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className={`w-full flex flex-col items-center py-12 px-2 border-t ${themeClasses.border}`}>
        <div className="max-w-3xl w-full flex flex-col items-center">
          <h2 className={`text-2xl font-bold mb-3 ${themeClasses.subheading}`}>About the Developer</h2>
          <div className="flex items-center mb-2">
            <FaUser className={`text-2xl mr-2 ${themeClasses.icon}`} />
            <span className={`font-semibold text-lg ${themeClasses.heading}`}>Bilal Yaseen</span>
          </div>
          <p className={`mb-2 text-center ${themeClasses.text} max-w-2xl`}>
            Passionate full stack developer, focused on security, cryptography, and user-centric tools.
            Building robust software solutions that empower everyone to stay safe online.
          </p>
        </div>
      </section>

      {/* Call to Action / Get Started */}
      <section className="flex flex-col items-center py-8 pb-16">
        <div className={`text-center max-w-xl`}>
          <p className={`mb-2 text-md md:text-lg ${themeClasses.text}`}>
            <b>Get Started:</b> Use the navigation above to explore password generation, testing, encryption tools, and more!
          </p>
        </div>
      </section>
    </div>
  );
}