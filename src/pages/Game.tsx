import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuthStore } from "../store/authStore";
import FlipCard from "../components/FlipCard";

interface Question {
  question_id:   string;
  prompt_text:   string;
  original_text: string;
  transliteration?: string;
  english_meaning: string;
  difficulty:    number;
  language_code: string;
  wrong_answers:       string[];
}

type Difficulty = "" | "1" | "2" | "3";
type Language   = "en" | "es";

export default function Game() {
  const { user, login, token } = useAuthStore();
  const navigate = useNavigate();

  // Setup screen state
  const [screen,     setScreen]     = useState<"setup" | "playing" | "results">("setup");
  const [language,   setLanguage]   = useState<Language>("es");
  const [difficulty, setDifficulty] = useState<Difficulty>("");
  const [count,      setCount]      = useState(10);

  // Game state
  const [sessionId,  setSessionId]  = useState<string | null>(null);
  const [questions,  setQuestions]  = useState<Question[]>([]);
  const [current,    setCurrent]    = useState(0);
  const [score,      setScore]      = useState(0);
  const [correct,    setCorrect]    = useState(0);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  // Language id map (matches DB seeds)
  const LANG_ID: Record<Language, number> = { en: 1, es: 2 };

  async function startGame() {
    setLoading(true);
    setError("");
    try {
      // 1. Fetch questions
      const qs = await api.get<Question[]>("questions-get", {
        lang:       language,
        count:      String(count),
        ...(difficulty ? { difficulty } : {}),
      });
      if (!qs.length) throw new Error("No questions found for this selection.");

      // 2. Start session
      const session = await api.post<{ id: string }>("session-start", {
        language_id:     LANG_ID[language],
        difficulty:      difficulty ? Number(difficulty) : null,
        total_questions: count,
      });

      setQuestions(qs);
      setSessionId(session.id);
      setCurrent(0);
      setScore(0);
      setCorrect(0);
      setScreen("playing");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleAnswer = useCallback(
    (choice: string) => {
      const q = questions[current];
      const is_correct = choice === q.english_meaning; 

      if (is_correct) {
        setScore((s) => s + (100 * q.difficulty));
        setCorrect((c) => c + 1);
      }
      return { is_correct, correct_choice: q.english_meaning, idiom: q.original_text };
    },
    [questions, current, sessionId]
  );

  async function handleNext() {
    if (current + 1 >= questions.length) {
      // End game
      await api.post("session-complete", {
        session_id: sessionId,
        time_taken_secs: null,
        score,
        correct,
      });
      // Update local user score
      if (user) login({ ...user, total_score: user.total_score + score }, token!);
      setScreen("results");
    } else {
      setCurrent((c) => c + 1);
    }
  }

  // ── Setup Screen ──────────────────────────────────────────
  if (screen === "setup") {
    return (
      <div className="page-center">
        <div className="setup-card">
          <h2>⚙️ Game Setup</h2>
          {error && <p className="error">{error}</p>}

          <label>Language</label>
          <div className="lang-selector">
            {(["es", "en"] as Language[]).map((l) => (
              <button
                key={l}
                type="button"
                className={`lang-btn ${language === l ? "active" : ""}`}
                onClick={() => setLanguage(l)}
              >
                {l === "es" ? "🇪🇸 Spanish" : "🇬🇧 English"}
              </button>
            ))}
          </div>

          <label>Difficulty</label>
          <div className="diff-selector">
            {([["", "All"], ["1", "Easy"], ["2", "Medium"], ["3", "Hard"]] as [Difficulty, string][]).map(
              ([val, label]) => (
                <button
                  key={val}
                  type="button"
                  className={`diff-btn ${difficulty === val ? "active" : ""}`}
                  onClick={() => setDifficulty(val)}
                >
                  {label}
                </button>
              )
            )}
          </div>

          <label>Number of Cards: <strong>{count}</strong></label>
          <input
            type="range"
            min={5} max={20} value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="count-slider"
          />

          <button
            className="btn-primary"
            onClick={startGame}
            disabled={loading}
          >
            {loading ? "Loading..." : "Start Game ▶"}
          </button>
        </div>
      </div>
    );
  }

  // ── Results Screen ────────────────────────────────────────
  if (screen === "results") {
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div className="page-center">
        <div className="results-card">
          <h2>🎉 Game Over!</h2>
          <div className="results-score">{score} pts</div>
          <p className="results-grade">{correct} / {questions.length} correct ({pct}%)</p>
          <p className="results-grade">
            {pct >= 80 ? "🔥 Excellent!" : pct >= 50 ? "👍 Good job!" : "📚 Keep practicing!"}
          </p>
          <div className="results-actions">
            <button className="btn-primary" onClick={() => setScreen("setup")}>
              Play Again
            </button>
            <button className="btn-outline" onClick={() => navigate("/leaderboard")}>
              🏆 Leaderboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Playing Screen ────────────────────────────────────────
  const q = questions[current];

  return (
    <div className="game-screen">
      {/* HUD */}
      <div className="hud">
        <span>
          {language === "es" ? "🇪🇸" : "🇬🇧"} {language === "es" ? "Spanish" : "English"}
        </span>
        <span>Card {current + 1} / {questions.length}</span>
        <span>⭐ {score} pts</span>
        <span>{user?.avatar_emoji} {user?.codename}</span>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((current) / questions.length) * 100}%` }}
        />
      </div>

      <FlipCard
        key={q.question_id}
        question={q.prompt_text}
        originalText={q.original_text}
        transliteration={q.transliteration}
        choices={q.wrong_answers.concat(q.english_meaning)}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </div>
  );
}