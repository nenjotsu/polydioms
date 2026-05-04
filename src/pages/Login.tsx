import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [codename, setCodename] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const login    = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const data = await api.post<{ user: any; token: string }>(
        "auth-login", { codename, password }
      );
      login(data.user, data.token);
      navigate("/game");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="page-center">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <input
          placeholder="Your codename"
          value={codename}
          onChange={(e) => setCodename(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary" type="submit">Enter</button>
        <p>No account? <a href="/polydioms/register">Register</a></p>
      </form>
    </div>
  );
}