import { Link } from "react-router-dom";
import { useThemeContext } from "./contexts/ThemeContext";

export default function Encryption() {
  const {theme} = useThemeContext();

  const themeClasses = theme === "dark"
    ? {
        background: "bg-gradient-to-br from-purple-900 to-gray-900",
        text: "text-white",
        aes: "bg-purple-600 hover:bg-purple-700 text-white",
        rsa: "bg-green-600 hover:bg-green-700 text-white",
        base64: "bg-blue-600 hover:bg-blue-700 text-white",
      }
    : {
        background: "bg-gradient-to-br from-blue-100 to-white",
        text: "text-black",
        aes: "bg-purple-400 hover:bg-purple-500 text-white",
        rsa: "bg-green-400 hover:bg-green-500 text-black",
        base64: "bg-blue-400 hover:bg-blue-500 text-black",
      };

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text} flex items-center justify-center p-8`}>
      <div className="absolute top-28 right-6">
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <Link to="/encryption/aes" className={`px-8 py-6 rounded-2xl shadow-lg text-2xl font-semibold transition ${themeClasses.aes}`}>
          🔐 AES Encryption
        </Link>
        <Link to="/encryption/rsa" className={`px-8 py-6 rounded-2xl shadow-lg text-2xl font-semibold transition ${themeClasses.rsa}`}>
          🔐 RSA Encryption
        </Link>
        <Link to="/encryption/base64" className={`px-8 py-6 rounded-2xl shadow-lg text-2xl font-semibold transition ${themeClasses.base64}`}>
          🔐 Base64 Encoding
        </Link>
      </div>
    </div>
  );
}