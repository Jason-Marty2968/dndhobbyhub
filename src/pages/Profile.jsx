import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Profile({ session }) {
  const [username, setUsername] = useState("");
  const [dndClass, setDndClass] = useState("Adventurer");
  const [isDM, setIsDM] = useState(false);
  const [message, setMessage] = useState("");

  const user = session?.user;

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("username, class, is_dm")
        .eq("id", user.id)
        .single();

      // If profile doesn't exist, create it
      if (!data) {
        const defaultUsername = user.email.split("@")[0];

        await supabase.from("profiles").insert({
          id: user.id,
          username: defaultUsername,
          class: "Adventurer",
          is_dm: false
        });

        setUsername(defaultUsername);
        setDndClass("Adventurer");
        setIsDM(false);
        return;
      }

      // Normal load
      setUsername(data.username);
      setDndClass(data.class || "Adventurer");
      setIsDM(data.is_dm || false);
    };

    loadProfile();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");

    // Load current profile to compare
    const { data: current } = await supabase
      .from("profiles")
      .select("username, class, is_dm")
      .eq("id", user.id)
      .single();

    // If somehow still missing, create it
    if (!current) {
      const defaultUsername = user.email.split("@")[0];

      await supabase.from("profiles").insert({
        id: user.id,
        username: defaultUsername,
        class: dndClass,
        is_dm: isDM
      });

      setMessage("Profile created and updated.");
      return;
    }

    // Update username ONLY if changed
    if (username.trim() !== current.username) {
      const { error: usernameError } = await supabase
        .from("profiles")
        .update({ username: username.trim() })
        .eq("id", user.id);

      if (usernameError) {
        setMessage(usernameError.message);
        return;
      }
    }

    // Always update class + DM flag
    const { error: badgeError } = await supabase
      .from("profiles")
      .update({
        class: dndClass,
        is_dm: isDM
      })
      .eq("id", user.id);

    if (badgeError) {
      setMessage(badgeError.message);
      return;
    }

    setMessage("Profile updated successfully.");
  };

  if (!user) return <p>You must be logged in.</p>;

  return (
    <div className="profile-page">
      <h2>Edit Profile</h2>

      <form onSubmit={handleSave}>
        <input
          type="text"
          placeholder="New username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <select value={dndClass} onChange={(e) => setDndClass(e.target.value)}>
          <option>Barbarian</option>
          <option>Bard</option>
          <option>Cleric</option>
          <option>Druid</option>
          <option>Fighter</option>
          <option>Monk</option>
          <option>Paladin</option>
          <option>Ranger</option>
          <option>Rogue</option>
          <option>Sorcerer</option>
          <option>Warlock</option>
          <option>Wizard</option>
        </select>

        <label className="dm-toggle">
          <input
            type="checkbox"
            checked={isDM}
            onChange={(e) => setIsDM(e.target.checked)}
          />
          Dungeon Master
        </label>

        <button type="submit">Save</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
