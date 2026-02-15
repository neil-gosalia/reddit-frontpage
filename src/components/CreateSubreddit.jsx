import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function CreateSubreddit() {
  const { createSubreddit } = useAppContext();
  const navigate = useNavigate();

  const [name, setName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      await createSubreddit(name);
      setName("");
      navigate("/");
    } catch (err) {
      console.error("Failed to create subreddit", err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="create-subreddit">
      <h1>Create Subreddit</h1>

      <input
        type="text"
        placeholder="Subreddit name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="create-subreddit-title"
      />

      <button type="submit" className="create-subreddit-save">Create Subreddit</button>
    </form>
  );
}

export default CreateSubreddit;
