import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { slugify } from "../utils/slugify";

function CreateSubreddit() {
  const { createSubreddit } = useAppContext();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState(null);
  const [banner, setBanner] = useState(null);
  const [error, setError] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  useEffect(() => {
    if (!icon) { setIconPreview(null); return; }
    const url = URL.createObjectURL(icon);
    setIconPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [icon]);

  useEffect(() => {
    if (!banner) { setBannerPreview(null); return; }
    const url = URL.createObjectURL(banner);
    setBannerPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [banner]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !icon || !banner) {
      setError("Name, icon, and banner are required.");
      return;
    }
    try {
      const slug = slugify(name);
      await createSubreddit(name, icon, banner);
      setName(""); setIcon(null); setBanner(null); setError(null);
      navigate(`/r/${slug}`);
    } catch (err) {
      console.error("Failed to create subreddit", err);
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Create Subreddit</h1>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Name input */}
        <input
          type="text"
          placeholder="Subreddit name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Icon upload */}
        <label
          htmlFor="iconUpload"
          className="w-full min-h-[120px] flex flex-col items-center justify-center 
            border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer 
            hover:border-gray-500 hover:bg-gray-50 
            active:scale-95 active:border-orange-400 active:bg-orange-50
            transition-all duration-150 overflow-hidden"
        >
          {iconPreview ? (
            <img src={iconPreview} alt="Icon Preview" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <span className="text-base font-semibold text-gray-500">📁 Upload Icon</span>
          )}
        </label>
        <input id="iconUpload" type="file" accept="image/*" onChange={(e) => setIcon(e.target.files[0])} hidden />


        {/* Banner upload */}
        <label
          htmlFor="bannerUpload"
          className="w-full min-h-[120px] flex flex-col items-center justify-center 
            border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer 
            hover:border-gray-500 hover:bg-gray-50 
            active:scale-95 active:border-orange-400 active:bg-orange-50
            transition-all duration-150 overflow-hidden"
        >
          {bannerPreview ? (
            <img src={bannerPreview} alt="Banner Preview" className="w-full h-36 object-cover rounded-xl" />
          ) : (
            <span className="text-base font-semibold text-gray-500">📁 Upload Banner</span>
          )}
        </label>
        <input id="bannerUpload" type="file" accept="image/*" onChange={(e) => setBanner(e.target.files[0])} hidden />

        {/* Submit button */}
        <button
          type="submit"
            className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm
              active:scale-95 active:brightness-90 transition-all duration-150"
        >
          Create Subreddit
        </button>

      </form>
    </div>
  );
}

export default CreateSubreddit;
// ```

// You can now delete from `index.css`:
// ```
// .create-subreddit, .create-subreddit-title, .create-subreddit-save, 
// .create-subreddit-save:hover, .subreddit-upload-section, 
// .subreddit-upload-box, .subreddit-upload-text, .subreddit-icon-preview, 
// .subreddit-banner-preview, .upload-container