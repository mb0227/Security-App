import { useState, useEffect } from "react";
import { useThemeContext } from "./contexts/ThemeContext";

function CipherGenerator() {
  const [input, setInput] = useState("");
  const [key, setKey] = useState("");
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState({});
  const [operation, setOperation] = useState("encrypt"); // encrypt or decrypt
  const [selectedCipher, setSelectedCipher] = useState("caesar");
  const [copied, setCopied] = useState(null);
  const {theme} = useThemeContext();

  // Available cipher types with their display names
  const cipherTypes = {
    caesar: "Caesar Cipher",
    shift: "Shift Cipher",
    vigenere: "Vigenère Cipher",
    atbash: "Atbash Cipher",
    rot13: "ROT13",
    railfence: "Rail Fence Cipher",
    morse: "Morse Code",
  };

  // Generate results for the selected cipher
  useEffect(() => {
    if (input === "") {
      setResults({});
      return;
    }
    
    const newResults = {};
    
    switch(selectedCipher) {
      case "caesar":
        newResults.result = caesarCipher(input, parseInt(key) || 3, operation);
        break;
      case "shift":
        newResults.result = shiftCipher(input, parseInt(key) || 1, operation);
        break;
      case "vigenere":
        newResults.result = vigenereCipher(input, keyword, operation);
        break;
      case "atbash":
        newResults.result = atbashCipher(input);
        break;
      case "rot13":
        newResults.result = rot13Cipher(input);
        break;
      case "railfence":
        newResults.result = railFenceCipher(input, parseInt(key) || 3, operation);
        break;
      case "morse":
        newResults.result = morseCodeConverter(input, operation);
        break;
      default:
        newResults.result = "";
    }
    
    setResults(newResults);
  }, [input, key, keyword, selectedCipher, operation]);

  // Implementation of Caesar Cipher
  const caesarCipher = (text, shift, op) => {
    if (op === "decrypt") shift = (26 - shift) % 26;
    
    return text.split('').map(char => {
      const code = char.charCodeAt(0);
      
      // Handle uppercase letters
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      }
      // Handle lowercase letters
      else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
      // Return unchanged for non-alphabetic characters
      return char;
    }).join('');
  };

  // Implementation of Shift Cipher (similar to Caesar but with any shift value)
  const shiftCipher = (text, shift, op) => {
    if (op === "decrypt") shift = -shift;
    
    return text.split('').map(char => {
      const code = char.charCodeAt(0);
      
      // Handle uppercase letters
      if (code >= 65 && code <= 90) {
        return String.fromCharCode((((code - 65 + shift) % 26 + 26) % 26) + 65);
      }
      // Handle lowercase letters
      else if (code >= 97 && code <= 122) {
        return String.fromCharCode((((code - 97 + shift) % 26 + 26) % 26) + 97);
      }
      // Return unchanged for non-alphabetic characters
      return char;
    }).join('');
  };

  // Implementation of Vigenère Cipher
  const vigenereCipher = (text, keyword, op) => {
    if (!keyword) return "Keyword required for Vigenère cipher";
    
    const key = keyword.toLowerCase().replace(/[^a-z]/g, '');
    if (key.length === 0) return "Valid keyword required (letters only)";
    
    return text.split('').map((char, i) => {
      const code = char.charCodeAt(0);
      const keyChar = key[i % key.length];
      const shift = keyChar.charCodeAt(0) - 97;
      
      // Handle uppercase letters
      if (code >= 65 && code <= 90) {
        if (op === "encrypt") {
          return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        } else {
          return String.fromCharCode((((code - 65 - shift) % 26 + 26) % 26) + 65);
        }
      }
      // Handle lowercase letters
      else if (code >= 97 && code <= 122) {
        if (op === "encrypt") {
          return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        } else {
          return String.fromCharCode((((code - 97 - shift) % 26 + 26) % 26) + 97);
        }
      }
      // Return unchanged for non-alphabetic characters
      return char;
    }).join('');
  };

  // Implementation of Atbash Cipher
  const atbashCipher = (text) => {
    return text.split('').map(char => {
      const code = char.charCodeAt(0);
      
      // Handle uppercase letters (A -> Z, B -> Y, etc.)
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(90 - (code - 65));
      }
      // Handle lowercase letters (a -> z, b -> y, etc.)
      else if (code >= 97 && code <= 122) {
        return String.fromCharCode(122 - (code - 97));
      }
      // Return unchanged for non-alphabetic characters
      return char;
    }).join('');
  };

  // Implementation of ROT13 Cipher
  const rot13Cipher = (text) => {
    return caesarCipher(text, 13, "encrypt");
  };

  // Implementation of Rail Fence Cipher
  const railFenceCipher = (text, railCount, op) => {
    if (railCount < 2) return "Rail count must be at least 2";
    if (text.length === 0) return "";

    if (op === "encrypt") {
      // Create the rail fence pattern
      const fence = Array(railCount).fill().map(() => Array(text.length).fill(''));
      
      let rail = 0;
      let direction = 1; // 1 for down, -1 for up
      
      // Fill the fence with characters
      for (let i = 0; i < text.length; i++) {
        fence[rail][i] = text[i];
        
        rail += direction;
        
        // Change direction when we hit the top or bottom rail
        if (rail === 0 || rail === railCount - 1) {
          direction = -direction;
        }
      }
      
      // Read off the fence
      return fence.flat().filter(char => char !== '').join('');
    } else {
      // Decrypt - first determine the rail pattern
      const fence = Array(railCount).fill().map(() => Array(text.length).fill(''));
      
      let rail = 0;
      let direction = 1;
      
      // Mark valid positions in the fence
      for (let i = 0; i < text.length; i++) {
        fence[rail][i] = '*';
        
        rail += direction;
        
        if (rail === 0 || rail === railCount - 1) {
          direction = -direction;
        }
      }
      
      // Fill the fence with the ciphertext
      let index = 0;
      for (let i = 0; i < railCount; i++) {
        for (let j = 0; j < text.length; j++) {
          if (fence[i][j] === '*' && index < text.length) {
            fence[i][j] = text[index++];
          }
        }
      }
      
      // Read off in the original zigzag pattern
      let result = '';
      rail = 0;
      direction = 1;
      
      for (let i = 0; i < text.length; i++) {
        result += fence[rail][i];
        
        rail += direction;
        
        if (rail === 0 || rail === railCount - 1) {
          direction = -direction;
        }
      }
      
      return result;
    }
  };

  // Implementation of Morse Code Converter
  const morseCodeConverter = (text, op) => {
    const morseCodeMap = {
      'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 
      'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
      'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
      'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
      '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--',
      '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...',
      ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
      '$': '...-..-', '@': '.--.-.'
    };
    
    const reverseMorseCodeMap = {};
    Object.keys(morseCodeMap).forEach(key => {
      reverseMorseCodeMap[morseCodeMap[key]] = key;
    });
    
    if (op === "encrypt") {
      return text.toUpperCase().split('').map(char => {
        if (char === ' ') return '/ ';
        return morseCodeMap[char] || char;
      }).join(' ');
    } else {
      return text.split(' ').map(code => {
        if (code === '/') return ' ';
        return reverseMorseCodeMap[code] || code;
      }).join('');
    }
  };

  // Copy result to clipboard
  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value)
      .then(() => {
        setCopied(true);
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
      resultCard: "bg-gray-700",
      radio: "bg-gray-700"
    } : {
      background: "bg-gradient-to-br from-blue-100 to-white",
      card: "bg-white border-teal-300",
      input: "bg-gray-50 border-gray-300",
      button: "bg-teal-600 hover:bg-teal-700",
      text: "text-gray-800",
      secondaryText: "text-gray-600",
      accent: "text-teal-600",
      resultBg: "bg-gray-100",
      resultCard: "bg-white",
      radio: "bg-gray-200"
    };
  };

  const themeClasses = getThemeClasses();

  // Check if the current cipher needs a key
  const needsKey = () => {
    return ["caesar", "shift", "railfence"].includes(selectedCipher);
  };

  // Check if the current cipher needs a keyword
  const needsKeyword = () => {
    return selectedCipher === "vigenere";
  };


  return (
    <div className={`flex items-center justify-center min-h-screen ${themeClasses.background} ${themeClasses.text} p-5`}>
      <div className={`${themeClasses.card} p-8 rounded-2xl shadow-xl w-full max-w-2xl text-center border`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${themeClasses.accent}`}>Cipher Generator</h1>
        </div>
        
        {/* Cipher Type Selection */}
        <div className="mb-6">
          <label className={`block text-left text-sm font-medium mb-2 ${themeClasses.secondaryText}`}>
            Select Cipher Type
          </label>
          <select
            value={selectedCipher}
            onChange={(e) => setSelectedCipher(e.target.value)}
            className={`w-full p-3 rounded-md ${themeClasses.input} text-base border focus:outline-none focus:ring-2 focus:ring-teal-500`}
          >
            {Object.keys(cipherTypes).map((type) => (
              <option key={type} value={type}>
                {cipherTypes[type]}
              </option>
            ))}
          </select>
        </div>

        {/* Operation Selection */}
        <div className="mb-6">
          <label className={`block text-left text-sm font-medium mb-2 ${themeClasses.secondaryText}`}>
            Operation
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="operation"
                value="encrypt"
                checked={operation === "encrypt"}
                onChange={() => setOperation("encrypt")}
                className={`form-radio ${themeClasses.radio}`}
              />
              <span className="ml-2">Encrypt</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="operation"
                value="decrypt"
                checked={operation === "decrypt"}
                onChange={() => setOperation("decrypt")}
                className={`form-radio ${themeClasses.radio}`}
              />
              <span className="ml-2">Decrypt</span>
            </label>
          </div>
        </div>
        
        {/* Input field */}
        <div className="mb-6">
          <label className={`block text-left text-sm font-medium mb-2 ${themeClasses.secondaryText}`}>
            Enter text to {operation}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Type or paste text to ${operation}...`}
            className={`w-full p-3 rounded-md ${themeClasses.input} text-base border focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-24`}
          />
        </div>
        
        {/* Key input field - shown only for ciphers that need it */}
        {needsKey() && (
          <div className="mb-6">
            <label className={`block text-left text-sm font-medium mb-2 ${themeClasses.secondaryText}`}>
              {selectedCipher === "railfence" ? "Number of Rails" : "Shift Value"}
            </label>
            <input
              type="number"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={selectedCipher === "railfence" ? "Enter number of rails (e.g. 3)" : "Enter shift value (e.g. 3 for Caesar)"}
              className={`w-full p-3 rounded-md ${themeClasses.input} text-base border focus:outline-none focus:ring-2 focus:ring-teal-500`}
              min={selectedCipher === "railfence" ? "2" : "0"}
            />
          </div>
        )}
        
        {/* Keyword input field - shown only for Vigenère cipher */}
        {needsKeyword() && (
          <div className="mb-6">
            <label className={`block text-left text-sm font-medium mb-2 ${themeClasses.secondaryText}`}>
              Keyword for Vigenère Cipher
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter keyword (letters only)"
              className={`w-full p-3 rounded-md ${themeClasses.input} text-base border focus:outline-none focus:ring-2 focus:ring-teal-500`}
            />
          </div>
        )}
        
        {/* Results section */}
        <div className={`${themeClasses.resultBg} p-4 rounded-md text-left`}>
          <h2 className={`text-xl font-medium mb-4 ${themeClasses.accent}`}>
            {Object.keys(results).length > 0 
              ? `${operation === "encrypt" ? "Encrypted" : "Decrypted"} Result` 
              : `Enter text above to ${operation}`}
          </h2>
          
          {Object.keys(results).length > 0 && (
            <div className="space-y-4">
              <div className={`${themeClasses.resultCard} p-3 rounded-md`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{cipherTypes[selectedCipher]}</span>
                  <button 
                    onClick={() => copyToClipboard(results.result)}
                    className={`text-xs px-2 py-1 rounded ${themeClasses.button} text-white`}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <code className="text-sm break-all font-mono">
                    {results.result}
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Information section */}
        <div className={`mt-6 text-sm ${themeClasses.secondaryText} text-left`}>
          <details>
            <summary className="cursor-pointer mb-2 font-medium">About Cipher Methods</summary>
            <div className="pl-4 space-y-2">
              <p><strong>Caesar Cipher:</strong> Shifts each letter by a fixed number of positions (default is 3). Named after Julius Caesar.</p>
              <p><strong>Shift Cipher:</strong> Similar to Caesar but allows any shift value.</p>
              <p><strong>Vigenère Cipher:</strong> Uses a keyword to determine shift values for each letter, creating a polyalphabetic substitution.</p>
              <p><strong>Atbash Cipher:</strong> Substitutes each letter with its mirror image in the alphabet (A→Z, B→Y, etc.).</p>
              <p><strong>ROT13:</strong> Rotates letters by 13 positions. Applying it twice returns the original text.</p>
              <p><strong>Rail Fence Cipher:</strong> Arranges text in a zigzag pattern across a number of "rails" and reads off by row.</p>
              <p><strong>Morse Code:</strong> Represents letters and numbers as sequences of dots and dashes.</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

export default CipherGenerator;