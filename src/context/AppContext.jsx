import { createContext, useContext, useReducer, useEffect } from "react";

const AppContext = createContext(null);
const API_BASE = "https://reddit-frontpage-backend.onrender.com";

const initialState = {
  posts: [],
  subreddits: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_POSTS":
      const byId = {};
      const allIds = [];
      action.payload.forEach(post=>{
        byId[post.id] = post;
        allIds.push(post.id);
      })
      return {
        ...state,
        posts: {byId,allIds}
      };

    case "SET_SUBREDDITS":{
      const byId = {};
      const allIds = [];
      action.payload.forEach(sub=>{
        byId[sub.name] = sub;
        allIds.push(sub.name)
      })
      return {
        ...state,
        subreddits: {byId,allIds}
      }
    }
    case "ADD_POST":
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };

    case "ADD_SUBREDDIT":
      return {
        ...state,
        subreddits: [...state.subreddits, action.payload],
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_BASE}/posts`);
      const data = await res.json();
      dispatch({ type: "SET_POSTS", payload: data });
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  const createPost = async (postData) => {
    const res = await fetch(`${API_BASE}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });

    const createdPost = await res.json();
    dispatch({ type: "ADD_POST", payload: createdPost });
  };

  const fetchSubreddits = async () => {
    try {
      const res = await fetch(`${API_BASE}/subreddits`);
      const data = await res.json();
      dispatch({ type: "SET_SUBREDDITS", payload: data });
    } catch (err) {
      console.error("Failed to fetch subreddits", err);
    }
  };

  const createSubreddit = async (name) => {
    const res = await fetch(`${API_BASE}/subreddits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const subreddit = await res.json();
    dispatch({ type: "ADD_SUBREDDIT", payload: subreddit });
  };

  // -------- INITIAL LOAD --------
  useEffect(() => {
    fetchPosts();
    fetchSubreddits();
  }, []);

  return (
    <AppContext.Provider
      value={{
        posts: state.posts,
        subreddits: state.subreddits,
        createPost,
        createSubreddit,
        fetchPosts,
        fetchSubreddits,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
