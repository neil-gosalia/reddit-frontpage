import SearchBar from "./SearchBar";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ searchQuery, setSearchQuery, toggleSidebar }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="flex items-center gap-4 px-5 py-2 bg-white border-b border-gray-200">

      <button className="text-xl md:hidden" onClick={toggleSidebar}>☰</button>

      <img src="/logo.svg" alt="Logo" className="h-9 cursor-pointer" />

      <div className="flex flex-1 justify-center">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {currentUser ? (
        // Logged in — show username + logout
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700 hidden sm:block">
            u/{currentUser.username}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Log Out
          </button>
        </div>
      ) : (
        // Not logged in — show login button
        <Link
          to="/login"
          className="px-4 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors no-underline"
        >
          Log In
        </Link>
      )}

    </nav>
  );
}

export default Navbar;