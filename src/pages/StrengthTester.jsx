import { useState } from "react";
import { useThemeContext } from "./contexts/ThemeContext";
import useUser from "./hooks/useUser";

function StrengthTester({setAuth}) {
  const { user, loading, error } = useUser(setAuth);
  const [input, setInput] = useState("");
  const [strength, setStrength] = useState("");
  const { theme } = useThemeContext();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-teal-100">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const getThemeClasses = () => {
    return theme === "dark"
      ? {
          background: "bg-gradient-to-br from-purple-900 to-gray-900",
          card: "bg-gray-800 border-teal-600",
          input: "bg-gray-700 border-gray-600 text-teal-200",
          button: "bg-teal-500 hover:bg-teal-600 text-white",
          text: "text-teal-200",
          accent: "text-teal-400",
        }
      : {
          background: "bg-gradient-to-br from-blue-100 to-white",
          card: "bg-white border-teal-300",
          input: "bg-gray-50 border-gray-300 text-teal-700",
          button: "bg-teal-600 hover:bg-teal-700 text-white",
          text: "text-teal-700",
          accent: "text-teal-600",
        };
  };

  const themeClasses = getThemeClasses();

  const getStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[`!@#$%^&*()_+=\-;|]/.test(password)) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;

    if (score <= 1) return "Weak";
    if (score === 2 || score === 3) return "Medium";
    return "Strong";
  };

  const handleChange = (e) => {
    const value = e.target.value.slice(0, 20);
    setInput(value);
    setStrength(getStrength(value));
  };

  const strengthColor = {
    Weak: "text-red-500",
    Medium: "text-yellow-400",
    Strong: "text-green-400",
  };

  // Remove the theme toggle function and button

  return (
    <div className={`flex items-center justify-center min-h-screen ${themeClasses.background} ${themeClasses.text} p-5`}>
      <div className={`${themeClasses.card} p-8 rounded-2xl shadow-xl w-96 text-center border`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-2xl font-bold ${themeClasses.accent}`}>Strength Tester</h1>
          {/* Theme toggle button removed from here */}
        </div>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Enter password (max 20 chars)"
          className={`w-full p-3 mb-4 rounded-md text-lg text-center border focus:outline-none ${themeClasses.input}`}
        />
        <div className={`text-lg font-medium ${strengthColor[strength]}`}>
          Strength: {strength || "Enter a password"}
        </div>
      </div>
    </div>
  );
}

export default StrengthTester;