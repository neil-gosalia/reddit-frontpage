import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { slugify } from "../utils/slugify";
import PostImage from "./PostImage";
function CreatePost() {
  const { createPost, subreddits } = useAppContext();
  const { slug } = useParams(); // this is the subreddit name for now
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image,setImage] = useState(null);
  const [imagePreview,setImagePreview] = useState(null);
  // 🔥 Resolve subreddit from URL
  const currentSubreddit = useMemo(() => {
    if (!slug) return null;

    return subreddits.allIds
      .map(id => subreddits.byId[id])
      .find(sub => slugify(sub.name) === slug) || null;

  }, [subreddits, slug]);
  useEffect(() => {
    if (!image) {
      setImagePreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);
  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      console.error("Title and body required");
      return;
    }

    if (!currentSubreddit) {
      console.error("Subreddit not found");
      return;
    }

    try {
      await createPost({
        title,
        body,
        subredditId: currentSubreddit.id,
        image
      });

      // Navigate back to that subreddit page
      navigate(`/r/${slug}`);

      // Reset form
      setTitle("");
      setBody("");
      setImage(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Failed to create post", err);
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
        className="create-post-body"
        placeholder="Post Description" 
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <input type="file" accept="image/*"  id="imageUpload" hidden onChange={(e)=> setImage(e.target.files[0])} />
      <label htmlFor="imageUpload" className="upload-btn">
        <span className="upload-icon">📁 Upload Image</span>
        {imagePreview && (
          <div className="image-preview">
            <PostImage src={imagePreview}/>
          </div>)}
      </label>
      <button type="submit" className="create-post-save">
        Post
      </button>
    </form>
  );
}

export default CreatePost;
