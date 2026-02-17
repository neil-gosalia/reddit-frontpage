import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Subreddit from "./pages/Subreddit";
import Popular from "./pages/Popular";
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
              <Route path="/r/:slug" element={<Subreddit/>} />
              <Route path="/r/:slug/submit" element={<CreatePost />}/>
              <Route path="/popular-posts" element={<Popular />} />
              <Route path="/create-subreddit" element={<CreateSubreddit />}/>
            </Routes>
          </main>
        </div>
      </ErrorBoundary>
    </>
  );
}

export default App;
