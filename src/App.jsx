import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import PostPage from "./pages/PostPage.jsx";
import Auth from "./components/Auth.jsx";
import Profile from "./pages/Profile.jsx";
import { supabase } from "./supabaseClient.js";
import { useEffect, useState } from "react";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session || null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const toggleUnderdark = () => {
    document.body.classList.toggle("underdark");
  };

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/">HobbyHub</Link>

        <nav>
          <button onClick={toggleUnderdark}>Underdark</button>

          {session ? (
            <>
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/auth">Login / Signup</Link>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home session={session} />} />
          <Route path="/post/:id" element={<PostPage session={session} />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile session={session} />} />
        </Routes>
      </main>
    </div>
  );
}
