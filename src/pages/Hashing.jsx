import { Link } from "react-router-dom";

export default function Hashing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 text-white flex items-center justify-center p-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <Link to="/hashing/md5" className="bg-red-600 hover:bg-red-700 px-8 py-6 rounded-2xl shadow-lg text-2xl font-semibold transition">
          🔒 MD5 Hash
        </Link>
        <Link to="/hashing/sha1" className="bg-amber-600 hover:bg-amber-700 px-8 py-6 rounded-2xl shadow-lg text-2xl font-semibold transition">
          🔒 SHA-1 Hash
        </Link>
        <Link to="/hashing/sha256" className="bg-teal-600 hover:bg-teal-700 px-8 py-6 rounded-2xl shadow-lg text-2xl font-semibold transition">
          🔒 SHA-256 Hash
        </Link>
      </div>
    </div>
  );
}