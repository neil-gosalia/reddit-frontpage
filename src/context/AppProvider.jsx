import { useReducer, useEffect } from "react";
import { api } from "../services/api";
import { appReducer, initialState } from "./appReducer";
import { AppContext } from "./AppContext";

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
    async function loadData() {
      try {
        const data = await api.fetchPosts();
        dispatch({ type: "HYDRATE_POSTS", payload: data.slice(0, 10) });
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    }

    loadData();
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

  const likePost = id =>
    dispatch({type: "LIKE_POST", payload: id});

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
        likePost,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
