import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useThemeContext } from './contexts/ThemeContext';

// 10 password rule
const passwordRules = [
  {
    label: "At least 10 characters",
    test: (v) => v.length >= 10,
  },
  {
    label: "At least 1 uppercase letter",
    test: (v) => /[A-Z]/.test(v),
  },
  {
    label: "At least 1 lowercase letter",
    test: (v) => /[a-z]/.test(v),
  },
  {
    label: "At least 1 number",
    test: (v) => /\d/.test(v),
  },
  {
    label: "At least 1 special character",
    test: (v) => /[!@#$%^&*(),.?":{}|<>_\-+=;`~]/.test(v),
  },
  {
    label: "No spaces",
    test: (v) => !/\s/.test(v),
  },
  {
    label: "No more than 3 identical characters in a row",
    test: (v) => !/(.)\1\1/.test(v),
  },
  {
    label: "No common passwords",
    test: (v) => !["password", "123456", "qwerty", "letmein"].includes(v.toLowerCase()),
  },
  {
    label: "No sequences (e.g., 'abcd', '1234')",
    test: (v) => !/(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|defg|efgh|fghi|ghij)/i.test(v),
  },
];

const Signup = () => {
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const {theme} = useThemeContext();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { email, password, confirmPassword } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const allRulesPass = passwordRules.every(rule => rule.test(password, email));

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (!allRulesPass) {
      setError("Password does not meet all security requirements.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
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
    <div className={`${bgGradient} min-h-screen flex flex-col p-6`}>
      <div className="flex flex-1 justify-center items-center pb-20">
        <div className={`w-full max-w-md ${cardBg} rounded-2xl shadow-2xl p-10`}>
          <h2 className={`text-3xl font-extrabold text-center mb-8 tracking-wide drop-shadow-lg ${cardText}`}>Create Account</h2>
          {error && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 bg-teal-100 border-l-4 border-teal-600 text-teal-700 p-4 rounded-md" role="alert">
              <p>Account created! Redirecting to login...</p>
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
            <label className="block mb-2 relative">
              <span className={`font-semibold text-sm ${cardText}`}>Password</span>
              <input
                className={`mt-1 block w-full rounded-lg px-4 py-2 pr-12 ${inputBg} ${inputFocus} transition`}
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={password}
                onChange={onChange}
                required
                autoComplete="new-password"
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
            {/* Password Rules Checklist */}
            <ul className="mb-4 mt-2 text-xs">
              {passwordRules.map((rule, i) => {
                const passed = rule.test(password, email);
                return (
                  <li key={rule.label} className={`flex items-center gap-2 ${passed ? 'text-green-400' : 'text-red-400'}`}>
                    {passed ? "✔️" : "❌"} {rule.label}
                  </li>
                );
              })}
            </ul>
            <label className="block mb-8 relative">
              <span className={`font-semibold text-sm ${cardText}`}>Confirm Password</span>
              <input
                className={`mt-1 block w-full rounded-lg px-4 py-2 pr-12 ${inputBg} ${inputFocus} transition`}
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={onChange}
                required
                minLength="10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute top-12 right-4 transform -translate-y-1/2 text-xl text-gray-400 focus:outline-none"
                tabIndex={-1}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </label>
            <button
              className={`w-full ${btnGradient} text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-md text-lg`}
              type="submit"
              disabled={loading || !allRulesPass}
              title={!allRulesPass ? "Password must meet all rules" : ""}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
          <div className="text-center mt-6">
            <span className={`text-sm ${cardText}`}>Already have an account?{' '}
              <Link to="/login" className={`${textLink} font-semibold underline`}>
                Login
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;