import { useParams } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";
import PostImage from "../components/PostImage";

function Post() {
  const { id } = useParams();
  const { posts } = useAppContext();

  const post = posts.byId[id];

  if (!post) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Post not found</h2>
        <p>The post you are looking for does not exist or has been deleted.</p>
      </div>
    );
  }

  return (
    <div className="post-detail">
      <div className="subreddit-info" style={{ marginBottom: "1rem", color: "#787c7e", fontSize: "0.8rem" }}>
        r/{post.subreddit} • Posted by {post.source === "api" ? "system" : "u/user"}
      </div>
      <h1 style={{ marginBottom: "1rem" }}>{post.title}</h1>
      <p style={{ fontSize: "1.1rem", lineHeight: "1.5", marginBottom: "1.5rem" }}>
        {post.body}
      </p>
      {post.icon && (
        <div style={{ marginBottom: "1.5rem", background: "#f6f7f8", borderRadius: "4px", padding: "1rem", textAlign: "center" }}>
          <PostImage src={post.icon} />
        </div>
      )}
      <div className="post-stats" style={{ paddingTop: "1rem", borderTop: "1px solid #edeff1" }}>
        <span>{post.upvotes || 0} Upvotes</span>
      </div>
    </div>
  );
}

export default Post;