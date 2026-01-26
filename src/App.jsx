import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Subreddit from "./pages/Subreddit";
import Post from "./pages/Post";
import CreatePost from "./components/CreatePost";
import CreateSubreddit from "./components/CreateSubreddit";
import ErrorBoundary from "./ErrorBoundary";

function App() {

  return (
    <>
      <Navbar />
      <ErrorBoundary>
        <div className="layout">
          <Sidebar/>
          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/r/:subreddit" element={<Subreddit/>} />
              <Route path="/r/:subreddit/submit" element={<CreatePost />}/>
              <Route path="/post/:id" element={<Post />} />
              <Route path="/create-subreddit" element={<CreateSubreddit />}/>
            </Routes>
          </main>
        </div>
      </ErrorBoundary>
    </>
  );
}

export default App;
