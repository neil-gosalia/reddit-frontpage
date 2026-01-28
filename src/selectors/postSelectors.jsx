export function getPostsForSubreddit(posts, subredditName) {
  return posts.allIds
    .map(id => posts.byId[id])
    .filter(post => post.subreddit === subredditName);
}

export function getPopularPosts(posts){
  return posts.allIds
    .map(id=>posts.byId[id])
    .filter(post => post && post.upvotes >=1)
    .slice()
    .sort((a,b)=>b.upvotes-a.upvotes)
}