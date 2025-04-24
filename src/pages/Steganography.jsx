import { Link } from "react-router-dom";
import useUser from "./hooks/useUser";
import { useThemeContext } from "./contexts/ThemeContext";

export default function Steganography({ setAuth }) {
  const { user, loading, error } = useUser(setAuth);
  const {theme} = useThemeContext();

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