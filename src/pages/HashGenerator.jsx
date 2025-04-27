import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { useThemeContext } from "./contexts/ThemeContext";

function HashGenerator() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState({});
  const [selectedHashes, setSelectedHashes] = useState({
    md5: true,
    sha1: true,
    sha256: true,
    sha512: false,
    sha3: false,
    ripemd160: false,
  });
  const [copied, setCopied] = useState(null);
  const {theme} = useThemeContext();

  // Available hash types with their display names
  const hashTypes = {
    md5: "MD5",
    sha1: "SHA-1",
    sha256: "SHA-256",
    sha512: "SHA-512",
    sha3: "SHA3-256",
    ripemd160: "RIPEMD-160",
  };

  // Generate all selected hashes
  useEffect(() => {
    if (input === "") {
      setResults({});
      return;
    }
    
    const newResults = {};
    
    if (selectedHashes.md5) {
      newResults.md5 = CryptoJS.MD5(input).toString();
    }
    
    if (selectedHashes.sha1) {
      newResults.sha1 = CryptoJS.SHA1(input).toString();
    }
    
    if (selectedHashes.sha256) {
      newResults.sha256 = CryptoJS.SHA256(input).toString();
    }
    
    if (selectedHashes.sha512) {
      newResults.sha512 = CryptoJS.SHA512(input).toString();
    }
    
    if (selectedHashes.sha3) {
      newResults.sha3 = CryptoJS.SHA3(input, { outputLength: 256 }).toString();
    }
    
    if (selectedHashes.ripemd160) {
      newResults.ripemd160 = CryptoJS.RIPEMD160(input).toString();
    }
    
    setResults(newResults);
  }, [input, selectedHashes]);

  // Toggle a hash type selection
  const toggleHashType = (type) => {
    setSelectedHashes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Copy hash value to clipboard
  const copyToClipboard = (hash, value) => {
    navigator.clipboard.writeText(value)
    .then(() => {
        setCopied(hash);
        setTimeout(() => setCopied(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
    };
    
  
  // Dynamically apply theme classes
  const getThemeClasses = () => {
    return theme === "dark" ? {
      background: "bg-gradient-to-br from-purple-900 to-gray-900",
      card: "bg-gray-800 border-teal-500",
      input: "bg-gray-700 border-gray-600",
      button: "bg-teal-600 hover:bg-teal-700",
      text: "text-white",
      secondaryText: "text-gray-300",
      accent: "text-teal-400",
      resultBg: "bg-gray-900",
      resultCard: "bg-gray-700"
    } : {
      background: "bg-gradient-to-br from-blue-100 to-white",
      card: "bg-white border-teal-300",
      input: "bg-gray-50 border-gray-300",
      button: "bg-teal-600 hover:bg-teal-700",
      text: "text-gray-800",
      secondaryText: "text-gray-600",
      accent: "text-teal-600",
      resultBg: "bg-gray-100",
      resultCard: "bg-white"
    };
  };

  const themeClasses = getThemeClasses();

  return (
    <div className={`flex items-center justify-center min-h-screen ${themeClasses.background} ${themeClasses.text} p-5`}>
      <div className={`${themeClasses.card} p-8 rounded-2xl shadow-xl w-full max-w-2xl text-center border`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${themeClasses.accent}`}>Hash Generator</h1>
        </div>
        
        {/* Input field */}
        <div className="mb-6">
          <label className={`block text-left text-sm font-medium mb-2 ${themeClasses.secondaryText}`}>
            Enter text to hash
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text here..."
            className={`w-full p-3 rounded-md ${themeClasses.input} text-base border focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-24`}
          />
        </div>
        
        {/* Hash type selection */}
        <div className="mb-6">
          <label className={`block text-left text-sm font-medium mb-2 ${themeClasses.secondaryText}`}>
            Select hash functions
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.keys(hashTypes).map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  id={type}
                  checked={selectedHashes[type]}
                  onChange={() => toggleHashType(type)}
                  className="mr-2"
                />
                <label htmlFor={type} className={`${themeClasses.secondaryText}`}>
                  {hashTypes[type]}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Results section */}
        <div className={`${themeClasses.resultBg} p-4 rounded-md text-left`}>
          <h2 className={`text-xl font-medium mb-4 ${themeClasses.accent}`}>
            {Object.keys(results).length > 0 
              ? "Generated Hashes" 
              : "Enter text above to generate hashes"}
          </h2>
          
          {Object.keys(results).length > 0 && (
            <div className="space-y-4">
              {Object.keys(results).map((hash) => (
                <div key={hash} className={`${themeClasses.resultCard} p-3 rounded-md`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{hashTypes[hash]}</span>
                    <button 
                      onClick={() => copyToClipboard(hash, results[hash])}
                      className={`text-xs px-2 py-1 rounded ${themeClasses.button} text-white`}
                    >
                      {copied === hash ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <code className="text-sm break-all font-mono">
                      {results[hash]}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Information section */}
        <div className={`mt-6 text-sm ${themeClasses.secondaryText} text-left`}>
          <details>
            <summary className="cursor-pointer mb-2 font-medium">About Hash Functions</summary>
            <div className="pl-4 space-y-2">
              <p><strong>MD5:</strong> Fast but vulnerable to collisions. 128-bit hash, not recommended for security applications.</p>
              <p><strong>SHA-1:</strong> 160-bit hash, faster than SHA-2 but has known vulnerabilities.</p>
              <p><strong>SHA-256:</strong> Part of the SHA-2 family, 256-bit output. Widely used for security applications.</p>
              <p><strong>SHA-512:</strong> 512-bit hash from the SHA-2 family. More secure but slower than SHA-256.</p>
              <p><strong>SHA3-256:</strong> Part of the newer SHA-3 family with 256-bit output. Resistant to attacks that work against SHA-2.</p>
              <p><strong>RIPEMD-160:</strong> 160-bit hash that was designed as an alternative to SHA-1 and MD5.</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

export default HashGenerator;