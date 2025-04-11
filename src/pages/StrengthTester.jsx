import { useState } from "react";

function StrengthTester() {
  const [input, setInput] = useState("");
  const [strength, setStrength] = useState("");

  const getStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[`!@#$%^&*()_+=\-;|]/.test(password)) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;

    if (score <= 1) return "Weak";
    if (score === 2 || score === 3) return "Medium";
    return "Strong";
  };

  const handleChange = (e) => {
    const value = e.target.value.slice(0, 20);
    setInput(value);
    setStrength(getStrength(value));
  };

  const strengthColor = {
    Weak: "text-red-500",
    Medium: "text-yellow-400",
    Strong: "text-green-400",
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 text-white p-5">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-96 text-center border border-purple-500">
        <h1 className="text-2xl font-bold mb-6 text-purple-400">Strength Tester</h1>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Enter password (max 20 chars)"
          className="w-full p-3 mb-4 rounded-md bg-gray-700 text-lg text-center border border-gray-600 focus:outline-none"
        />
        <div className={`text-lg font-medium ${strengthColor[strength]}`}>
          Strength: {strength || "Enter a password"}
        </div>
      </div>
    </div>
  );
}

export default StrengthTester;
