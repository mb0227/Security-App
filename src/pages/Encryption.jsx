import { Link } from "react-router-dom";

export default function Encryption() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 text-white flex items-center justify-center p-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <Link to="/encryption/aes" className="bg-purple-600 hover:bg-purple-700 px-8 py-6 rounded-2xl shadow-lg text-2xl font-semibold transition">
          🔐 AES Encryption
        </Link>
        <Link to="/encryption/rsa" className="bg-green-600 hover:bg-green-700 px-8 py-6 rounded-2xl shadow-lg text-2xl font-semibold transition">
          🔐 RSA Encryption
        </Link>
        <Link to="/encryption/base64" className="bg-blue-600 hover:bg-blue-700 px-8 py-6 rounded-2xl shadow-lg text-2xl font-semibold transition">
          🔐 Base64 Encoding
        </Link>
      </div>
    </div>
  );
}
