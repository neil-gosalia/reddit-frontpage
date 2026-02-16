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
        byId[sub.id] = sub;
        allIds.push(sub.id)
      })
      return {
        ...state,
        subreddits: {byId,allIds}
      }
    }
    case "ADD_POST":{
      const newPost = action.payload;
      return {
        ...state,
        posts: {
          byId: {
            ...state.posts.byId,
            [newPost.id]: newPost},
          allIds: [newPost.id,...state.posts.allIds],
          }
        }
      };

    case "ADD_SUBREDDIT":{
      const newSub = action.payload;
      return {
        ...state,
        subreddits: {
          byId:{
            ...state.subreddits.byId,
            [newSub.id]: newSub,
          },
          allIds:[newSub.id,...state.subreddits.allIds],
        }
      };
    }
    case "DELETE_POST":{
      const id = action.payload;
      const { [id]: _, ...remainingById } = state.posts.byId;
      return{
        ...state,
          posts:{
            byId: remainingById,
            allIds:state.posts.allIds.filter(postId=>postId !== id)
          }
        }
      }
    case "DELETE_SUBREDDIT": {
      const id = action.payload;
      const { [id]: _, ...remainingSubs } = state.subreddits.byId;
      const filteredPostIds = state.posts.allIds.filter(
        postId => state.posts.byId[postId].subreddit !== id
        );
      const filteredById = {};
      filteredPostIds.forEach(postId => {
        filteredById[postId] = state.posts.byId[postId];
      });
      return {
        ...state,
        subreddits: {
          byId: remainingSubs,
          allIds: state.subreddits.allIds.filter(subId => subId !== id),
        },
        posts: {
          byId: filteredById,
          allIds: filteredPostIds,
        },
      };
    }
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
  const deletePost = async (id)=>{
    try{
      const res = await fetch(`${API_BASE}/posts/${id}`,{method:"DELETE"})
      if(!res.ok) throw new Error("Failed to delete post.");
      dispatch({ type: "DELETE_POST", payload: id });
    }catch(err){
      console.error(err);
    }
  };
  const deleteSubreddit = async (name) => {
    try {
      const res = await fetch(`${API_BASE}/subreddits/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete subreddit");
      dispatch({ type: "DELETE_SUBREDDIT", payload: id });
    } catch (err) {
      console.error(err);
    }
  };
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
        deletePost,
        deleteSubreddit,
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
