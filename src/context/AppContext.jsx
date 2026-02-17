import { createContext, useContext, useReducer, useEffect } from "react";

const AppContext = createContext(null);
const API_BASE = "https://reddit-frontpage-backend.onrender.com";

const initialState = {
  posts: { byId: {}, allIds: [] },
  subreddits: { byId: {}, allIds: [] },
};

function appReducer(state, action) {
  switch (action.type) {

    case "SET_POSTS": {
      const byId = {};
      const allIds = [];

      action.payload.forEach(post => {
        byId[post.id] = post;
        allIds.push(post.id);
      });

      return {
        ...state,
        posts: { byId, allIds }
      };
    }

    case "SET_SUBREDDITS": {
      const byId = {};
      const allIds = [];

      action.payload.forEach(sub => {
        byId[sub.id] = sub;
        allIds.push(sub.id);
      });

      return {
        ...state,
        subreddits: { byId, allIds }
      };
    }

    case "ADD_POST": {
      const newPost = action.payload;

      return {
        ...state,
        posts: {
          byId: {
            ...state.posts.byId,
            [newPost.id]: newPost,
          },
          allIds: [newPost.id, ...state.posts.allIds],
        },
      };
    }

    case "ADD_SUBREDDIT": {
      const newSub = action.payload;

      return {
        ...state,
        subreddits: {
          byId: {
            ...state.subreddits.byId,
            [newSub.id]: newSub,
          },
          allIds: [newSub.id, ...state.subreddits.allIds],
        },
      };
    }

    case "DELETE_POST": {
      const id = action.payload;

      const { [id]: _, ...remaining } = state.posts.byId;

      return {
        ...state,
        posts: {
          byId: remaining,
          allIds: state.posts.allIds.filter(pid => pid !== id),
        },
      };
    }

    case "DELETE_SUBREDDIT": {
      const id = action.payload;

      const { [id]: _, ...remainingSubs } = state.subreddits.byId;

      return {
        ...state,
        subreddits: {
          byId: remainingSubs,
          allIds: state.subreddits.allIds.filter(sid => sid !== id),
        },
      };
      // 🚀 IMPORTANT:
      // We DO NOT manually delete posts here
      // PostgreSQL handles cascade deletion
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // ---------------- FETCH POSTS ----------------
  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_BASE}/posts`);
      const data = await res.json();
      dispatch({ type: "SET_POSTS", payload: data });
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  // ---------------- CREATE POST ----------------
  const createPost = async (postData) => {
    try {
      console.log("Sending to backend", postData)
      const res = await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const createdPost = await res.json();
      console.log("Backend returned:", createdPost);
      dispatch({ type: "ADD_POST", payload: createdPost });
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  // ---------------- DELETE POST ----------------
  const deletePost = async (id) => {
    try {
      await fetch(`${API_BASE}/posts/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "DELETE_POST", payload: id });
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  // ---------------- FETCH SUBREDDITS ----------------
  const fetchSubreddits = async () => {
    try {
      const res = await fetch(`${API_BASE}/subreddits`);
      const data = await res.json();
      dispatch({ type: "SET_SUBREDDITS", payload: data });
    } catch (err) {
      console.error("Failed to fetch subreddits", err);
    }
  };

  // ---------------- CREATE SUBREDDIT ----------------
  const createSubreddit = async (name) => {
    try {
      const res = await fetch(`${API_BASE}/subreddits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const subreddit = await res.json();
      dispatch({ type: "ADD_SUBREDDIT", payload: subreddit });
    } catch (err) {
      console.error("Failed to create subreddit", err);
    }
  };

  // ---------------- DELETE SUBREDDIT ----------------
  const deleteSubreddit = async (id) => {
    try {
      await fetch(`${API_BASE}/subreddits/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "DELETE_SUBREDDIT", payload: id });
    } catch (err) {
      console.error("Failed to delete subreddit", err);
    }
  };

  // ---------------- INITIAL LOAD ----------------
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
        deletePost,
        deleteSubreddit,
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
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
