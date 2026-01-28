import { useMemo } from "react";
import {useAppContext} from "../context/AppContext"
import { getPopularPosts } from "../selectors/postSelectors";
import PostCard from "../components/PostCard";

function Popular() {
  const { posts } = useAppContext();
  const popularPosts = useMemo(() => {
    return getPopularPosts(posts);
  }, [posts]);
  if (popularPosts.length === 0) {
    return <p>No popular posts yet</p>;
  }
  return (
    <div>
      {popularPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default Popular;