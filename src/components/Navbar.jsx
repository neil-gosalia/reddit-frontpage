import SearchBar from "./SearchBar";
import LoginButton from "./LoginButton";
function Navbar({ searchQuery, setSearchQuery, toggleSidebar }) {
  return (
    <nav className="flex items-center gap-4 px-5 py-2 bg-white border border-black sticky top-0 z-10">
      <button className="text-xl md:hidden" onClick={toggleSidebar}>☰</button>
      <img
        src="/logo.svg"
        alt="Logo"
        className="h-9 cursor-pointer"
      />
      <div className="flex flex-1 justify-center">
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
