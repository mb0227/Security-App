import { Link } from "react-router-dom";

export default function Steganography() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white flex items-center justify-center p-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
        <Link
          to="/steganography/hide"
          className="bg-indigo-600 hover:bg-indigo-700 px-8 py-6 rounded-2xl shadow-lg text-2xl font-semibold transition"
        >
          🖼️ Hide Message
        </Link>
        <Link
          to="/steganography/reveal"
          className="bg-pink-600 hover:bg-pink-700 px-8 py-6 rounded-2xl shadow-lg text-2xl font-semibold transition"
        >
          🔍 Reveal Message
        </Link>
      </div>
    </div>
  );
}
