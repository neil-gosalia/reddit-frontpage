import { createContext, useContext, useState} from "react";

const AuthContext = createContext(null);
const API_BASE = "https://reddit-frontpage-backend.onrender.com";

export function AuthProvider({ children }){
    const [currentUser, setCurrentUser] = useState(()=>{
        const stored = localStorage.getItem("user")
        return stored?JSON.parse(stored):null;
    });
    const [token,setToken] = useState(()=>{
        return localStorage.getItem("token") || null;
    });
    async function signup(username, email, password){
        const res = await fetch(`${API_BASE}/auth/register`,{
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({username, email, password})
        });
        const data = await res.json()
        if (!res.ok) throw new Error(data.error||"Failed to regiter")
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        setToken(data.token)
        setCurrentUser(data.user)
        return data;
    }
    async function login(email, password){
        const res = await fetch(`${API_BASE}/auth/login`,{
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({email, password}),
        });
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to login")
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        setToken(data.token)
        setCurrentUser(data.user);
        return data
    }
    function logout(){
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setToken(null)
        setCurrentUser(null)
    }
    return (
        <AuthContext.Provider value={{currentUser, token, signup, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    const context = useContext(AuthContext)
    if(!context) throw new Error("useAuth must be used within AuthProvider")
    return context;

}