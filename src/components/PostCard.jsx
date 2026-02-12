import {useState, useEffect} from "react"
import { Link } from "react-router-dom";
import PostImage from "./PostImage"
import { useAppContext } from "../context/useAppContext";

function PostCard({post}){
    const savedVote = JSON.parse(localStorage.getItem(`vote-${post.id}`)) || {count:0, userVote: 0}
    const [userVote, setUserVote] = useState(savedVote.userVote)
    useEffect(() => {localStorage.setItem(`vote-${post.id}`,JSON.stringify({ userVote }));
    }, [post.id, userVote]);
    const { upvotePost, downvotePost, deletePost, likePost } = useAppContext();
    function handleUpvote() {
        if (userVote === 1) {
      // remove upvote
            downvotePost(post.id);
            setUserVote(0);
        }else{
            if (userVote === -1) {
                // switching from downvote → upvote
                upvotePost(post.id);
                upvotePost(post.id);
            } else {
                upvotePost(post.id);
            }
            setUserVote(1);
        }
    }

    function handleDownvote() {
        if (userVote === -1) {
        // remove downvote
        upvotePost(post.id);
        setUserVote(0);
        } else {
        if (userVote === 1) {
            // switching from upvote → downvote
            downvotePost(post.id);
            downvotePost(post.id);
        } else {
            downvotePost(post.id);
        }
        setUserVote(-1);
        }
    }
    return(
        <div className="postcard">
            <h3>
                <Link to={`/r/${post.subreddit}/comments/${post.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    {post.title}
                </Link>
            </h3>
            <p>{post.body}</p>
            {post.icon && <PostImage src={post.icon}/>}
            <div className="options">
                <div className="vote-container">
                    <button className={`vote-btn ${userVote===1?"active":""}`} onClick={handleUpvote}>⬆️</button>
                    <div className="vote-count">{post.upvotes}</div>
                    <button className={`vote-btn ${userVote===-1?"active":""}`} onClick={handleDownvote}>⬇️</button>
                </div>
                <button className="action-btn" onClick={() => likePost(post.id)}>
                    👍 Like {post.likes > 0 && <span>({post.likes})</span>}
                </button>
                <button className="action-btn" onClick={()=>deletePost(post.id)}>🗑️ Delete</button>
            </div>
        </div>
    );
}

export default PostCard;