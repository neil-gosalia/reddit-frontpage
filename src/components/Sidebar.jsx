import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { slugify } from "../utils/slugify";

function Sidebar({ sidebarOpen }) {
  const { subreddits, deleteSubreddit, fetchSubreddits } = useAppContext();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [recentOpen, setRecentOpen] = useState(false);
  const [removingName, setRemovingName] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [feeds, setFeeds] = useState([
    { id: 1, name: "Feed One", isEditing: false },
    { id: 2, name: "Feed Two", isEditing: false },
  ]);

  function addDivs() {
    setFeeds((prev) => [...prev, { id: Date.now(), name: "New Div", isEditing: false }]);
  }

  function startEditing(id) {
    setFeeds((prev) => prev.map((f) => (f.id === id ? { ...f, isEditing: true } : f)));
  }

  function updateFeed(id, value) {
    setFeeds((prev) => prev.map((f) => (f.id === id ? { ...f, name: value } : f)));
  }

  function stopEditing(id) {
    setFeeds((prev) => prev.map((f) => (f.id === id ? { ...f, isEditing: false } : f)));
  }

  function deleteFeed(id) {
    setFeeds((prev) => prev.filter((f) => f.id !== id));
  }

  useEffect(() => {
    const interval = setInterval(fetchSubreddits, 20000);
    return () => clearInterval(interval);
  }, [fetchSubreddits]);

  return (
    <aside className="w-full h-full px-4 py-4">
      {/* Top Nav */}
      <nav className="flex flex-col gap-1">
        <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 no-underline">
          🏠 Home
        </Link>
        <Link to="/popular-posts" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 no-underline">
          🐙 Popular
        </Link>
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 cursor-pointer">
          + Start a Community
        </div>
      </nav>

      <hr className="my-3 border-gray-200" />

      {/* Custom Feeds Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-3 py-2 text-xs font-semibold tracking-widest text-gray-400 hover:bg-gray-100 rounded-lg"
      >
        CUSTOM FEEDS <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-1 flex flex-col gap-1">
          <button
            onClick={addDivs}
            className="w-full flex justify-between items-center px-3 py-2 text-xs text-gray-400 hover:bg-gray-100 rounded-lg"
          >
            ➕ Create Custom Feed
          </button>
          {feeds.map((feed) => (
            <div key={feed.id} className="flex items-center justify-between px-3 py-2 text-sm text-gray-800 rounded-lg hover:bg-gray-100">
              {feed.isEditing ? (
                <input
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                  value={feed.name}
                  onChange={(e) => updateFeed(feed.id, e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && stopEditing(feed.id)}
                  autoFocus
                />
              ) : (
                <>
                  <span onClick={() => startEditing(feed.id)} className="cursor-pointer flex-1">
                    {feed.name}
                  </span>
                  <button onClick={() => deleteFeed(feed.id)} className="text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer ml-2">
                    ❌
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <hr className="my-3 border-gray-200" />

      {/* Recent Toggle */}
      <button
        onClick={() => setRecentOpen(!recentOpen)}
        className="w-full flex justify-between items-center px-3 py-2 text-xs font-semibold tracking-widest text-gray-400 hover:bg-gray-100 rounded-lg"
      >
        RECENT <span>{recentOpen ? "▲" : "▼"}</span>
      </button>

      {recentOpen && (
        <div className="mt-1 px-3 py-2 text-sm text-gray-500">
          No recent communities
        </div>
      )}

      <hr className="my-3 border-gray-200" />

      {/* Subreddits */}
      <h4 className="px-3 text-xs font-semibold tracking-widest text-gray-400 mt-2 mb-1">
        SUBREDDITS
      </h4>

      {(subreddits?.allIds || []).map((id) => {
        const sub = subreddits.byId[id];
        if (!sub) return null;
        const isActive = location.pathname === `/r/${slugify(sub.name)}`;

        return (
          <div
            key={sub.name}
            className={`
              group flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-150
              ${isActive ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"}
              ${removingName === sub.name ? "opacity-0 -translate-x-2 transition-all duration-200" : ""}
            `}
          >
            <Link to={`/r/${slugify(sub.name)}`} className="flex items-center gap-2 flex-1 no-underline text-gray-800 text-sm font-medium">
              <img src={sub.icon} className="w-6 h-6 rounded-full object-cover" />
              <span>r/{sub.name}</span>
            </Link>
            <button
              onClick={() => setPendingDelete(sub)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer text-base transition-opacity duration-150"
            >
              ✕
            </button>
          </div>
        );
      })}

      <Link
        to="/create-subreddit"
        className="flex items-center gap-2 px-3 py-2 mt-2 text-sm text-gray-400 hover:bg-gray-100 rounded-lg no-underline"
      >
        ➕ Create Subreddit
      </Link>

      {/* Delete Modal */}
      {pendingDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-xl p-6 w-[320px] shadow-lg">
            <h3 className="text-base font-semibold mb-1">Remove r/{pendingDelete.name}?</h3>
            <p className="text-sm text-gray-500 mb-4">This will remove it from your sidebar.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPendingDelete(null)}
                className="px-4 py-1.5 rounded-lg bg-gray-100 text-sm hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setRemovingName(pendingDelete.name);
                  setTimeout(() => {
                    deleteSubreddit(pendingDelete.id);
                    setPendingDelete(null);
                    navigate("/");
                  }, 200);
                }}
                className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      
      )}
    </aside>
  );
}

export default Sidebar;
