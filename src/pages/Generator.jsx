import { useCallback, useEffect, useState, useRef } from "react";
import "tailwindcss";
import useUser from "./hooks/useUser";
import { useThemeContext } from "./contexts/ThemeContext";

function Generator({setAuth}) {
  const { user, loading, error } = useUser(setAuth);
  const [number, addNumber] = useState(false);
  const [character, addCharacter] = useState(false);
  const [password, setPassword] = useState("");
  const [rangeValue, setRangeValue] = useState(12);
  const [strength, setStrength] = useState("");
  const passRef = useRef(null);
  const {theme} = useThemeContext();

  // Theme classes for dark and light mode
  const getThemeClasses = () => {
    return theme === "dark"
      ? {
          background: "bg-gradient-to-br from-purple-900 to-gray-900",
          card: "bg-gray-800 border-teal-600",
          input: "bg-gray-700 border-gray-600 text-teal-200",
          button: "bg-teal-500 hover:bg-teal-600 text-white",
          text: "text-teal-200",
          secondaryText: "text-teal-400",
          accent: "text-teal-400",
          slider: "accent-teal-400",
          label: "text-teal-400",
        }
      : {
          background: "bg-gradient-to-br from-blue-100 to-white",
          card: "bg-white border-teal-300",
          input: "bg-gray-50 border-gray-300 text-teal-700",
          button: "bg-teal-600 hover:bg-teal-700 text-white",
          text: "text-teal-700",
          secondaryText: "text-teal-600",
          accent: "text-teal-600",
          slider: "accent-teal-500",
          label: "text-teal-700",
        };
  };
  const themeClasses = getThemeClasses();
  
  const handleRangeChange = (event) => {
    setRangeValue(event.target.value);
  };
  
  const getPasswordStrength = (pass) => {
    let strengthScore = 0;
    if (pass.length >= 10) strengthScore++;
    if (/[0-9]/.test(pass)) strengthScore++;
    if (/[`!@#$%^&*()_+=\-;|]/.test(pass)) strengthScore++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) strengthScore++;
    
    if (strengthScore <= 1) return "Weak";
    else if (strengthScore === 2 || strengthScore === 3) return "Medium";
    else return "Strong";
  };
  
  const recommendPassword = useCallback(() => {
    let generatedPassword = "";
    let string = "ABCDEFGIJKLMNOPQRSTUVWXYZabcdefghijklmnipoqrstuvwxyz";
    if (number) string += "0123456789";
    if (character) string += "`!@#$%^&*()_+=-;|";
    
    for (let i = 0; i < rangeValue; i++) {
      let char = Math.floor(Math.random() * string.length);
      generatedPassword += string[char];
    }
    setPassword(generatedPassword);
    setStrength(getPasswordStrength(generatedPassword));
  }, [number, rangeValue, character]);
  
  useEffect(() => recommendPassword(), [number, character, rangeValue, recommendPassword]);
  
  const copyPass = () => {
    if (passRef.current) {
      passRef.current.select();
      navigator.clipboard.writeText(password);
    }
  };
  
  const strengthColor = {
    Weak: "text-red-500",
    Medium: "text-yellow-400",
    Strong: "text-green-400",
  };
  
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
  
  return (
    <div
    className={`flex items-center justify-center min-h-screen ${themeClasses.background} ${themeClasses.text} p-5`}
    >
      <div
        className={`${themeClasses.card} p-8 rounded-2xl shadow-xl w-100 text-center border`}
        style={{ marginTop: "-6vw" }}
        >
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${themeClasses.accent}`}>Password Generator</h1>
        </div>
        <div className="relative mb-4">
          <textarea
            id="passwordField"
            value={password}
            readOnly
            ref={passRef}
            rows={2}
            className={`w-full p-4 pr-20 rounded-md text-lg text-center border focus:outline-none resize-none ${themeClasses.input}`}
          />
          <button
            id="copyButton"
            onClick={copyPass}
            className={`absolute right-2 top-2 px-3 py-1 rounded-md transition ${themeClasses.button}`}
          >
            Copy
          </button>
        </div>

        {/* Password Strength */}
        <div className={`text-sm font-medium mb-4 ${strengthColor[strength]}`}>
          Strength: {strength}
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-full flex flex-col items-center">
            <input
              id="length"
              type="range"
              min="8"
              max="20"
              onChange={handleRangeChange}
              value={rangeValue}
              className={`w-full cursor-pointer ${themeClasses.slider}`}
            />
            <span className={`text-lg ${themeClasses.secondaryText}`}>Length: {rangeValue}</span>
          </div>
          <div className="flex items-center gap-6">
            <label className={`flex items-center gap-2 ${themeClasses.label}`}>
              <input
                type="checkbox"
                checked={number}
                onChange={() => addNumber(!number)}
                className={`w-5 h-5 cursor-pointer ${themeClasses.slider}`}
              />
              <span>Numbers</span>
            </label>
            <label className={`flex items-center gap-2 ${themeClasses.label}`}>
              <input
                type="checkbox"
                checked={character}
                onChange={() => addCharacter(!character)}
                className={`w-5 h-5 cursor-pointer ${themeClasses.slider}`}
              />
              <span>Special Characters</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Generator;