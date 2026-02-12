const API_BASE_URL = "https://jsonplaceholder.typicode.com";

export const api = {
  fetchPosts: async () => {
    const res = await fetch(`${API_BASE_URL}/posts`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  },

  createPost: async (post) => {
    // In a real app, this would be a POST request
    // return fetch(`${API_BASE_URL}/posts`, {
    //   method: 'POST',
    //   body: JSON.stringify(post),
    //   headers: { 'Content-type': 'application/json; charset=UTF-8' }
    // }).then(res => res.json());
    return post;
  },

  deletePost: async (id) => {
    // return fetch(`${API_BASE_URL}/posts/${id}`, { method: 'DELETE' });
    return id;
  },

  likePost: async (id) => {
    // return fetch(`${API_BASE_URL}/posts/${id}/like`, { method: 'POST' });
    return id;
  }
};
