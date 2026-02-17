export function getSubredditByName(subreddits, name) {
  if (!subreddits) return null;

  return subreddits.allIds
    .map(id => subreddits.byId[id])
    .find(sub => sub.name === name) || null;
}