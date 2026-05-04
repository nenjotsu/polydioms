import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const SUPPORTED_LANGUAGES = [
  { flag: "🇬🇧", name: "English",  code: "en", count: "120+ idioms" },
  { flag: "🇪🇸", name: "Spanish",  code: "es", count: "140+ idioms" },
];

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <h1>Learn Idioms the Fun Way</h1>
        <p className="hero-sub">
          A card game for polyglots to learn and practice idioms
          from around the world.
        </p>

        {isAuthenticated() ? (
          <div className="hero-actions">
            <p className="welcome-back">
              Welcome back, {user?.avatar_emoji} <strong>{user?.codename}</strong>!
            </p>
            <p><Link to="/game" className="btn-hero">Play Now ▶</Link></p>
          </div>
        ) : (
          <div className="hero-actions">
            <Link to="/register" className="btn-hero">Get Started</Link>
            <Link to="/login"    className="btn-hero btn-outline">Login</Link>
          </div>
        )}
      </section>

      {/* Languages */}
      <section className="languages-section">
        <h2>Available Languages</h2>
        <div className="language-cards">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <div key={lang.code} className="language-card">
              <span className="lang-flag">{lang.flag}</span>
              <h3>{lang.name}</h3>
              <p>{lang.count}</p>
            </div>
          ))}
          <div className="language-card coming-soon">
            <span className="lang-flag">🌍</span>
            <h3>More Coming</h3>
            <p>French, Japanese...</p>
          </div>
        </div>
      </section>

      {/* How to Play */}
      <section className="how-to-play">
        <h2>How to Play</h2>
        <ol className="steps">
          <li>
            <span className="step-num">1</span>
            <p>Choose a language and difficulty level</p>
          </li>
          <li>
            <span className="step-num">2</span>
            <p>Read the idiom shown on the card front</p>
          </li>
          <li>
            <span className="step-num">3</span>
            <p>Pick the correct meaning from 4 choices</p>
          </li>
          <li>
            <span className="step-num">4</span>
            <p>The card flips to reveal if you're right — earn points!</p>
          </li>
        </ol>
      </section>
    </main>
  );
}