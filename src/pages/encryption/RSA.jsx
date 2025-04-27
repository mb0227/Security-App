import { useState, useEffect, useCallback, useMemo } from "react";
import forge from "node-forge";
import { useThemeContext } from "../contexts/ThemeContext";

function RSAEncryption() {
  const [text, setText] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [encrypted, setEncrypted] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const { theme } = useThemeContext()
  
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

  // Memoize the key pair generation to avoid generating it every time
  const rsaKeyPair = useMemo(() => {
    // Check if keys exist in localStorage
    const stotealPublicKey = localStorage.getItem("publicKey");
    const stotealPrivateKey = localStorage.getItem("privateKey");
    
    if (stotealPublicKey && stotealPrivateKey) {
      // If keys are in localStorage, use them
      return {
        publicKey: forge.pki.publicKeyFromPem(stotealPublicKey),
        privateKey: forge.pki.privateKeyFromPem(stotealPrivateKey),
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
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text} p-6 flex justify-center items-center`}>
      <div className={`${themeClasses.card} p-8 rounded-xl shadow-xl max-w-xl w-full border`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold text-center ${themeClasses.accent}`}>RSA Encryption</h1>
        </div>
        <textarea
          rows="3"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text..."
          className={`w-full p-3 rounded mb-4 ${themeClasses.input}`}
        />
        <div className="flex gap-4 mb-4">
          <button 
            onClick={handleEncrypt} 
            className={`flex-1 ${themeClasses.button} px-4 py-2 rounded transition-colors`}
          >
            Encrypt
          </button>
          <button 
            onClick={handleDecrypt} 
            disabled={isDecrypting}
            className={`flex-1 ${themeClasses.button} px-4 py-2 rounded transition-colors disabled:bg-teal-800 disabled:cursor-not-allowed`}
          >
            {isDecrypting ? "Decrypting..." : "Decrypt"}
          </button>
        </div>
        <div className="mb-4">
          <label className={`block mb-1 ${themeClasses.label}`}>Encrypted Text:</label>
          <div className={`p-3 rounded break-words min-h-12 ${themeClasses.resultBg}`}>{encrypted || "-"}</div>
        </div>
        <div>
          <label className={`block mb-1 ${themeClasses.label}`}>Decrypted Text:</label>
          <div className={`p-3 rounded break-words min-h-12 ${themeClasses.resultBg}`}>{decrypted || "-"}</div>
        </div>
      </div>
    </div>
  );
}

export default RSAEncryption;