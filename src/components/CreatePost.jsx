import {useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import PostImage from "./PostImage";
import { useAppContext } from "../context/useAppContext";
import { fileToBase64 } from "../utils/fileUtils";

function CreatePost(){
    const { createPost } = useAppContext();
    const { subreddit: subredditFromURL } = useParams(); //stores it as subredditFromURL
    const navigate = useNavigate();

    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [icon,setIcon] = useState(null)
    const [subreddit] = useState(
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
            subreddit,
            upvotes: 0,
        }
        createPost(newpost);
        navigate(`/r/${subreddit}`);
    }
    async function handleIconUpload(e){
        const file = e.target.files[0];
        if (file){
            try {
                const base64 = await fileToBase64(file);
                setIcon(base64);
            } catch (err) {
                console.error("Error converting image", err);
            }
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