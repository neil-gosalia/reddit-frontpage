import {useState} from "react";
import { useNavigate } from "react-router-dom";
import PostImage from "./PostImage";
import { useAppContext } from "../context/AppContext";

function CreateSubreddit(){
    const {subreddits,createSubreddit} = useAppContext();
    const [title,setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState(null);
    const [banner,setBanner] = useState(null);
    const navigate = useNavigate();
    function handleSubmit(e) {
        e.preventDefault();
        const cleanName = title.toLowerCase().trim().replace(/\s+/g,"").replace(/[^a-z0-9\s]/g, "")
        const exists = !!subreddits.byId[cleanName];
        const newSubreddit = {
            id:Date.now().toString(),
            name:cleanName,
            title,
            description,
            icon: icon || "/default.svg",
            banner: banner || "/default-banner.jpg"
        };
        if(exists){
            alert("Subreddits Already Exists!");
            return;
        }
        createSubreddit(newSubreddit);
        navigate(`/r/${newSubreddit.name}`)
    }
    function handleIconUpload(e){
        const file = e.target.files[0];
        if (file){
            setIcon(URL.createObjectURL(file))
        }
    }
    function handleBannerUpload(e){
        const file = e.target.files[0];
        if (file){
            setBanner(URL.createObjectURL(file))
        }
    }
    
    return (
        <form onSubmit={handleSubmit} className="create-subreddit">
        <h2>Create Community</h2>

        <input
            className="create-post-title"
            placeholder="Display name (React.js)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
        />
        <textarea
            className="create-post-title"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
        />
        <input type="file" accept="image/*"  id="imageUpload" hidden onChange={handleIconUpload}/>
        <label htmlFor="imageUpload" className="image-upload">
            <span>📷 Upload Icon</span>
            {icon && <PostImage src={icon}/>}
        </label>
        <input type="file" accept="image/*" id="bannerUpload" hidden onChange={handleBannerUpload}/>
        <label htmlFor="bannerUpload" className="image-upload">
            <span>📷 Upload Banner</span>
            {banner && <PostImage src={banner}/>}
        </label>
        <button type="submit" className="create-subreddit-save">Create Subreddit</button>
        </form>
    );
    }

export default CreateSubreddit;
