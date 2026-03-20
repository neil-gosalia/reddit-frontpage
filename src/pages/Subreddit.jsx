import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import { slugify } from "../utils/slugify";
import { getPostsForSubreddit } from "../selectors/postSelectors";
import { getSubredditBySlug } from "../selectors/subredditSelector";
import { useAppContext } from "../context/AppContext";

function Subreddit() {
  const { subreddits, posts, deletePost } = useAppContext();
  const { slug } = useParams();

  const currentSubreddit = useMemo(() => {
    return getSubredditBySlug(subreddits, slug);
  }, [subreddits, slug]);

  const postsForSubreddit = useMemo(() => {
    return getPostsForSubreddit(posts, subreddits, slug);
  }, [posts, subreddits, slug]);

  return (
    <div className="w-full bg-white">

      {/* Banner — only renders if there's an image */}
      {currentSubreddit?.banner && (
        <div
          className="w-full h-36 md:h-48 rounded-xl bg-gray-200 bg-cover bg-center mb-4"
          style={{ backgroundImage: `url(${currentSubreddit.banner})` }}
        />
      )}

      {/* Subreddit header */}
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <h2 className="text-xl font-bold text-gray-900 m-0">
          r/{currentSubreddit?.name}
        </h2>
        <Link
          to={`/r/${slug}/submit`}
          className="flex items-center gap-1 px-4 py-1.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-800 hover:bg-gray-100 no-underline"
        >
          ➕ Create Post
        </Link>
      </div>

      {currentSubreddit?.description && (
        <p className="text-sm text-gray-500 mb-4">{currentSubreddit.description}</p>
      )}

      <hr className="border-gray-200 mb-4" />

      {/* Posts */}
      {postsForSubreddit.length === 0
        ? <p className="text-gray-400 text-sm">No posts yet</p>
        : postsForSubreddit.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => console.log("Liked Post", post.id)}
              onDelete={() => deletePost(post.id)}
            />
          ))
      }

    </div>
  );
}

export default Subreddit;
// ```

// You can now also **delete** these from `index.css`:
// ```
// .subreddit-banner
// .subreddit-banner-overlay
// .subreddit-banner-overlay h1
// .subreddit-banner-overlay p
// .create-post-btn
// .create-post-btn:hover