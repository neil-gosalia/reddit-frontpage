export function getSubredditByName(subreddits, name) {
  return subreddits.byId[name] || null;
}