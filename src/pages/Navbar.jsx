import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, setAuth }) => {
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    setAuth(false);
  };

  return (
    <nav className="bg-gradient-to-br from-[#230042] via-[#120026] to-[#1a002a] text-white shadow-lg border-b-4 border-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-extrabold tracking-widest text-[#E5D7FF] drop-shadow-lg">Password Toolkit</Link>
            </div>
          </div>
          <div className="flex">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="px-3 py-2 rounded-md text-base font-semibold hover:bg-purple-900/60 transition">
                  Login
                </Link>
                <Link to="/signup" className="ml-4 px-3 py-2 rounded-md text-base font-semibold hover:bg-purple-900/60 transition">
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="px-3 py-2 rounded-md text-base font-semibold hover:bg-purple-900/60 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;