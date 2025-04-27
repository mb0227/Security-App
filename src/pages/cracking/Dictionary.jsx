import { useState, useEffect, useRef } from "react";
import CryptoJS from "crypto-js";
import { useThemeContext } from "../contexts/ThemeContext"; 

function DictionaryCracker() {
  const [hash, setHash] = useState("");
  const [hashType, setHashType] = useState("md5");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentAttempt, setCurrentAttempt] = useState("");
  const [dictionaryText, setDictionaryText] = useState("");
  const [dictionaryWords, setDictionaryWords] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [useSample, setUseSample] = useState(false);
  const {theme} = useThemeContext();
  
  const workerRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  
  const themeClasses = theme === "dark"
    ? {
        background: "bg-gradient-to-br from-purple-900 to-gray-900",
        card: "bg-gray-900 border-teal-500",
        input: "bg-gray-700 border-gray-600 text-teal-200",
        button: "bg-teal-600 hover:bg-teal-700 text-white",
        text: "text-teal-200",
        accent: "text-teal-400",
        label: "text-teal-300",
        slider: "accent-teal-400",
        stats: "bg-gray-800 text-teal-200",
        statsCard: "bg-gray-900",
        statsText: "text-teal-200",
        found: "text-green-400",
        notfound: "text-red-400",
        progressbar: "bg-teal-600"
      }
    : {
        background: "bg-gradient-to-br from-blue-100 to-white",
        card: "bg-white border-teal-300",
        input: "bg-gray-50 border-gray-300 text-black",
        button: "bg-teal-600 hover:bg-teal-700 text-white",
        text: "text-black",
        accent: "text-teal-700",
        label: "text-black",
        slider: "accent-teal-500",
        stats: "bg-gray-100 text-black",
        statsCard: "bg-gray-200",
        statsText: "text-black",
        found: "text-green-700",
        notfound: "text-red-700",
        progressbar: "bg-teal-600"
      };

  // Sample dictionary of common passwords
  const sampleDictionary = `password
  123456
12345678
qwerty
abc123
monkey
1234567
letmein
trustno1
dragon
baseball
111111
iloveyou
master
sunshine
ashley
bailey
passw0rd
shadow
123123
654321
superman
qazwsx
michael
football`;

