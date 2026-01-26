import { useState } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useAppContext} from "../context/AppContext";

function Sidebar() {
  const { subreddits, deleteSubreddit } = useAppContext();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [recentOpen,setRecentOpen] = useState(false) //for the recent
  const [activeSubreddit, setActiveSubreddit] = useState(null);
  const [removingName, setRemovingName] = useState(null); //because of this,, now two communities can have the same title; but not the same name
  const [pendingDelete, setPendingDelete] = useState(null);
  const [feeds, setFeeds] = useState([
    { id: 1, name: "Feed One", isEditing: false },
    { id: 2, name: "Feed Two", isEditing: false }
  ]);

  function addDivs(){
    setFeeds(prev=>[...prev,{id:Date.now(),name:"New Div",isEditing:false}]);
  }
  function startEditing(id) {
    setFeeds(prev =>
      prev.map(feed =>
        feed.id === id
          ? { ...feed, isEditing: true }
          : feed
      )
    );
  }

  function updateFeed(id, value) {
    setFeeds(prev =>
      prev.map(feed =>
        feed.id === id
          ? { ...feed, name: value }
          : feed
      )
    );
  }

  function stopEditing(id) {
    setFeeds(prev =>
      prev.map(feed =>
        feed.id === id
          ? { ...feed, isEditing: false }
          : feed
      )
    );
  }

  function deleteFeed(id) {
    setFeeds(prev =>
        prev.filter(feed => feed.id !== id)
    );
  }


  return (
    <aside className="sidebar">
        <nav className = "sidebar-nav">
            <Link to="/" className="sidebar-item">🏠 Home</Link>
            <Link to="/r/javascript" className="sidebar-item">🎈 Popular</Link>
            <Link to="/post/123"className="sidebar-item">🌴 Explore</Link>
            <div className="sidebar-item">+ Start a Community</div>
        </nav>
        <hr/>
      <button className="sidebar-toggle" onClick={() => setOpen(!open)}>
        CUSTOM FEEDS
        <span>{setOpen ? "▲" : "▼"}</span> 
      </button>

      {open && (
        <div>
          <button className="sidebar-toggle" onClick={addDivs}>➕ Create Custom Feed</button>
          {feeds.map(feed => (
            <div key={feed.id} className="sidebar-item">
              {feed.isEditing ? (
                <input
                  value={feed.name}
                  onChange={e =>
                    updateFeed(feed.id, e.target.value)
                  }
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      stopEditing(feed.id);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <>
                    <span onClick={() => startEditing(feed.id)}>
                        {feed.name}
                    </span>

                    <button
                        onClick={() => deleteFeed(feed.id)}
                        style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer"
                        }}
                    >
                        ❌
                    </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    <hr/>
    <button className="sidebar-toggle" onClick={()=>setRecentOpen(!recentOpen)}>
        RECENT
            <span>{recentOpen ? "▲" : "▼"}</span>
    </button>
    {recentOpen &&(
        <div className="sidebar-section">
            <div className="sidebar-item">RECENT</div>
        </div>)}
    <hr/>
    <h4>Subreddits</h4>
      {subreddits.allIds.map(id=>{
        const sub = subreddits.byId[id];
        return(
          <div key={sub.name} className={`subreddit-row${
            activeSubreddit===sub.name? ".active":""}${removingName === sub.name ? ".removing" : ""}`}>
            <Link
              to={`/r/${sub.name}`}
              className="subreddit-link"
              onClick={() => setActiveSubreddit(sub.name)}
            >
              <img src={sub.icon} className="subreddit-icon" />
              <span>r/{sub.title}</span>
            </Link>
            <button
              className="subreddit-delete"
              title="Remove subreddit"
              onClick={()=>setPendingDelete(sub)}
            >
              ✕
            </button>
        </div>
        );
      })}
      <Link to="/create-subreddit" className="sidebar-toggle">➕ Create Subreddit</Link>
      {pendingDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Remove r/{pendingDelete.title}?</h3>
            <p>This will remove it from your sidebar.</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={()=>setPendingDelete(null)}>Cancel</button>
              <button className="delete-btn" onClick={() => 
                {setRemovingName(pendingDelete.name);
                setTimeout(() => 
                {deleteSubreddit(pendingDelete.name);
                setPendingDelete(null);
                navigate(`/`)
                }, 200);}}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;