import { Link } from "react-router-dom";

export default function Cracker() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 text-white flex items-center justify-center p-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
        <Link to="/cracker/brute-force" className="bg-green-600 hover:bg-green-700 px-8 py-6 rounded-2xl shadow-lg text-2xl font-semibold transition">
         🔓 Brute Force
        </Link>
        <Link to="/cracker/dictionary" className="bg-blue-600 hover:bg-blue-700 px-8 py-6 rounded-2xl shadow-lg text-2xl font-semibold transition">
         🔓 Dictionary
        </Link>
      </div>
    </div>
  );
}
