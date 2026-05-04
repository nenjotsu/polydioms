import { useState, useEffect } from "react";
import { api } from "../api/client";
import { useAuthStore } from "../store/authStore";

type Tab = "alltime" | "language";
type Language = "en" | "es";

interface Entry {
  rank:             number;
  codename:         string;
  avatar_emoji:     string;
  total_score?:     number;
  lang_score?:      number;
  games_played?:    number;
  games_in_language?: number;
}

export default function Leaderboard() {
  const [tab,      setTab]      = useState<Tab>("alltime");
  const [language, setLanguage] = useState<Language>("es");
  const [entries,  setEntries]  = useState<Entry[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  const currentUser = useAuthStore((s) => s.user);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data =
          tab === "alltime"
            ? await api.get<Entry[]>("leaderboard-alltime", { limit: "20" })
            : await api.get<Entry[]>("leaderboard-bylanguage", {
                lang: language,
                limit: "20",
              });
        setEntries(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tab, language]);

  function rankBadge(rank: number) {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  }

  return (
    <div className="leaderboard-page">
      <h1>🏆 Leaderboard</h1>

      {/* Tabs */}
      <div className="lb-tabs">
        <button
          className={`lb-tab ${tab === "alltime" ? "active" : ""}`}
          onClick={() => setTab("alltime")}
        >
          🌍 All Time
        </button>
        <button
          className={`lb-tab ${tab === "language" ? "active" : ""}`}
          onClick={() => setTab("language")}
        >
          By Language
        </button>
      </div>

      {/* Language filter (only for language tab) */}
      {tab === "language" && (
        <div className="lb-lang-filter">
          {(["es", "en"] as Language[]).map((l) => (
            <button
              key={l}
              className={`lang-btn ${language === l ? "active" : ""}`}
              onClick={() => setLanguage(l)}
            >
              {l === "es" ? "🇪🇸 Spanish" : "🇬🇧 English"}
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : entries.length === 0 ? (
        <p className="empty-text">No scores yet — be the first! 🎯</p>
      ) : (
        <table className="lb-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
              <th>Games</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.rank}
                className={
                  entry.codename === currentUser?.codename ? "lb-row-me" : ""
                }
              >
                <td className="lb-rank">{rankBadge(entry.rank)}</td>
                <td className="lb-player">
                  <span className="lb-avatar">{entry.avatar_emoji}</span>
                  {entry.codename}
                  {entry.codename === currentUser?.codename && (
                    <span className="lb-you"> (you)</span>
                  )}
                </td>
                <td className="lb-score">
                  ⭐ {entry.total_score ?? entry.lang_score}
                </td>
                <td>{entry.games_played ?? entry.games_in_language}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}