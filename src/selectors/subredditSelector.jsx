import { slugify } from "../utils/slugify";

export function getSubredditBySlug(subreddits, slug) {
  if (!subreddits) return null;

  return subreddits.allIds
    .map(id => subreddits.byId[id])
    .find(sub => slugify(sub.name) === slug) || null;
}