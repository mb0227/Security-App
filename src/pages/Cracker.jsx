import { Link } from "react-router-dom";
import useUser from "./hooks/useUser";
import { useThemeContext } from "./contexts/ThemeContext";

export default function Cracker({setAuth}) {
  const {theme} = useThemeContext();
  const { user, loading, error } = useUser(setAuth);

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
        brute: "bg-green-600 hover:bg-green-700 text-white",
        dictionary: "bg-blue-600 hover:bg-blue-700 text-white",
      }
    : {
        background: "bg-gradient-to-br from-blue-100 to-white",
        text: "text-black",
        brute: "bg-green-400 hover:bg-green-500 text-black",
        dictionary: "bg-blue-400 hover:bg-blue-500 text-black",
      };

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text} flex items-center justify-center p-10`}>
      <div className="absolute top-28 right-6">
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
        <Link to="/cracker/brute-force" className={`px-8 py-6 rounded-2xl shadow-lg text-2xl font-semibold transition ${themeClasses.brute}`}>
         🔓 Brute Force
        </Link>
        <Link to="/cracker/dictionary" className={`px-8 py-6 rounded-2xl shadow-lg text-2xl font-semibold transition ${themeClasses.dictionary}`}>
         🔓 Dictionary
        </Link>
      </div>
    </div>
  );
}