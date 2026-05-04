import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🃏 Polydioms
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/leaderboard" id="leaderboard-link">🏆 Leaderboard</Link>

        {isAuthenticated() ? (
          <>
            <Link to="/game">Play</Link>
            <span className="navbar-user">
              {user?.avatar_emoji} {user?.codename}
            </span>
            <span className="navbar-score">⭐ {user?.total_score}</span>
            <button className="btn btn-outline btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-outline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}