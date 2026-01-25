function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search Reddit"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
