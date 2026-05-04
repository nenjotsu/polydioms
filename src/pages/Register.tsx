import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuthStore } from "../store/authStore";

const AVATARS = ["🧠", "🦉", "🌎", "📚", "🎯", "🔥", "⚡", "🎲"];

export default function Register() {
  const [codename,     setCodename]     = useState("");
  const [password,     setPassword]     = useState("");
  const [confirm,      setConfirm]      = useState("");
  const [avatarEmoji,  setAvatarEmoji]  = useState("🧠");
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);

  const login    = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  // Redirect if already logged in
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  if (isAuthenticated) return null; // or navigate("/game")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) return setError("Passwords do not match");
    if (password.length < 6)  return setError("Password must be at least 6 characters");

    setLoading(true);
    try {
      const data = await api.post<{ user: any; token: string }>(
        "auth-register",
        { codename, password, avatar_emoji: avatarEmoji }
      );
      login(data.user, data.token);
      navigate("/game");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-center">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Create Account</h2>
        <p className="auth-sub">Pick a codename — no email needed.</p>

        {error && <p className="error">{error}</p>}

        {/* Avatar Picker */}
        <div className="avatar-picker">
          <label>Choose your avatar</label>
          <div className="avatar-grid">
            {AVATARS.map((emoji) => (
              <button
                type="button"
                key={emoji}
                className={`avatar-btn ${avatarEmoji === emoji ? "selected" : ""}`}
                onClick={() => setAvatarEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <input
          placeholder="Codename (3–30 characters)"
          value={codename}
          onChange={(e) => setCodename(e.target.value)}
          minLength={3}
          maxLength={30}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}