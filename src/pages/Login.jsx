// ...other imports and code above
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useThemeContext } from './contexts/ThemeContext';

function useTheme() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };
  return [theme, toggleTheme];
}

const Login = ({ setAuth }) => {
  const [inputs, setInputs] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {theme} = useThemeContext();
  const [showPass, setShowPass] = useState(false); // <-- ADD THIS

  const { email, password } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8081/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      setAuth(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Theming classes
  const bgGradient = theme === "dark"
    ? "bg-gradient-to-br from-[#230042] via-[#120026] to-[#1a002a]"
    : "bg-gradient-to-br from-blue-100 to-white";
  const cardBg = theme === "dark"
    ? "bg-gradient-to-br from-[#2d014f] via-[#1a002a] to-[#2a0049] border border-purple-900"
    : "bg-gradient-to-br from-white to-blue-100 border border-teal-300";
  const cardText = theme === "dark" ? "text-[#E5D7FF]" : "text-teal-800";
  const inputBg = theme === "dark"
    ? "bg-gray-900 text-white border border-purple-700"
    : "bg-white text-black border border-teal-400";
  const inputFocus = theme === "dark"
    ? "focus:ring-2 focus:ring-purple-400"
    : "focus:ring-2 focus:ring-teal-400";
  const btnGradient = theme === "dark"
    ? "bg-gradient-to-r from-teal-500 to-purple-700 hover:from-teal-600 hover:to-purple-800"
    : "bg-gradient-to-r from-teal-400 to-blue-400 hover:from-teal-500 hover:to-blue-500";
  const textLink = theme === "dark"
    ? "text-teal-400 hover:text-teal-200"
    : "text-teal-600 hover:text-teal-800";

  return (
    <div className={`${bgGradient} min-h-screen flex flex-col`}>
      <div className="flex flex-1 justify-center items-center pb-20">
        <div className={`w-full max-w-md ${cardBg} rounded-2xl shadow-2xl p-10`}>
          <h2 className={`text-3xl font-extrabold text-center mb-8 tracking-wide drop-shadow-lg ${cardText}`}>Sign In</h2>
          {error && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={onSubmitForm}>
            <label className="block mb-6">
              <span className={`font-semibold text-sm ${cardText}`}>Email</span>
              <input
                className={`mt-1 block w-full rounded-lg px-4 py-2 ${inputBg} ${inputFocus} transition`}
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={onChange}
                required
                autoComplete="email"
              />
            </label>
            <label className="block mb-8 relative">
              <span className={`font-semibold text-sm ${cardText}`}>Password</span>
              <input
                className={`mt-1 block w-full rounded-lg px-4 py-2 pr-12 ${inputBg} ${inputFocus} transition`}
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={password}
                onChange={onChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute top-12 right-4 transform -translate-y-1/2 text-xl text-gray-400 focus:outline-none"
                tabIndex={-1}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </label>
            <button
              className={`w-full ${btnGradient} text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-md text-lg`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="text-center mt-6">
            <span className={`text-sm ${cardText}`}>Don't have an account?{' '}
              <Link to="/signup" className={`${textLink} font-semibold underline`}>
                Sign Up
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;