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

  const createPost = post =>
    dispatch({ type: "CREATE_POST", payload: post });

  const deletePost = id =>
    dispatch({ type: "DELETE_POST", payload: id });

  const createSubreddit = sub =>
    dispatch({ type: "CREATE_SUBREDDIT", payload: sub });

  const deleteSubreddit = name =>
    dispatch({ type: "DELETE_SUBREDDIT", payload: name });

  return (
    <AppContext.Provider
      value={{
        posts: state.posts,
        subreddits: state.subreddits,
        createPost,
        deletePost,
        createSubreddit,
        deleteSubreddit
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
