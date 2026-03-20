function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full border border-orange-500 w-full max-w-md">
      <input
        type="text"
        className="bg-transparent outline-none w-full text-sm"
        placeholder="Search Reddit"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
