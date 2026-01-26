import { useState } from "react"
import { useParams, Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import {useAppContext} from "../context/AppContext";

function Subreddit() {
  const { subreddits, posts, deletePost } = useAppContext();

  const { subreddit } = useParams();
  const postsForSubreddit = posts?.allIds?.map(id=>posts.byId[id]).filter(post=>post.subreddit === subreddit) || [];
  const currentSubreddit = subreddits.byId[subreddit]
  function handleDeletePost(id) {
    deletePost(id);
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
          onDelete={()=> deletePost(post.id)}
        />
      ))}
    </div>
  );
}

export default Subreddit;
