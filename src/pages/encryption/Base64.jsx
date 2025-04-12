import { useState } from "react";

export default function Base64Encoding() {
  const [text, setText] = useState("");
  const [encoded, setEncoded] = useState("");
  const [decoded, setDecoded] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-xl border border-purple-400">
        <h2 className="text-3xl text-center text-purple-300 font-bold mb-6">Base64 Encoding</h2>

        <textarea
          className="w-full p-3 bg-gray-700 rounded mb-4"
          rows="3"
          placeholder="Enter text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex gap-4 mb-4 justify-center">
          <button
            className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded"
            onClick={() => setEncoded(btoa(text))}
          >
            Encode
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded"
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
          <label className="text-purple-300 block mb-1">Encoded:</label>
          <div className="bg-gray-700 p-2 rounded break-words">{encoded || "-"}</div>
        </div>

        <div>
          <label className="text-purple-300 block mb-1">Decoded:</label>
          <div className="bg-gray-700 p-2 rounded break-words">{decoded || "-"}</div>
        </div>
      </div>
    </div>
  );
}
