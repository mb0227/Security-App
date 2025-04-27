import { useState } from "react";
import { useThemeContext } from "../contexts/ThemeContext";

export default function Base64Encoding() {
  const [text, setText] = useState("");
  const [encoded, setEncoded] = useState("");
  const [decoded, setDecoded] = useState("");
  const { theme } = useThemeContext()
  
  const getThemeClasses = () => {
    return theme === "dark"
      ? {
          background: "bg-gradient-to-br from-purple-900 to-gray-900",
          card: "bg-gray-800 border-teal-600",
          input: "bg-gray-700 border-gray-600 text-teal-200",
          button: "bg-teal-500 hover:bg-teal-600 text-white",
          text: "text-teal-200",
          accent: "text-teal-400",
          label: "text-teal-300",
          resultBg: "bg-gray-700 text-teal-200",
        }
      : {
          background: "bg-gradient-to-br from-blue-100 to-white",
          card: "bg-white border-teal-300",
          input: "bg-gray-50 border-gray-300 text-black",
          button: "bg-teal-600 hover:bg-teal-700 text-white",
          text: "text-black",
          accent: "text-teal-700",
          label: "text-black",
          resultBg: "bg-gray-200 text-black",
        };
  };
  const themeClasses = getThemeClasses();
  
  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text} flex items-center justify-center p-6`}>
      <div className={`${themeClasses.card} p-8 rounded-2xl shadow-xl w-full max-w-xl border`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-3xl text-center font-bold ${themeClasses.accent}`}>Base64 Encoding</h2>
        </div>
        <textarea
          className={`w-full p-3 rounded mb-4 ${themeClasses.input}`}
          rows="3"
          placeholder="Enter text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex gap-4 mb-4 justify-center">
          <button
            className={`${themeClasses.button} px-4 py-2 rounded`}
            onClick={() => setEncoded(btoa(text))}
          >
            Encode
          </button>
          <button
            className={`${themeClasses.button} px-4 py-2 rounded`}
            onClick={() => {
              try {
                setDecoded(atob(text));
              } catch {
                setDecoded("Invalid Base64");
              }
            }}
          >
            Decode
          </button>
        </div>

        <div className="mb-4">
          <label className={`${themeClasses.label} block mb-1`}>Encoded:</label>
          <div className={`p-2 rounded break-words ${themeClasses.resultBg}`}>{encoded || "-"}</div>
        </div>

        <div>
          <label className={`${themeClasses.label} block mb-1`}>Decoded:</label>
          <div className={`p-2 rounded break-words ${themeClasses.resultBg}`}>{decoded || "-"}</div>
        </div>
      </div>
    </div>
  );
}