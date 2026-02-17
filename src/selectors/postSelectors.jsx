export function getPostsForSubreddit(posts, subreddits, subredditName) {
  if (!posts || !subreddits) return [];

  // Step 1: Find subreddit by name
  const subreddit = subreddits.allIds
    .map(id => subreddits.byId[id])
    .find(sub => sub.name === subredditName);

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