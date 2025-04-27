import { useState } from "react";
import { useThemeContext } from "../contexts/ThemeContext";

export default function Decode() {
  const [image, setImage] = useState(null);
  const [decodedMessage, setDecodedMessage] = useState("");
  const {theme} = useThemeContext();

  const themeClasses = theme === "dark"
    ? {
      background: "bg-gradient-to-br from-purple-900 to-gray-900",
      card: "bg-gray-800 border-2 border-dashed border-teal-500",
        input: "text-teal-200",
        button: "bg-teal-600 hover:bg-teal-700 text-white",
        text: "text-teal-200",
        accent: "text-teal-400",
        label: "text-teal-300",
        filename: "text-teal-200",
        border: "border-teal-500",
        messageCard: "bg-gray-800 border border-teal-600",
        messageTitle: "text-lg font-bold text-green-400 mb-2",
        messageText: "text-teal-200 break-words"
      }
    : {
        background: "bg-gradient-to-br from-blue-100 to-white",
        card: "bg-white border-2 border-dashed border-teal-300",
        input: "text-black",
        button: "bg-teal-600 hover:bg-teal-700 text-white",
        text: "text-black",
        accent: "text-teal-700",
        label: "text-black",
        filename: "text-black",
        border: "border-teal-300",
        messageCard: "bg-gray-100 border border-teal-400",
        messageTitle: "text-lg font-bold text-green-700 mb-2",
        messageText: "text-black break-words"
      };

  const handleDecode = () => {
    if (!image) return alert("Please upload an image.");

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, img.width, img.height);

      let binary = "";
      for (let i = 0; i < imgData.data.length; i += 4) {
        binary += imgData.data[i] & 1;
      }

      let message = "";
      for (let i = 0; i < binary.length; i += 8) {
        const byte = binary.slice(i, i + 8);
        if (byte === "00000000") break;
        message += String.fromCharCode(parseInt(byte, 2));
      }
      if (message[0] === "ÿ") {
        message = "";
      }
      setDecodedMessage(message);
    };

    img.src = URL.createObjectURL(image);
  };

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text} p-10 flex flex-col items-center`}>
      <div className="flex items-center justify-between w-full max-w-md mb-6">
        <h1 className={`text-3xl font-bold text-center ${themeClasses.accent}`}>🔍 Reveal Hidden Message</h1>
      </div>
      <label className={`w-full max-w-md ${themeClasses.card} rounded-xl p-6 mb-4 text-center cursor-pointer hover:bg-gray-700 transition`}>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setImage(e.target.files[0])}
        />
        {image ? (
          <span className={themeClasses.filename}>{image.name}</span>
        ) : (
          <span className="text-gray-400">Click to upload an encoded image</span>
        )}
      </label>

      <button
        onClick={handleDecode}
        className={`px-6 py-3 rounded-lg font-semibold transition ${themeClasses.button}`}
      >
        Reveal Message
      </button>

      {decodedMessage && (
        <div className={`mt-6 w-full max-w-md p-4 rounded-lg ${themeClasses.messageCard}`}>
          <h2 className={themeClasses.messageTitle}>🔓 Hidden Message:</h2>
          <p className={themeClasses.messageText}>{decodedMessage}</p>
        </div>
      )}
    </div>
  );
}