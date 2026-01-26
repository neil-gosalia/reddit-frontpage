import {useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import PostImage from "./PostImage";
import { useAppContext } from "../context/AppContext";

function CreatePost(){
    const {subreddits, createPost} = useAppContext();
    const {subreddit: subredditFromURL} = useParams(); //stores it as subredditFromURL
    const navigate = useNavigate();

    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [icon,setIcon] = useState(null)
    const [subreddit,setSubreddit] = useState(
        subredditFromURL || ""
    )
    function handleSubmit(e){
        e.preventDefault()
        if(!title.trim() || !body.trim()) return;
        const newpost = {
            id:Date.now().toString(),
            title,
            body,
            icon,
            subreddit}
        
        createPost(newpost);

        navigate(`/r/${subreddit}`);
    }
    function handleIconUpload(e){
        const file = e.target.files[0];
        if (file){
            setIcon(URL.createObjectURL(file))
        }
    }
    return (
        <form onSubmit={handleSubmit} className="create-post">
            <h1>Create Post</h1>
            <input className="create-post-title" type="text" placeholder="Post Title" value={title} onChange={e=>setTitle(e.target.value)}/>
            <textarea className="create-post-title"value={body} placeholder="Post Description" onChange={e=>setBody(e.target.value)}/>
            <input type="file" accept="image/*"  id="imageUpload"hidden onChange={handleIconUpload} />
            <label htmlFor="imageUpload" className="image-upload">
                <span>📷 Upload image</span>
                {icon && <PostImage src={icon}/>}
            </label>
            <button type="submit" className="create-post-save">Post</button>
        </form>
    )
}

export default CreatePost;