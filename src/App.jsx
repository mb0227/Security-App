import { Routes, Route, Link } from "react-router-dom";
import Generator from "./pages/Generator";
import StrengthTester from "./pages/StrengthTester";


function App() {
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-blue-700 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-semibold text-white">Password Toolkit</div>
          <div className="flex space-x-6">
            <Link
              to="/"
              className="text-white hover:text-blue-300 transition duration-200"
            >
              Generator
            </Link>
            <Link
              to="/strength-tester"
              className="text-white hover:text-blue-300 transition duration-200"
            >
              Strength Tester
            </Link>
          </div>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Generator />} />
        <Route path="/strength-tester" element={<StrengthTester />} />
      </Routes>
    </div>
  );
}

export default App;