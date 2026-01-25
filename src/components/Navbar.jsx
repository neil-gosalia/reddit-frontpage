import SearchBar from "./SearchBar";
import LoginButton from "./LoginButton";
function Navbar({ searchQuery, setSearchQuery }) {
  return (
    <nav className="navbar">
      <img
        src="/logo.svg"
        alt="Logo"
        className="logo"
      />
      <div className="navbar-center">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      <LoginButton/>
    </nav>
  );
}

export default Navbar;
