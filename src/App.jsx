import { Routes, Route } from "react-router-dom";
import {useEffect, useState} from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import PostCard from "./components/PostCard";
import Home from "./pages/Home";
import Subreddit from "./pages/Subreddit";
import Post from "./pages/Post";
import CreatePost from "./components/CreatePost";
import CreateSubreddit from "./components/CreateSubreddit";
import ErrorBoundary from "./ErrorBoundary";

function App() {
  const [subreddits,setSubreddits] = useState(()=>{
    const saved = localStorage.getItem("subreddits");
    return saved
    ? JSON.parse(saved)
    :
      [
      {id: "react",name:"reactjs",title:"React.js",description:"A Community for Developers Learning React",icon:"/react.svg",banner:"/default-banner.jpg"},
      {id: "f1",name:"formula1",title:"Formula 1",description:"All Things Formula 1",icon:"/f1.svg",banner:"/default-banner.jpg"},
      {id: "travel",name:"travel",title:"Travel",description:"Every Corner Around the Globe.",icon:"/travel.svg",banner:"/default-banner.jpg"}
    ]});

  const [posts,setPosts] = useState(()=>{
    const saved = localStorage.getItem("posts_normalized");
    if (!saved) {
      return { byId: {}, allIds: [] };
    }

    const parsed = JSON.parse(saved);

    return {
      byId: parsed.byId || {},
      allIds: parsed.allIds || []
    };
  })
  const [subredditsNormalized,setSubredditsNormalized] = useState(()=>{
    const saved = localStorage.getItem("subreddits_normalized");
    if (!saved){
      return {byId:{},allIds:[]};
    }
    const parsed = JSON.parse(saved);
    return{
      byId: parsed.byId || {},
      allIds: parsed.allIds || []
    };
  })
  const [postsBySubreddit,setPostsBySubreddit] = useState(()=>{
    const saved = localStorage.getItem("postsBySubreddit");
    return saved?
    JSON.parse(saved):{
    reactjs:[
      {
        id: "r1",
        title: "React is component-based",
        body: "Components make UI reusable."
      },
      {
        id: "r2",
        title: "State drives UI",
        body: "When state changes, UI updates."
      }
    ],
    formula1: [],
    travel: []
  }});

  useEffect(()=>{
    if (posts.allIds.length>0) return;
      const migrated = {byId:{},allIds:[]};
      Object.entries(postsBySubreddit).forEach(([subredditName,subredditPosts])=>{
        subredditPosts.forEach(post=>{
          migrated.byId[post.id] = {
            ...post, subreddit: subredditName
          };
          migrated.allIds.push(post.id)
        });
      });
    setPosts(migrated);
    },[])

  useEffect(()=>{
    if (subredditsNormalized.allIds.length>0) return;
      const migrated = {byId:{},allIds:[]};
      subreddits.forEach(sub=>{
        migrated.byId[sub.name] = sub;
        migrated.allIds.push(sub.name);
      })
    setSubredditsNormalized(migrated);
    },[])

  useEffect(()=>{
    localStorage.setItem("subreddits",JSON.stringify(subreddits))
  },[subreddits])

  useEffect(()=>{
    localStorage.setItem("posts_normalized",JSON.stringify(posts));
  },[posts])

  useEffect(()=>{
    localStorage.setItem("subreddits_normalized",JSON.stringify(subredditsNormalized));
  },[subredditsNormalized])
  
  function addPost(post ){
    setPosts(prev=>({
      byId:{
        ...prev.byId,
        [post.id]:post
      },
      allIds:[post.id,...prev.allIds]
    }));
  }
  function addSubreddit(newSub){
    setSubredditsNormalized(prev=>({
      byId:{...prev.byId,[newSub.name]: newSub},
      allIds:[...prev.allIds,newSub.name]
    }));
  }
  function deleteSubreddit(name) {
    setSubreddits(prev =>
      prev.filter(sub => sub.name !== name)
    );
    setSubredditsNormalized(prev=>{
      const {[name]: _,...rest} = prev.byId;
      return{
        byId: rest,
        allIds: prev.allIds.filter(id => id !== name)
      }
    })
    setPosts(prev=>{
      const remainingIds = prev.allIds.filter(
        id=>prev.byId[id].subreddit !== name
      );
      const remainingById = {};
      remainingIds.forEach(id=>{
        remainingById[id] = prev.byId[id];
      });
      return{
        byId: remainingById,
        allIds: remainingIds,
      }
  })}

  function deletePost(id) {
    setPosts(prev => {
      const { [id]: _, ...rest } = prev.byId;
      return {
        byId: rest,
        allIds: prev.allIds.filter(pid => pid !== id)
      };
    })};



  return (
    <>
      <Navbar />
      <ErrorBoundary>
        <div className="layout">
          <Sidebar subreddits={subredditsNormalized} onDeleteSubreddit={deleteSubreddit}/>
          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/r/:subreddit" element={<Subreddit subreddits={subredditsNormalized} posts={posts} onDeletePost={deletePost}/>} />
              <Route path="/r/:subreddit/submit" element={<CreatePost subreddits={subredditsNormalized} onCreatePost={addPost}/>}/>
              <Route path="/post/:id" element={<Post />} />
              <Route path="/create-subreddit" element={<CreateSubreddit subreddits={subredditsNormalized} onCreateSubreddit={addSubreddit}/>}/>
            </Routes>
          </main>
        </div>
      </ErrorBoundary>
    </>
  );
}

export default App;
