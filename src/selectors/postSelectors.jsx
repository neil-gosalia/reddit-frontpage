import { slugify } from "../utils/slugify";

export function getPostsForSubreddit(posts, subreddits, slug) {
  if (!posts || !subreddits) return [];

  // Step 1: Resolve slug → subreddit
  const subreddit = subreddits.allIds
    .map(id => subreddits.byId[id])
    .find(sub => slugify(sub.name) === slug);

  if (!subreddit) return [];

  // Step 2: Filter posts by subreddit_id
  return posts.allIds
    .map(id => posts.byId[id])
    .filter(post => post.subreddit_id === subreddit.id);
}

export function getPopularPosts(posts) {
  return posts.allIds
    .map(id => posts.byId[id])
    .filter(post => post && post.upvotes >= 1)
    .slice()
    .sort((a, b) => b.upvotes - a.upvotes);
}