useEffect(() => {
  if (useSample) {
    setDictionaryText(sampleDictionary);
      processDictionary(sampleDictionary);
    }
  }, [useSample]);

  const processDictionary = (text) => {
    const words = text.split(/[\r\n]+/).filter(word => word.trim() !== "");
    setDictionaryWords(words);
    return words;
  };
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target.result;
      setDictionaryText(text);
      processDictionary(text);
    };
    
    reader.readAsText(file);
  };

  const handleDictionaryTextChange = (e) => {
    const text = e.target.value;
    setDictionaryText(text);
    processDictionary(text);
  };

  const startCracking = () => {
    if (!hash || dictionaryWords.length === 0) return;
    
    setIsRunning(true);
    setResult(null);
    setProgress(0);
    setAttempts(0);
    setElapsedTime(0);
    startTimeRef.current = Date.now();

    // Create blob URL for worker
    const workerCode = `
    self.onmessage = function(e) {
      const { hash, words, hashType } = e.data;
        importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js');
        let found = false;
        let foundPassword = '';
        let attempts = 0;
        function hashString(str, type) {
          switch(type) {
            case 'md5':
              return CryptoJS.MD5(str).toString();
              case 'sha1':
              return CryptoJS.SHA1(str).toString(); 
            case 'sha256':
              return CryptoJS.SHA256(str).toString();
            case 'sha3-256':
                return CryptoJS.SHA3(str, { outputLength: 256 }).toString()
            case 'sha512':
                return CryptoJS.SHA512(str).toString();
            case 'ripemd-160':
                return CryptoJS.RIPEMD160(str).toString();
            default:
              return CryptoJS.MD5(str).toString();
          }
          }
        const totalWords = words.length;
        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          attempts++;
          if (attempts % 10 === 0 || i === words.length - 1) {
            self.postMessage({
              type: 'progress',
              attempts,
              currentAttempt: word,
              progress: Math.round((i / totalWords) * 100)
            });
          }
          const hashedWord = hashString(word, hashType);
          if (hashedWord === hash) {
            found = true;
            self.postMessage({
              type: 'found',
              password: word,
              attempts
            });
            break;
          }
          }
        if (!found) {
          self.postMessage({
            type: 'notFound',
            attempts
          });
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    workerRef.current = new Worker(workerUrl);
    
    workerRef.current.onmessage = (e) => {
      const data = e.data;
      switch(data.type) {
        case 'progress':
          setAttempts(data.attempts);
          setCurrentAttempt(data.currentAttempt);
          setProgress(data.progress);
          break;
        case 'found':
          setResult({
            password: data.password,
            attempts: data.attempts,
            success: true
          });
          stopCracking();
          break;
        case 'notFound':
          setResult({
            success: false,
            attempts: data.attempts
          });
          stopCracking();
          break;
      }
    };
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    workerRef.current.postMessage({
      hash,
      words: dictionaryWords,
      hashType
    });
  };

  const stopCracking = () => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
  };

  // Hash a test password for demo purposes
  const createTestHash = () => {
    // "password" is the 1st word in our sample dictionary
    const testPassword = "password";
    let hashedValue;
    switch(hashType) {
      case 'md5':
        hashedValue = CryptoJS.MD5(testPassword).toString();
        break;
      case 'sha1':
        hashedValue = CryptoJS.SHA1(testPassword).toString();
        break;
      case 'sha256':
        hashedValue = CryptoJS.SHA256(testPassword).toString();
       case 'sha3-256':
         hashedValue = CryptoJS.SHA3(testPassword, { outputLength: 256 }).toString()
       break;
       case 'sha512':
         hashedValue = CryptoJS.SHA512(testPassword).toString();
       break;
       case 'ripemd-160':
         hashedValue = CryptoJS.RIPEMD160(testPassword).toString();
        break;
      default:
        hashedValue = CryptoJS.MD5(testPassword).toString();
    }
    setHash(hashedValue);
  };
  
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };
  
  return (
    <div className={`flex items-center justify-center min-h-screen ${themeClasses.background} ${themeClasses.text} p-5`}>
      <div className={`${themeClasses.card} p-8 rounded-2xl shadow-xl w-full max-w-2xl text-center border`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-2xl font-bold ${themeClasses.accent}`}>Dictionary Password Cracker</h1>
        </div>
        {/* Input for hashed password */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-1 ${themeClasses.label}`}>Hashed Password</label>
          <div className="flex">
            <input
              type="text"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="Enter hash to crack"
              className={`w-full p-2 rounded-l-md text-base border focus:outline-none ${themeClasses.input}`}
              disabled={isRunning}
            />
            <button
              onClick={createTestHash}
              className={`${themeClasses.button} px-3 rounded-r-md transition`}
              disabled={isRunning}
            >
              Demo
            </button>
          </div>
        </div>
        {/* Hash type selection */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-1 ${themeClasses.label}`}>Hash Type</label>
          <select
            value={hashType}
            onChange={(e) => setHashType(e.target.value)}
            className={`w-full p-2 rounded-md text-base border focus:outline-none ${themeClasses.input}`}
            disabled={isRunning}
          >
            <option value="md5">MD5</option>
            <option value="sha1">SHA1</option>
            <option value="sha256">SHA256</option>
            <option value="sha3-256">SHA3-256</option>
            <option value="sha512">SHA512</option>
            <option value="ripemd-160">RIPEMD-160</option>
          </select>
        </div>
        {/* Dictionary input options */}
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>Dictionary Wordlist</label>
          <div className="mb-2 flex items-center">
            <input
              type="checkbox"
              id="useSample"
              checked={useSample}
              onChange={() => setUseSample(!useSample)}
              className="mr-2"
              disabled={isRunning}
            />
            <label htmlFor="useSample">Use sample dictionary</label>
          </div>
          <div className="mb-2">
            <label className={`block text-sm mb-1 ${themeClasses.label}`}>Or upload a wordlist file:</label>
            <input
              type="file"
              onChange={handleFileUpload}
              className={`w-full p-2 text-sm rounded-md ${themeClasses.input}`}
              accept=".txt"
              disabled={isRunning || useSample}
            />
            {selectedFile && <div className="text-xs mt-1 text-gray-400">File: {selectedFile.name}</div>}
          </div>
          <div>
            <label className={`block text-sm mb-1 ${themeClasses.label}`}>Or paste your wordlist below (one word per line):</label>
            <textarea
              value={dictionaryText}
              onChange={handleDictionaryTextChange}
              placeholder="Enter words, one per line"
              className={`w-full p-2 rounded-md text-sm border focus:outline-none h-32 ${themeClasses.input}`}
              disabled={isRunning || useSample}
            />
            <div className="text-xs mt-1 text-gray-400">Words loaded: {dictionaryWords.length}</div>
          </div>
        </div>
        {/* Action buttons */}
        <div className="mb-6">
          {!isRunning ? (
            <button
              onClick={startCracking}
              disabled={!hash || dictionaryWords.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition w-full disabled:opacity-50"
            >
              Start Dictionary Attack
            </button>
          ) : (
            <button
              onClick={stopCracking}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition w-full"
            >
              Stop
            </button>
          )}
        </div>
        {/* Progress display */}
        {isRunning && (
          <div className="mb-4">
            <div className="h-4 w-full bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${themeClasses.progressbar}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span>Current word: {currentAttempt || "..."}</span>
              <span>Progress: {progress}%</span>
            </div>
          </div>
        )}
        {/* Statistics */}
        <div className={`${themeClasses.statsCard} p-4 rounded-md`}>
          <div className="grid grid-cols-2 gap-2 text-sm mb-2">
            <div>Words tried: <span className="font-mono">{attempts.toLocaleString()}</span></div>
            <div>Time: <span className="font-mono">{elapsedTime}s</span></div>
          </div>
          {result && (
            <div className={`mt-2 p-2 rounded ${themeClasses.stats}`}>
              {result.success ? (
                <div className={`font-bold ${themeClasses.found}`}>
                  <div>Password Found!</div>
                  <div className="font-mono text-lg">{result.password}</div>
                  <div className="text-xs mt-1">
                    Found in {result.attempts.toLocaleString()} attempts
                  </div>
                </div>
              ) : (
                <div className={`font-bold ${themeClasses.notfound}`}>
                  Password not found in dictionary after {result.attempts.toLocaleString()} words
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DictionaryCracker;