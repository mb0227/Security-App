import { useState, useEffect, useCallback, useMemo } from "react";
import forge from "node-forge";

function RSAEncryption() {
  const [text, setText] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [encrypted, setEncrypted] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);

  // Memoize the key pair generation to avoid generating it every time
  const rsaKeyPair = useMemo(() => {
    // Check if keys exist in localStorage
    const storedPublicKey = localStorage.getItem("publicKey");
    const storedPrivateKey = localStorage.getItem("privateKey");

    if (storedPublicKey && storedPrivateKey) {
      // If keys are in localStorage, use them
      return {
        publicKey: forge.pki.publicKeyFromPem(storedPublicKey),
        privateKey: forge.pki.privateKeyFromPem(storedPrivateKey),
      };
    } else {
      // Otherwise, generate new keys
      const keypair = forge.pki.rsa.generateKeyPair({ bits: 512 });
      // Store keys in localStorage
      localStorage.setItem("publicKey", forge.pki.publicKeyToPem(keypair.publicKey));
      localStorage.setItem("privateKey", forge.pki.privateKeyToPem(keypair.privateKey));
      return keypair;
    }
  }, []); // Only run once on mount

  // Encrypt function
  const handleEncrypt = useCallback(() => {
    if (!text) return;

    try {
      const encryptedText = forge.util.encode64(
        rsaKeyPair.publicKey.encrypt(forge.util.encodeUtf8(text), "RSA-OAEP")
      );
      setEncrypted(encryptedText);
      setDecrypted(""); // Clear decrypted text
    } catch (error) {
      console.error("Encryption failed", error);
    }
  }, [text, rsaKeyPair.publicKey]);

  // Decrypt function
  const handleDecrypt = useCallback(() => {
    setIsDecrypting(true);
    try {
      const textToDecrypt = encrypted || text;

      if (!textToDecrypt) {
        setDecrypted("");
        setIsDecrypting(false);
        return;
      }

      const decryptedBytes = rsaKeyPair.privateKey.decrypt(
        forge.util.decode64(textToDecrypt),
        "RSA-OAEP"
      );
      const originalText = forge.util.decodeUtf8(decryptedBytes);
      setDecrypted(originalText);
    } catch (error) {
      console.error("Decryption failed", error);
      setDecrypted("Decryption failed - Input must be a valid RSA encrypted text");
    } finally {
      setIsDecrypting(false);
    }
  }, [encrypted, text, rsaKeyPair.privateKey]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 text-white p-6 flex justify-center items-center">
      <div className="bg-gray-900 p-8 rounded-xl shadow-xl max-w-xl w-full border border-purple-500">
        <h1 className="text-3xl font-bold mb-6 text-purple-400 text-center">RSA Encryption</h1>
        <textarea
          rows="3"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text..."
          className="w-full p-3 rounded bg-gray-700 border border-gray-600 mb-4"
        />
        <div className="flex gap-4 mb-4">
          <button 
            onClick={handleEncrypt} 
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded flex-1 transition-colors"
          >
            Encrypt
          </button>
          <button 
            onClick={handleDecrypt} 
            disabled={isDecrypting}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded flex-1 transition-colors disabled:bg-purple-800 disabled:cursor-not-allowed"
          >
            {isDecrypting ? "Decrypting..." : "Decrypt"}
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-purple-300 mb-1">Encrypted Text:</label>
          <div className="bg-gray-700 p-3 rounded break-words min-h-12">{encrypted || "-"}</div>
        </div>
        <div>
          <label className="block text-purple-300 mb-1">Decrypted Text:</label>
          <div className="bg-gray-700 p-3 rounded break-words min-h-12">{decrypted || "-"}</div>
        </div>
      </div>
    </div>
  );
}

export default RSAEncryption;
