import { useCallback, useEffect, useState, useRef } from "react";
import "tailwindcss";

function Generator() {
  const [number, addNumber] = useState(false);
  const [character, addCharacter] = useState(false);
  const [password, setPassword] = useState("");
  const [rangeValue, setRangeValue] = useState(12);
  const [strength, setStrength] = useState("");
  const passRef = useRef(null);

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

  useEffect(() => recommendPassword(), [number, character, rangeValue]);

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 text-white p-5">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-96 text-center border border-blue-500">
        <h1 className="text-3xl font-bold mb-6 text-purple-400">Password Generator</h1>
        <div className="relative mb-4">
          <textarea
            id="passwordField"
            value={password}
            readOnly
            ref={passRef}
            rows={2}
            className="w-full p-4 pr-20 bg-gray-700 rounded-md text-lg text-center border border-gray-600 focus:outline-none resize-none"
          />
          <button
            id="copyButton"
            onClick={copyPass}
            className="absolute right-2 top-2 bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600 transition"
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
              className="w-full cursor-pointer accent-purple-400"
            />
            <span className="text-lg text-purple-500">Length: {rangeValue}</span>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-purple-500">
              <input
                type="checkbox"
                checked={number}
                onChange={() => addNumber(!number)}
                className="w-5 h-5 cursor-pointer accent-blue-500"
              />
              <span>Numbers</span>
            </label>
            <label className="flex items-center gap-2 text-purple-500">
              <input
                type="checkbox"
                checked={character}
                onChange={() => addCharacter(!character)}
                className="w-5 h-5 cursor-pointer accent-blue-500"
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
