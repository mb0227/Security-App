import { useState } from "react";
import { useThemeContext } from "./contexts/ThemeContext";

// SHA-1 hash using Web Crypto API
async function sha1(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await window.crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

export default function PasswordLeakChecker() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [checking, setChecking] = useState(false);
  const {theme} = useThemeContext();

  const getThemeClasses = () => {
    return theme === "dark" ? {
      background: "bg-gradient-to-br from-purple-900 to-gray-900",
      card: "bg-gray-800 border-teal-500",
      input: "bg-gray-700 border-gray-600",
      button: "bg-teal-600 hover:bg-teal-700",
      text: "text-white",
      secondaryText: "text-teal-300",
      accent: "text-teal-400",
      resultBg: "bg-gray-900",
      resultCard: "bg-gray-700"
    } : {
      background: "bg-gradient-to-br from-blue-100 to-white",
      card: "bg-white border-blue-300",
      input: "bg-gray-50 border-gray-300",
      button: "bg-teal-600 hover:bg-teal-700",
      text: "text-teal-800",
      secondaryText: "text-teal-600",
      accent: "text-teal-600",
      resultBg: "bg-gray-100",
      resultCard: "bg-white"
    };
  };

  const themeClasses = getThemeClasses();

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "dark" ? "light" : "dark");
  };
  
  // Main function for checking password leak
  async function checkPassword(e) {
    e.preventDefault();
    setStatus("");
    setChecking(true);
    try {
      if (!password) {
        setStatus("Please enter a password.");
        setChecking(false);
        return;
      }
      const hash = await sha1(password);
      const prefix = hash.slice(0, 5);
      const suffix = hash.slice(5);
      const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const text = await res.text();
      const found = text.split("\n").find(line => line.startsWith(suffix));
      if (found) {
        const count = found.split(":")[1].trim();
        setStatus(`⚠️ This password was found ${count} times in public breaches! Choose a different password.`);
      } else {
        setStatus("✅ This password was NOT found in any public breach. (Still, use unique passwords everywhere!)");
      }
    } catch (err) {
      setStatus("An error occurred. Please try again.");
    }
    setChecking(false);
  }


  return (
    <div className={`flex items-center justify-center min-h-screen ${themeClasses.background} ${themeClasses.text} p-5`}>
      <div className={`${themeClasses.card} p-8 rounded-2xl shadow-xl w-full max-w-lg text-center border`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${themeClasses.accent}`}>
            Password Leak Checker
          </h1>
        </div>
        <form onSubmit={checkPassword}>
          <div className="mb-6">
            <label className={`block text-left text-sm font-medium mb-2 ${themeClasses.secondaryText}`}>
              Enter your password (it is never sent to our server)
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password to check"
              className={`w-full p-3 rounded-md ${themeClasses.input} text-base border focus:outline-none focus:ring-2 focus:ring-teal-500`}
              autoComplete="off"
              disabled={checking}
            />
          </div>
          <button
            type="submit"
            className={`w-full ${themeClasses.button} py-3 rounded-lg text-lg font-semibold`}
            disabled={checking}
          >
            {checking ? "Checking..." : "Check for Leaks"}
          </button>
        </form>
        <div className={`mt-6 text-base ${themeClasses.secondaryText}`}>
          {status && (
            <div className={`p-4 rounded-xl mt-2 font-semibold ${status.includes("⚠️") ? "bg-red-900 text-red-200 border border-red-700" : "bg-green-900 text-green-200 border border-green-700"}`}>
              {status}
            </div>
          )}
        </div>
        <div className={`mt-8 text-sm ${themeClasses.secondaryText} text-left`}>
          <details>
            <summary className="cursor-pointer mb-2 font-medium">How does this work?</summary>
            <div className="pl-4 space-y-2">
              <p>
                Your password is <b>never sent to our server or any third-party server</b>. When you check, the password is hashed using SHA-1 in your browser, and only the first 5 characters of the hash are sent to the Have I Been Pwned database using their public k-Anonymity API.
              </p>
              <p>
                If your password appears in known data breaches, you'll be warned. <b>Always use unique passwords for each service.</b>
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}