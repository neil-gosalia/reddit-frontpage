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
  const [iconPreview,setIconPreview] = useState(null);
  const [bannerPreview,setBannerPreview] = useState(null);
  useEffect(() => {
    if (!icon) {
      setIconPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(icon);
    setIconPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [icon]);

  useEffect(() => {
    if (!banner) {
      setBannerPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(banner);
    setBannerPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [banner]);
  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !icon || !banner){
      setError("Name, icon, and banner are required.");
      return;
    }

    try {
      const slug = slugify(name);
      const createdSub = await createSubreddit(name, icon, banner);
      setName("");
      setIcon(null);
      setBanner(null);
      setError(null);
      navigate(`/r/${slug}`);
    } catch (err) {
      console.error("Failed to create subreddit", err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="create-subreddit">
      <h1>Create Subreddit</h1>
      {error && <p style={{color: "red"}}>{error}</p>}

      <input
        type="text"
        placeholder="Subreddit name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="create-subreddit-title"
      />
      <div className="subreddit-upload-section">
        <label htmlFor="iconUpload" className="subreddit-upload-box subreddit-icon-box">
          {iconPreview?(
            <img src={iconPreview} alt="Icon Preview" className="subreddit-icon-preview"/>
          ):(
            <span className="subreddit-upload-text"> 📁 Upload Icon</span>
          )}
        </label>
        <input
          id="iconUpload"
          type="file"
          accept="image/*"
          onChange={(e)=>setIcon(e.target.files[0])}
          hidden
        />
      </div>
      <div className="upload-container">
        <label htmlFor="bannerUpload" className="subreddit-upload-box subreddit-banner-box">
          {bannerPreview?(
            <img src={bannerPreview} alt="Banner Preview" className="subreddit-banner-preview"/>
          ):(
            <span className="subreddit-upload-text">📁 Upload Banner</span>
          )}
        </label>
        <input
          id="bannerUpload"
          type="file"
          accept="image/*"
          onChange={(e)=>setBanner(e.target.files[0])}
          hidden
          />
      </div>
      <button type="submit" className="create-subreddit-save">Create Subreddit</button>
    </form>
  );
}

export default CreateSubreddit;
