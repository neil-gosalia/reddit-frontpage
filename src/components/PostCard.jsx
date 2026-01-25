import {useState, useEffect} from "react"
import PostImage from "./PostImage"

function PostCard({id,post, onLike, onDelete}){
    const savedVote = JSON.parse(localStorage.getItem(`vote-${id}`)) || {count:0, userVote: 0}
    const [voteCount,setVoteCount] = useState(savedVote.count)
    const [userVote, setUserVote] = useState(savedVote.userVote)
    useEffect(()=>{
        localStorage.setItem(`vote-${id}`,JSON.stringify({
            count: voteCount,
            userVote
        }));
    },[voteCount,userVote,id])

    function handleUpvote(){
        if(userVote===1){
            setVoteCount(voteCount-1)
            setUserVote(0)
        }else{
            setVoteCount(voteCount+(userVote===0?1:2))
            setUserVote(1)
        }
    }

    function handleDownvote(){
        if(userVote===-1){
            setVoteCount(voteCount+1)
            setUserVote(0)
        }else{
            setVoteCount(voteCount-(userVote===0?1:2))
            setUserVote(-1)
        }
    }
    return(
        <div className="postcard">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            {post.icon && <PostImage src={post.icon}/>}
            <div className="options">
                <div className="vote-container">
                    <button className={`vote-btn ${userVote===1?"active":""}`} onClick={handleUpvote}>⬆️</button>
                    <div className="vote-count">{voteCount}</div>
                    <button className={`vote-btn ${userVote===-1?"active":""}`} onClick={handleDownvote}>⬇️</button>
                </div>
                <button className="action-btn" onClick={onLike}>👍 Like</button>
                <button className="action-btn" onClick={onDelete}>🗑️ Delete</button>
            </div>
        </div>
    );
}

export default PostCard;