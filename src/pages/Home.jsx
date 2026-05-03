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

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="created_at">Newest</option>
          <option value="upvotes">Top upvoted</option>
        </select>
      </section>

      {session && <PostForm user={session.user} onCreated={fetchPosts} />}

      {loading ? <p>Loading posts...</p> : <PostList posts={posts} />}
    </div>
  );
}
