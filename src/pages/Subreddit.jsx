import { useState } from "react"
import { useParams, Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";

function Subreddit({ subreddits, posts, onDeletePost }) {
  const { subreddit } = useParams();
  const postsForSubreddit = posts?.allIds?.map(id=>posts.byId[id]).filter(post=>post.subreddit === subreddit) || [];
  const currentSubreddit = subreddits.byId[subreddit]
  function handleDeletePost(id) {
    onDeletePost(id);
  }

  return (
    <div>
      <div>
        <div className="subreddit-banner" style={{backgroundImage: `url(${currentSubreddit?.banner})`}}>
        </div>
        <div style={{display:"flex",alignItems:"center"}}>
          <h2>r/{currentSubreddit?.title}</h2>
          <Link className="create-post-btn" to={`/r/${subreddit}/submit`}>➕ Create Post</Link>
        </div>
          <p>{currentSubreddit?.description}</p>
      </div>

      {postsForSubreddit.length === 0 && <p>No posts yet</p>}

      {postsForSubreddit.map(post => (
        <PostCard
          key={post.id}
          post = {post}
          onLike={()=> console.log("Liked Post", post.id)}
          onDelete={()=> handleDeletePost(post.id)}
        />
      ))}
    </div>
  );
}

export default Subreddit;
