import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { slugify } from "../utils/slugify";
import PostImage from "./PostImage";

function CreatePost() {
  const { createPost, subreddits } = useAppContext();
  const { slug } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const currentSubreddit = useMemo(() => {
    if (!slug) return null;
    return subreddits.allIds
      .map(id => subreddits.byId[id])
      .find(sub => slugify(sub.name) === slug) || null;
  }, [subreddits, slug]);

  useEffect(() => {
    if (!image) { setImagePreview(null); return; }
    const url = URL.createObjectURL(image);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) { console.error("Title and body required"); return; }
    if (!currentSubreddit) { console.error("Subreddit not found"); return; }
    try {
      await createPost({ title, body, subredditId: currentSubreddit.id, image });
      navigate(`/r/${slug}`);
      setTitle(""); setBody(""); setImage(null); setImagePreview(null);
    } catch (err) {
      console.error("Failed to create post", err);
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Create Post</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <textarea
          placeholder="Post Description"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full min-h-[140px] px-4 py-3 rounded-2xl border border-gray-300 text-sm resize-vertical focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Upload Image - same style as CreateSubreddit uploads */}
        <input type="file" accept="image/*" id="imageUpload" hidden onChange={(e) => setImage(e.target.files[0])} />
        <label
          htmlFor="imageUpload"
          className="w-full min-h-[120px] flex flex-col items-center justify-center 
            border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer 
            hover:border-gray-500 hover:bg-gray-50 
            active:scale-95 active:border-orange-400 active:bg-orange-50
            transition-all duration-150 overflow-hidden"
        >
          {imagePreview ? (
            <PostImage src={imagePreview} />
          ) : (
            <span className="text-base font-semibold text-gray-500">📁 Upload Image</span>
          )}
        </label>

        {/* Post button - same style as Create Subreddit button */}
        <button
          type="submit"
            className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm
              active:scale-95 active:brightness-90 transition-all duration-150">
          Post
        </button>

      </form>
    </div>
  );
}

export default CreatePost;