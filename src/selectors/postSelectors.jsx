export function getPostsForSubreddit(posts, subredditName) {
  return posts.allIds
    .map(id => posts.byId[id])
    .filter(post => post.subreddit === subredditName);
}