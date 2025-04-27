import { useState } from "react";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import { useThemeContext } from "../contexts/ThemeContext";

function AESEncryption() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("secret123");
  const [encrypted, setEncrypted] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const {theme} = useThemeContext();

  const getThemeClasses = () => {
    return theme === "dark"
      ? {
          background: "bg-gradient-to-br from-purple-900 to-gray-900",
          card: "bg-gray-900 border-teal-600",
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

  const handleEncrypt = () => {
    if (!text || !key) return;
    const encryptedText = AES.encrypt(text, key).toString();
    setEncrypted(encryptedText);
    setDecrypted("");
  };

  const handleDecrypt = () => {
    try {
      let bytes = AES.decrypt(encrypted || text, key);
      const originalText = bytes.toString(Utf8);
      setDecrypted(originalText || "Invalid key");
    } catch {
      setDecrypted("Decryption failed");
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text} p-6 flex justify-center items-center`}>
      <div className={`${themeClasses.card} p-8 rounded-xl shadow-xl max-w-xl w-full border`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${themeClasses.accent} text-center`}>AES Encryption</h1>
        </div>
        <textarea
          rows="3"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text..."
          className={`w-full p-3 rounded ${themeClasses.input} mb-4`}
        />

        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Encryption Key"
          className={`w-full p-2 rounded ${themeClasses.input} mb-4`}
        />

        <div className="flex gap-4 mb-4">
          <button onClick={handleEncrypt} className={`flex-1 ${themeClasses.button} px-4 py-2 rounded`}>
            Encrypt
          </button>
          <button onClick={handleDecrypt} className={`flex-1 ${themeClasses.button} px-4 py-2 rounded`}>
            Decrypt
          </button>
        </div>

        <div className="mb-2">
          <label className={`block mb-1 ${themeClasses.label}`}>Encrypted Text:</label>
          <div className={`p-3 rounded break-words ${themeClasses.resultBg}`}>{encrypted || "-"}</div>
        </div>

        <div>
          <label className={`block mb-1 ${themeClasses.label}`}>Decrypted Text:</label>
          <div className={`p-3 rounded break-words ${themeClasses.resultBg}`}>{decrypted || "-"}</div>
        </div>
      </div>
    </div>
  );
}

export default AESEncryption;