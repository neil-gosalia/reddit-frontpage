import {useParams} from "react-router-dom";

function Post(){
    const {id} = useParams();
    return <h2>Post ID:/</h2>
}

export default Post;