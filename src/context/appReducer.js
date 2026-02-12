export const initialState = {
  posts: {
    byId: {},
    allIds: []
  },
  subreddits: {
    byId: {},
    allIds: []
  }
};

export function appReducer(state, action) {
  switch (action.type) {
    case "HYDRATE_POSTS": {
      const apiPosts = action.payload;
      const byId = {...state.posts.byId};
      const allIds = [...state.posts.allIds];
      apiPosts.forEach(post => {
        const id = post.id.toString();
        if (!byId[id]){
          byId[id] = {
            id,
            title: post.title,
            body: post.body,
            subreddit: "home",
            upvotes: 0,
            likes: 0,
            source: "api",
          }
        allIds.push(id);
        }
      });
      return {
        ...state,
        posts: { byId, allIds }
      };
    }
    case "CREATE_POST": {
      const post = action.payload;
      return {
        ...state,
        posts: {
          byId: { ...state.posts.byId, [post.id]: post },
          allIds: [post.id, ...state.posts.allIds]
        }
      };
    }
    case "DELETE_POST": {
      const id = action.payload;
      const { [id]: _, ...rest } = state.posts.byId;
      return {
        ...state,
        posts: {
          byId: rest,
          allIds: state.posts.allIds.filter(pid => pid !== id)
        }
      };
    }
    case "CREATE_SUBREDDIT": {
      const sub = action.payload;
      return {
        ...state,
        subreddits: {
          byId: { ...state.subreddits.byId, [sub.name]: sub },
          allIds: [...state.subreddits.allIds, sub.name]
        }
      };
    }
    case "DELETE_SUBREDDIT": {
      const name = action.payload;
      const { [name]: _, ...remainingSubs } = state.subreddits.byId;
      const newPostsById = {};
      const newPostsAllIds = [];
      state.posts.allIds.forEach(id => {
        const post = state.posts.byId[id];
        if (post.subreddit !== name) {
          newPostsById[id] = post;
          newPostsAllIds.push(id);
        }
      });
      return {
        ...state,
        posts: { byId: newPostsById, allIds: newPostsAllIds },
        subreddits: {
          byId: remainingSubs,
          allIds: state.subreddits.allIds.filter(id => id !== name)
        }
      };
    }
    case "UPVOTE_POST": {
      const id = action.payload;
      const post = state.posts.byId[id];
      if (!post) return state;
      return {
        ...state,
        posts: {
          ...state.posts,
          byId: {
            ...state.posts.byId,
            [id]: { ...post, upvotes: (post.upvotes || 0) + 1 }
          }
        }
      };
    }
    case "DOWNVOTE_POST": {
      const id = action.payload;
      const post = state.posts.byId[id];
      if (!post) return state;
      return {
        ...state,
        posts: {
          ...state.posts,
          byId: {
            ...state.posts.byId,
            [id]: { ...post, upvotes: (post.upvotes || 0) - 1 }
          }
        }
      };
    }
    case "LIKE_POST": {
      const id = action.payload;
      const post = state.posts.byId[id];
      if (!post) return state;
      return {
        ...state,
        posts: {
          ...state.posts,
          byId: {
            ...state.posts.byId,
            [id]: { ...post, likes: (post.likes || 0) + 1 }
          }
        }
      };
    }
    default:
      return state;
  }
}
