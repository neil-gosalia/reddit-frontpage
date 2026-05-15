import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Subreddit from "./pages/Subreddit";
import Popular from "./pages/Popular";
import CreatePost from "./components/CreatePost";
import CreateSubreddit from "./components/CreateSubreddit";
import ErrorBoundary from "./ErrorBoundary";
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const location = useLocation();
  useEffect(() => {setSidebarOpen(false);
  }, [location.pathname]);

  return (
      <div className="min-h-screen bg-white flex flex-col">

      {/* Navbar - fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <Navbar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Below navbar */}
      <div className="flex pt-[56px] min-h-screen bg-white">

        {/* Sidebar - fixed, starts below navbar */}
        <div className={`
          fixed top-[56px] left-0 z-40
          w-[260px] h-[calc(100vh-56px)]
          bg-white border-r border-gray-200
          overflow-y-auto
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>
          <Sidebar sidebarOpen={sidebarOpen} />
        </div>

        {/* Main content - offset by sidebar width on md+ */}
        <main className="flex-1 md:ml-[260px] bg-white min-h-screen p-6">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/r/:slug" element={<Subreddit />} />
              <Route path="/r/:slug/submit" element={
                <ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/popular-posts" element={<Popular />} />
              <Route path="/create-subreddit" element={
                <ProtectedRoute><CreateSubreddit /></ProtectedRoute>} />
            </Routes>
          </ErrorBoundary>
        </main>

      </div>
    </div> 
  );
}

export default App;
