import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function PostForm({ user, onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Fetch username + class + is_dm from profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, class, is_dm")
      .eq("id", user.id)
      .single();

    await supabase.from("posts").insert({
      user_id: user.id,
      username: profile.username,
      class: profile.class,      // ⭐ FIXED
      is_dm: profile.is_dm,      // ⭐ FIXED
      title: title.trim(),
      content: content.trim() || null,
      image_url: imageUrl.trim() || null,
    });

    setTitle("");
    setContent("");
    setImageUrl("");
    onCreated?.();
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h3>Create a new post</h3>
      <input
        placeholder="Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content (optional)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        placeholder="Image URL (optional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <button type="submit">Post</button>
    </form>
  );
}
