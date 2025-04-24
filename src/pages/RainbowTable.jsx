import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import useUser from "./hooks/useUser";
import { useThemeContext } from "./contexts/ThemeContext";

// Top 100 common passwords (typically found in password breach datasets)
const commonPasswords = [
    // Short passwords (3-4 chars)
    "123", "pass", "abc", "qwe", "asd", "xyz", "zxc", "111", "000", "abc1", "1a2b",
  
    // Common passwords (4-6 chars)
    "123456", "password", "qwerty", "123123", "111111", "12345", "1234", "dragon",
    "baseball", "football", "letmein", "monkey", "696969", "abc123", "mustang",
    "michael", "shadow", "master", "jennifer", "2000", "654321", "888888",
    "112233", "123321", "hello1", "777777", "donald", "welcome", "iloveyou",
  
    // Medium passwords (6-8 chars)
    "jordan23", "batman", "trustno1", "superman", "harley", "1234567", "fuckme",
    "hunter", "ranger", "thomas", "robert", "soccer", "hockey", "killer", "george",
    "andrew", "charlie", "michelle", "sunshine", "jessica", "pepper", "zxcvbn",
    "qwertyui", "asdfgh", "password1", "summer", "princess", "starwars", "ashley",
    "baseball", "pokemon1", "batman1", "hello123", "freedom", "cheese", "killer1",
    "london1", "daniel1", "fuckyou", "babygirl", "iloveu", "jesus1", "qazxsw",
    "sunshine1", "whatever1", "matrix", "samantha", "cookie", "soccer1", "tigger",
  
    // Longer passwords (8-12+ chars)
    "iloveyou", "princess", "starwars", "whatever", "welcome1", "admin123",
    "monkey123", "qwerty123", "letmein123", "baseball1", "password123", "12341234",
    "football1", "liverpool", "butterfly", "basketball", "abcd1234", "passw0rd",
    "superman1", "qazwsx", "chocolate", "nintendo", "computer", "corvette",
    "danielle", "alexander", "november", "platinum", "metallica", "internet",
    "maverick", "mercedes", "pokemon", "beautiful", "ferrari", "december",
    "victoria", "spiderman", "blahblah", "a1b2c3d4", "benjamin", "qwertyuiop",
    "asdfghjkl", "1qaz2wsx", "password12", "1q2w3e4r", "zaq12wsx", "welcome123",
    "thunder", "rainbow", "master123", "abc123456", "pass1234", "mypass123",
    "letmein1", "dragon123", "happy123", "password01", "adminadmin", "jordan23!",
    "testtest", "login123", "football123", "admin2023", "trustnoone"
  ];
  
// Hash algorithms available
const hashAlgorithms = [
  { id: "md5", name: "MD5", fn: (text) => CryptoJS.MD5(text).toString() },
  { id: "sha1", name: "SHA-1", fn: (text) => CryptoJS.SHA1(text).toString() },
  { id: "sha256", name: "SHA-256", fn: (text) => CryptoJS.SHA256(text).toString() },
  { id: "sha3", name: "SHA-3", fn: (text) => CryptoJS.SHA3(text).toString() },
  { id: "ripemd160", name: "RIPEMD-160", fn: (text) => CryptoJS.RIPEMD160(text).toString() },
  { id: "sha512", name: "SHA-512", fn: (text) => CryptoJS.SHA512(text).toString() }
];

// Generate the rainbow table (all algorithms at once)
function generateRainbowTable(passwordList) {
  const table = {};
  
  passwordList.forEach(pw => {
    table[pw] = {};
    hashAlgorithms.forEach(algo => {
      table[pw][algo.id] = algo.fn(pw);
    });
  });
  
  return table;
}

