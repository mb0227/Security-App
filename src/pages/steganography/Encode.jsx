import { useState } from "react";
import { useThemeContext } from "../contexts/ThemeContext"; 

export default function Encode() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const {theme} = useThemeContext();

  const themeClasses = theme === "dark"
    ? {
      background: "bg-gradient-to-br from-purple-900 to-gray-900",
      card: "bg-gray-800 border-2 border-dashed border-teal-500",
        input: "bg-gray-800 border border-gray-700 text-teal-200",
        button: "bg-teal-600 hover:bg-teal-700 text-white",
        text: "text-teal-200",
        accent: "text-teal-400",
        label: "text-teal-300",
        filename: "text-teal-200",
        border: "border-teal-500",
        messageCard: "bg-gray-800 border border-teal-600",
        messageTitle: "text-lg mb-2 text-green-400",
        messageText: "text-teal-200",
        download: "bg-teal-700 hover:bg-teal-800 text-white"
      }
    : {
        background: "bg-gradient-to-br from-blue-100 to-white",
        card: "bg-white border-2 border-dashed border-teal-300",
        input: "bg-gray-100 border border-gray-300 text-black",
        button: "bg-teal-600 hover:bg-teal-700 text-white",
        text: "text-black",
        accent: "text-teal-700",
        label: "text-black",
        filename: "text-black",
        border: "border-teal-300",
        messageCard: "bg-gray-100 border border-teal-400",
        messageTitle: "text-lg mb-2 text-green-700",
        messageText: "text-black",
        download: "bg-teal-600 hover:bg-teal-700 text-white"
      };

  const handleEncode = () => {
    if (!image || !message) return alert("Please select an image and enter a message.");

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, img.width, img.height);
      const binaryMessage = message
        .split("")
        .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
        .join("") + "00000000"; // Null terminator

      for (let i = 0; i < binaryMessage.length; i++) {
        imgData.data[i * 4] = (imgData.data[i * 4] & ~1) | parseInt(binaryMessage[i]);
      }

      ctx.putImageData(imgData, 0, 0);
      setResultUrl(canvas.toDataURL());
    };

    img.src = URL.createObjectURL(image);
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text} p-10 flex flex-col items-center`}>
      <div className="flex items-center justify-between w-full max-w-md mb-6">
        <h1 className={`text-3xl font-bold text-center ${themeClasses.accent}`}>🖼️ Hide Message in Image</h1> 
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
          <span className="text-gray-400">Click to upload an image</span>
        )}
      </label>

      <textarea
        placeholder="Enter secret message"
        className={`w-full max-w-md p-3 rounded-lg mb-4 resize-none ${themeClasses.input}`}
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={handleEncode}
        className={`px-6 py-3 rounded-lg font-semibold transition ${themeClasses.button}`}
      >
        Encode
      </button>

      {resultUrl && (
        <div className="mt-8 text-center">
          <h2 className={themeClasses.messageTitle}>✅ Encoded Image:</h2>
          <img src={resultUrl} alt="Encoded" className="rounded-lg shadow-lg max-w-xs mb-2" />
          <a
            href={resultUrl}
            download="encoded.png"
            className={`inline-block mt-4 px-5 py-2 font-medium rounded-lg shadow-md transition duration-300 ${themeClasses.download}`}
          >
            ⬇️ Download Image
          </a>
        </div>
      )}
    </div>
  );
}