import { useState, useEffect } from "react";
import PostImage from "./PostImage";
import { useAppContext } from "../context/AppContext";

function PostCard({ post }) {
  const [userVote, setUserVote] = useState(0);

  const {votePost, deletePost } = useAppContext();

  function handleUpvote() {
    if (userVote === 1)       { votePost(post.id, -1); setUserVote(0);  } // undo
    else if (userVote === -1) { votePost(post.id, 2);  setUserVote(1);  } // switch
    else                      { votePost(post.id, 1);  setUserVote(1);  } // fresh
  }

  function handleDownvote() {
    if (userVote === -1)      { votePost(post.id, 1);  setUserVote(0);  } // undo
    else if (userVote === 1)  { votePost(post.id, -2); setUserVote(-1); } // switch
    else                      { votePost(post.id, -1); setUserVote(-1); } // fresh
  }

  return (
    <div className="w-full bg-gray-100 rounded-lg border border-gray-300 p-4 mb-3">

      <h3 className="text-base font-semibold text-gray-900 mb-1">{post.title}</h3>
      <p className="text-sm text-gray-700 mb-2">{post.body}</p>

      {post.image && (
        <div className="w-full mb-3">
          <PostImage src={post.image} />
        </div>
      )}

      {/* Actions row */}
      <div className="flex flex-wrap items-center gap-2 mt-2">

        {/* Vote container */}
        <div className="flex items-center rounded-full bg-gray-200 h-8">
          <button
            onClick={handleUpvote}
            className={`px-2 h-8 rounded-full border-none cursor-pointer transition-colors
              ${userVote === 1 ? "bg-orange-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
          >
            ⬆️
          </button>
          <span className="px-2 text-sm font-medium bg-gray-200">{post.upvotes}</span>
          <button
            onClick={handleDownvote}
            className={`px-2 h-8 rounded-full border-none cursor-pointer transition-colors
              ${userVote === -1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
          >
            ⬇️
          </button>
        </div>

        <button
          onClick={() => console.log("Liked Post", post.id)}
          className="h-8 px-3 rounded-full text-sm bg-gray-200 hover:bg-gray-300 border-none cursor-pointer"
        >
          👍 Like
        </button>

        <button
          onClick={() => deletePost(post.id)}
          className="h-8 px-3 rounded-full text-sm bg-gray-200 hover:bg-gray-300 border-none cursor-pointer"
        >
          🗑️ Delete
        </button>

      </div>
    </div>
  );
}

export default PostCard;
// ```

// Now in `index.css` you can **delete** these classes:
// ```
// .postcard, .options, .vote-container, .vote-btn, .vote-btn:active, .vote-count, .action-btn, .action-btn:hover