import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function CreatePost() {
  const { createPost } = useAppContext();
  const { subreddit: subredditFromURL } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [subreddit, setSubreddit] = useState(subredditFromURL || "");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await createPost({
        title,
        body,
        subreddit,
      });

      navigate("/");
      setTitle("");
      setBody("");
      setSubreddit("");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="create-post">
      <h1>Create Post</h1>

      <input
        className="create-post-title"
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="create-post-title"
        value={body}
        placeholder="Post Description"
        onChange={(e) => setBody(e.target.value)}
      />

      <button type="submit" className="create-post-save">
        Post
      </button>
    </form>
  );
}

export default CreatePost;
