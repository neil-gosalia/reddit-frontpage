import { createContext, useContext, useReducer, useEffect } from "react";

const AppContext = createContext(null);


const initialState = {
  posts: {
    byId: {},
    allIds: []
  },
  subreddits: {
    byId: {},
    allIds: []
  }
};


function appReducer(state, action) {
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
            source: "api",
          }
        allIds.push(id);
        }
      });

      return {
        ...state,
        posts: {
          byId,
          allIds
        }
      };
    }
    case "CREATE_POST": {
      const post = action.payload;

      return {
        ...state,
        posts: {
          byId: {
            ...state.posts.byId,
            [post.id]: post
          },
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
          byId: {
            ...state.subreddits.byId,
            [sub.name]: sub
          },
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
        posts: {
          byId: newPostsById,
          allIds: newPostsAllIds
        },
        subreddits: {
          byId: remainingSubs,
          allIds: state.subreddits.allIds.filter(id => id !== name)
        }
      };
    }

    case "UPVOTE_POST": {
      const id = action.payload;
      const post = state.posts.byId[id];

      return {
        ...state,
        posts: {
          ...state.posts,
          byId: {
            ...state.posts.byId,
            [id]: {
              ...post,
              upvotes: (post.upvotes??0) + 1
            }
          }
        }
      };
    }

    case "DOWNVOTE_POST": {
      const id = action.payload;
      const post = state.posts.byId[id];

      return {
        ...state,
        posts: {
          ...state.posts,
          byId: {
            ...state.posts.byId,
            [id]: {
              ...post,
              upvotes: (post.upvotes??0) - 1
            }
          }
        }
      };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(
    appReducer,
    initialState,
    () => {
      const saved = localStorage.getItem("app_state");
      if (!saved) return initialState;

      try {
        const parsed = JSON.parse(saved);
        return {
          posts: {
            byId: parsed.posts?.byId || {},
            allIds: parsed.posts?.allIds || []
          },
          subreddits: {
            byId: parsed.subreddits?.byId || {},
            allIds: parsed.subreddits?.allIds || []
          }
        };
      } catch {
        return initialState;
      }
    }
  );

  useEffect(() => {
    localStorage.setItem("app_state", JSON.stringify(state));
  }, [state]);
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await res.json();

        dispatch({type: "HYDRATE_POSTS",payload: data.slice(0, 10)});
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    }

    fetchPosts();
  }, []);

  const createPost = post =>
    dispatch({ type: "CREATE_POST", payload: post });

  const deletePost = id =>
    dispatch({ type: "DELETE_POST", payload: id });

  const createSubreddit = sub =>
    dispatch({ type: "CREATE_SUBREDDIT", payload: sub });

  const deleteSubreddit = name =>
    dispatch({ type: "DELETE_SUBREDDIT", payload: name });

  const upvotePost = id =>
    dispatch({type: "UPVOTE_POST",payload: id});

  const downvotePost = id =>
    dispatch({type: "DOWNVOTE_POST",payload: id});
  return (
    <AppContext.Provider
      value={{
        posts: state.posts,
        subreddits: state.subreddits,
        createPost,
        deletePost,
        createSubreddit,
        deleteSubreddit,
        upvotePost,
        downvotePost,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error(
      "useAppContext must be used within an AppProvider"
    );
  }
  return context;
}
