import { createContext, useContext, useReducer, useEffect, useCallback } from "react";

const AppContext = createContext(null);
const API_BASE = "https://reddit-frontpage-backend.onrender.com";

const initialState = {
  posts: { byId: {}, allIds: [], loading: false, error: null },
  subreddits: { byId: {}, allIds: [], loading: false, error: null },
};

function appReducer(state, action) {
  switch (action.type) {
    case "FETCH_POSTS_START": 
        return {
          ...state,
          posts:{
            ...state.posts,
            loading: true,
            error: null
          },
        };

    case "FETCH_POSTS_SUCCESS":{
      const byId = {};
      const allIds = [];
      action.payload.forEach(post=>{
        byId[post.id] = post;
        allIds.push(post.id);
      });
      return {
        ...state,
        posts:{
          byId,
          allIds,
          loading: false,
          error: null,
        }
      }
    }
    case "FETCH_POSTS_ERROR":
      return{
        ...state,
        posts: {
          ...state.posts,
          loading: false,
          error: action.payload,
        },
      };
    case "FETCH_SUBREDDITS_START":
      return {
        ...state,
        subreddits:{
          ...state.subreddits,
          loading: true,
          error: null,
        }
      };
    
    case "FETCH_SUBREDDITS_SUCCESS":{
      const byId = {};
      const allIds = [];
      action.payload.forEach(sub=>{
        byId[sub.id] = sub;
        allIds.push(sub.id);
      });
      return {
        ...state,
        subreddits:{
          byId,
          allIds,
          loading: false,
          error: null
        }
      }
    }

    case "FETCH_SUBREDDITS_ERROR":
      return {
        ...state,
        subreddits:{
          ...state.subreddits,
          loading: false,
          error: action.payload,
        }
      }
    case "ADD_POST": {
      const newPost = action.payload;

      return {
        ...state,
        posts: {
          ...state.posts,
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
          ...state.posts,
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
  const fetchPosts = useCallback(async (silent=false) => {
    if(!silent){
      dispatch({type: "FETCH_POSTS_START"});
    };
    try {
      const res = await fetch(`${API_BASE}/posts`);
      const data = await res.json();
      dispatch({ type: "FETCH_POSTS_SUCCESS", payload: data });
    } catch (err) {
      dispatch({
        type: "FETCH_POSTS_ERROR",
        payload: "Failed to fetch posts"
      })
    }
  },[]);

  // ---------------- CREATE POST ----------------
  const createPost = async ({ title, body, subredditId, image }) => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("body", body);
    formData.append("subredditId", subredditId);

    if (image) {
      formData.append("image", image);
    }

    const res = await fetch(`${API_BASE}/posts`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to create post");
    }

    dispatch({ type: "ADD_POST", payload: data });
    return data;
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
  const fetchSubreddits = useCallback(async (silent=false) => {
      dispatch({type:"FETCH_SUBREDDITS_START"});
    try {
      const res = await fetch(`${API_BASE}/subreddits`);
      const data = await res.json();
      dispatch({ type: "FETCH_SUBREDDITS_SUCCESS", payload: data });
    } catch (err) {
      dispatch({
        type:"FETCH_SUBREDDITS_ERROR",
        payload: "Failed to fetch subreddits",
      })
    }
  },[]);

  // ---------------- CREATE SUBREDDIT ----------------
  const createSubreddit = async (name,iconFile,bannerFile) => {
    try {
      const formData = new FormData();
      formData.append("name",name);
      formData.append("icon",iconFile);
      formData.append("banner",bannerFile);
      const res = await fetch(`${API_BASE}/subreddits`, {
        method: "POST",
        body: formData
      });
      const subreddit = await res.json();
      if(!res.ok){
        throw new Error(subreddit.error || "Failed to create subreddit.")
      }
      dispatch({ type: "ADD_SUBREDDIT", payload: subreddit });
      return subreddit;
    }catch (err) {
      console.error("Failed to create subreddit", err);
      throw err;
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
  }, [fetchPosts]);
  useEffect(() => {
    fetchSubreddits();
  }, [fetchSubreddits]);

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
