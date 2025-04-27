import { Link } from "react-router-dom";
import { useThemeContext } from "./contexts/ThemeContext";

export default function Steganography() {
  const {theme} = useThemeContext();

  const themeClasses = theme === "dark"
    ? {
      background: "bg-gradient-to-br from-purple-900 to-gray-900",
      text: "text-white",
        button: "bg-indigo-600 hover:bg-indigo-700 text-white",
        button2: "bg-pink-600 hover:bg-pink-700 text-white",
      }
    : {
        background: "bg-gradient-to-br from-blue-100 to-white",
        text: "text-black",
        button: "bg-teal-600 hover:bg-teal-700 text-white",
        button2: "bg-pink-400 hover:bg-pink-500 text-white",
      };

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text} flex items-center justify-center p-10`}>
      <div className="absolute top-28 right-6">
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
        <Link
          to="/steganography/hide"
          className={`px-8 py-6 rounded-2xl shadow-lg text-2xl font-semibold transition ${themeClasses.button}`}
        >
          🖼️ Hide Message
        </Link>
        <Link
          to="/steganography/reveal"
          className={`px-8 py-6 rounded-2xl shadow-lg text-2xl font-semibold transition ${themeClasses.button2}`}
        >
          🔍 Reveal Message
        </Link>
      </div>
    </div>
  );
}