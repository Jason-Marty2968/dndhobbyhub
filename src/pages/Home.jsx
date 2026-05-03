<<<<<<< HEAD
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";
import PostForm from "../components/PostForm.jsx";
import PostList from "../components/PostList.jsx";

export default function Home({ session }) {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("created_at"); // or "upvotes"
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);

    let query = supabase
      .from("posts_with_upvotes") // ⭐ use the SQL view
      .select("*")
      .order(sortBy, { ascending: false });

    if (search.trim()) {
      query = query.ilike("title", `%${search.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error loading posts:", error);
      setPosts([]);
    } else {
      setPosts(data || []);
    }

    setLoading(false);
=======
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';
import PostForm from '../components/PostForm.jsx';
import PostList from '../components/PostList.jsx';

export default function Home({ session }) {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('created_at'); // or 'upvotes'
  const [search, setSearch] = useState('');

  const fetchPosts = async () => {
    let query = supabase
      .from('posts')
      .select('*')
      .order(sortBy, { ascending: false });

    if (search.trim()) {
      query = query.ilike('title', `%${search.trim()}%`);
    }

    const { data, error } = await query;
    if (!error) setPosts(data || []);
>>>>>>> cc0544ce1d41732c7d12daa695472a83f64f1532
  };

  useEffect(() => {
    fetchPosts();
  }, [sortBy, search]);

  return (
    <div className="home">
      <section className="controls">
        <input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
<<<<<<< HEAD

=======
>>>>>>> cc0544ce1d41732c7d12daa695472a83f64f1532
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="created_at">Newest</option>
          <option value="upvotes">Top upvoted</option>
        </select>
      </section>

      {session && <PostForm user={session.user} onCreated={fetchPosts} />}

<<<<<<< HEAD
      {loading ? <p>Loading posts...</p> : <PostList posts={posts} />}
=======
      <PostList posts={posts} />
>>>>>>> cc0544ce1d41732c7d12daa695472a83f64f1532
    </div>
  );
}
