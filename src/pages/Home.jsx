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
  <div className="w-full">

    {/* Home Feed Header */}
    <div className="flex items-center gap-3 mb-6">
      <span className="text-2xl">🏠</span>
      <div>
        <h2 className="text-xl font-bold text-gray-900 m-0 leading-tight">Home Feed</h2>
        <p className="text-xs text-gray-400 m-0">Your personalized posts</p>
      </div>
    </div>

    {postList.length === 0 && (
      <p className="text-gray-400 text-sm">No posts yet</p>
    )}

    {postList.map(post => (
      <PostCard key={post.id} post={post} />
    ))}
  </div>
);
}

export default Home;
