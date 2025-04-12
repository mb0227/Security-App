import { useState } from "react";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

function AESEncryption() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("secret123");
  const [encrypted, setEncrypted] = useState("");
  const [decrypted, setDecrypted] = useState("");

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 text-white p-6 flex justify-center items-center">
      <div className="bg-gray-900 p-8 rounded-xl shadow-xl max-w-xl w-full border border-purple-500">
        <h1 className="text-3xl font-bold mb-6 text-purple-400 text-center">AES Encryption</h1>

        <textarea
          rows="3"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text..."
          className="w-full p-3 rounded bg-gray-700 border border-gray-600 mb-4"
        />

        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Encryption Key"
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 mb-4"
        />

        <div className="flex gap-4 mb-4">
          <button onClick={handleEncrypt} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">Encrypt</button>
          <button onClick={handleDecrypt} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">Decrypt</button>
        </div>

        <div className="mb-2">
          <label className="block text-purple-300">Encrypted Text:</label>
          <div className="bg-gray-700 p-3 rounded break-words">{encrypted || "-"}</div>
        </div>

        <div>
          <label className="block text-purple-300">Decrypted Text:</label>
          <div className="bg-gray-700 p-3 rounded break-words">{decrypted || "-"}</div>
        </div>
      </div>
    </div>
  );
}

export default AESEncryption;