export default function RainbowTable({ setAuth }) {
  const {theme} = useThemeContext();
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  
  const [visibleAlgorithms, setVisibleAlgorithms] = useState(
    hashAlgorithms.slice(0, 3).map(a => a.id)
  );
  const [rainbowTable, setRainbowTable] = useState({});
  const [loading, setLoading] = useState(true);
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  const [filterLength, setFilterLength] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { user, load, error } = useUser(setAuth);

  if (load) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-teal-100">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p>{error}</p>
        </div>
      </div>
    );
  }


  // Generate the table when component mounts
  useEffect(() => {
    setLoading(true);
    // Use setTimeout to prevent UI freeze with larger tables
    setTimeout(() => {
      const table = generateRainbowTable(commonPasswords);
      setRainbowTable(table);
      setFilteredPasswords(commonPasswords);
      setLoading(false);
    }, 0);
  }, []);

  // Filter passwords when length filter changes
  useEffect(() => {
    if (filterLength === "all") {
      setFilteredPasswords(commonPasswords);
    } else {
      const length = parseInt(filterLength);
      const filtered = commonPasswords.filter(pw => pw.length === length);
      setFilteredPasswords(filtered);
    }
    setCurrentPage(1);
  }, [filterLength]);

  const themeClasses = theme === "dark"
    ? {
        background: "bg-gradient-to-br from-purple-900 to-gray-900",
        card: "bg-gray-900 border-teal-500",
        input: "bg-gray-700 border-gray-600 text-teal-200",
        button: "bg-teal-600 hover:bg-teal-700 text-white",
        altButton: "bg-gray-700 hover:bg-gray-600 text-teal-200",
        text: "text-teal-200",
        accent: "text-teal-400",
        label: "text-teal-300",
        tableHead: "bg-teal-900 text-teal-200",
        tableRow: "bg-gray-800 text-teal-300",
        tableRowAlt: "bg-gray-800/70 text-teal-300",
        found: "text-green-400",
        notfound: "text-red-400",
        checkbox: "accent-teal-500"
      }
    : {
        background: "bg-gradient-to-br from-blue-100 to-white",
        card: "bg-white border-teal-300",
        input: "bg-gray-100 border-gray-300 text-black",
        button: "bg-teal-600 hover:bg-teal-700 text-white",
        altButton: "bg-gray-200 hover:bg-gray-300 text-teal-800",
        text: "text-black",
        accent: "text-teal-700",
        label: "text-black",
        tableHead: "bg-teal-200 text-teal-900",
        tableRow: "bg-gray-100 text-black",
        tableRowAlt: "bg-white text-black",
        found: "text-green-700",
        notfound: "text-red-700",
        checkbox: "accent-teal-700"
      };

  const handleSearch = () => {
    if (!input.trim()) {
      setResult({ found: false, message: "Please enter a password to search" });
      return;
    }

    // Looking up hashes for a given password
    if (rainbowTable[input]) {
      setResult({ 
        found: true, 
        type: "password",
        data: rainbowTable[input]
      });
    } else {
      setResult({ 
        found: false, 
        message: `No entry for password "${input}" in the rainbow table` 
      });
    }
  };

  const toggleAlgorithm = (algoId) => {
    setVisibleAlgorithms(prev => {
      if (prev.includes(algoId)) {
        return prev.filter(id => id !== algoId);
      } else {
        return [...prev, algoId];
      }
    });
  };

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredPasswords.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPasswords.length / itemsPerPage);

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text} flex items-center justify-center p-4`}>
      <div className={`relative ${themeClasses.card} p-6 rounded-2xl shadow-xl w-full max-w-6xl border`}>
        <div className="absolute top-4 right-4">
        </div>
        <h1 className={`text-2xl font-bold mb-3 text-center ${themeClasses.accent}`}>Rainbow Table Demo</h1>
        <p className={`mb-4 text-sm ${themeClasses.label}`}>
          This demo shows how an attacker can use a rainbow table to instantly "crack" password hashes.
          It includes 100 commonly used passwords for educational purposes.
        </p>

        {/* Search controls */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4 items-center">
          <input
            type="text"
            value={input}
            onChange={e => { setInput(e.target.value); setResult(null); }}
            placeholder="Enter password to see hashes"
            className={`w-full p-2 rounded ${themeClasses.input}`}
            autoFocus
          />
          
          <button
            onClick={handleSearch}
            className={`px-4 py-2 rounded ${themeClasses.button}`}
            disabled={loading}
          >
            Get Hashes
          </button>
        </div>

        {/* Results area */}
        {result && (
          <div className="mb-4 p-3 border rounded-lg border-opacity-30 border-teal-500">
            {result.found ? (
              <div>
                <h3 className={`font-bold ${themeClasses.found} mb-2`}>
                  ✅ Hash values for password: <span className="font-mono">{input}</span>
                </h3>
                <div className="grid gap-2">
                  {hashAlgorithms.map(algo => (
                    <div key={algo.id} className="grid grid-cols-12 gap-1 text-xs">
                      <div className="col-span-2 font-semibold">{algo.name}:</div>
                      <div className="col-span-10 font-mono break-all">{result.data[algo.id]}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`font-bold ${themeClasses.notfound}`}>
                ❌ {result.message}
              </div>
            )}
          </div>
        )}

        {/* Algorithm toggles */}
        <div className="mb-3">
          <div className={`mb-2 font-semibold ${themeClasses.accent}`}>Choose hash algorithms to display:</div>
          <div className="flex flex-wrap gap-2">
            {hashAlgorithms.map(algo => (
              <label key={algo.id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleAlgorithms.includes(algo.id)}
                  onChange={() => toggleAlgorithm(algo.id)}
                  className={`mr-1 ${themeClasses.checkbox}`}
                />
                <span className="text-sm mr-3">{algo.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Length filter */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <label className={`mr-2 text-sm ${themeClasses.label}`}>Password length:</label>
            <select
              value={filterLength}
              onChange={e => setFilterLength(e.target.value)}
              className={`p-1 rounded text-sm ${themeClasses.input}`}
            >
              <option value="all">All</option>
              {[...new Set(commonPasswords.map(pw => pw.length))].sort((a, b) => a - b).map(len => (
                <option key={len} value={len}>{len} characters</option>
              ))}
            </select>
          </div>
          
          <div className="text-sm">
            Showing {filteredPasswords.length} passwords
          </div>
        </div>

        {/* Table with pagination */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4">Loading rainbow table...</div>
          ) : (
            <>
              <table className="w-full border-collapse">
                <thead>
                  <tr className={themeClasses.tableHead}>
                    <th className="py-2 px-2 text-left w-24">Password</th>
                    {visibleAlgorithms.map(algoId => {
                      const algo = hashAlgorithms.find(a => a.id === algoId);
                      return (
                        <th key={algoId} className="py-2 px-2 text-left">{algo.name}</th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((pw, index) => (
                    <tr key={pw} className={index % 2 === 0 ? themeClasses.tableRow : themeClasses.tableRowAlt}>
                      <td className="py-1 px-2 font-mono">{pw}</td>
                      {visibleAlgorithms.map(algoId => (
                        <td key={algoId} className="py-1 px-2 font-mono break-all text-xs">
                          {rainbowTable[pw]?.[algoId]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded text-sm ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''} ${themeClasses.altButton}`}
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded text-sm ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''} ${themeClasses.altButton}`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 text-xs text-center">
          <b className={themeClasses.accent}>Cybersecurity Best Practices:</b><br />
          <ul className="list-disc list-inside text-left mt-2 space-y-1">
            <li>Rainbow tables can instantly crack weak passwords</li>
            <li>Modern systems use <b>salted hashes</b> to defend against rainbow table attacks</li>
            <li>Always use long, random passwords (12+ characters) with mixed character types</li>
            <li>Use a password manager to create and store strong unique passwords</li>
          </ul>
        </div>
      </div>
    </div>
  );
}