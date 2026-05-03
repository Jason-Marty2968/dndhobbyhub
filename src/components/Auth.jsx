import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            username: username.trim(),
          });

        if (profileError) throw profileError;

        setMessage("Signup successful! Check your email to confirm.");
      }

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage("Logged in successfully.");
      }

      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/#/auth",
        });

        if (error) throw error;

        setMessage("Password reset email sent.");
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleOAuth = async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + "/#/",
      },
    });
  };

  return (
    <div className="auth">
      <h2>
        {mode === "login"
          ? "Login"
          : mode === "signup"
          ? "Create Account"
          : "Reset Password"}
      </h2>

      <form onSubmit={handleEmailAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {mode !== "reset" && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}

        {mode === "signup" && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}

        <button type="submit">
          {mode === "login"
            ? "Login"
            : mode === "signup"
            ? "Sign Up"
            : "Send Reset Email"}
        </button>
      </form>

      <div className="auth-switch">
        <button onClick={() => setMode("login")}>Login</button>
        <button onClick={() => setMode("signup")}>Sign Up</button>
        <button onClick={() => setMode("reset")}>Reset Password</button>
      </div>

      <div className="oauth">
        <button onClick={() => handleOAuth("google")}>
          Continue with Google
        </button>
        <button onClick={() => handleOAuth("apple")}>
          Continue with Apple
        </button>
      </div>

      {message && <p className="auth-message">{message}</p>}
    </div>
  );
}
