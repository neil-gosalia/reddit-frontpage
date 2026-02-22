import { useAppContext } from "../context/AppContext";
import { usePollingFetch } from "../hooks/usePollingFetch";
import PostCard from "../components/PostCard";

function Home() {
  const { posts, fetchPosts } = useAppContext();

  usePollingFetch(fetchPosts, 5000);

  const postList = (posts?.allIds || [])
    .map(id => posts.byId[id])
    .filter(Boolean);

  return (
    <div>
      <h2>Home Feed</h2>
      {postList.length === 0 && <p>No posts yet</p>}

      {postList.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default Home;
