import {useState,useEffect} from "react";
import PostCard from "../components/PostCard"

function Home() {
  const [posts,setPosts] = useState([])
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState(null)

  function deletePost(id){
    setPosts(prev=>
      prev.filter(post => post.id !== id)
    )
  }
  
  useEffect(()=>{
    async function fetchPosts() {
      try{
        setLoading(true);
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );
        if (!response.ok){
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data.slice(0,10));
      } catch (err){
        setError(err.message);
      } finally{
        setLoading(false);
      }
    }
    fetchPosts();
  },[]);
  if(loading){
    return <p>Loading Posts...</p>
  }
  if(error){
    return<p>Error: {error}</p>
  }
  return (
    <div>
      <h2>Home Feed</h2>
      {posts.map(post => (
        <PostCard 
        key={post.id} 
        id={post.id}
        title={post.title} 
        body={post.body} 
        onLike={()=> console.log("Liked Post", post.id)}
        onDelete={()=> deletePost(post.id)}
        />
      ))}
    </div>
  )
}
export default Home;