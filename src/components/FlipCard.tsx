import { useState } from "react";
import "./FlipCard.css";

interface Choice { id: number; choice_text: string; is_correct: boolean; }

interface Props {
  question: string;
  originalText: string;
  transliteration?: string;
  choices: string[];
  onAnswer: (choice: string) => { is_correct: boolean; correct_choice: string, idiom: string };
  onNext: () => void;
}

export default function FlipCard({ question, originalText, transliteration, choices, onAnswer, onNext }: Props) {
  const [flipped,   setFlipped]   = useState(false);
  const [result,    setResult]    = useState<{ is_correct: boolean; correct_choice: string, idiom: string } | null>(null);
  const [answered,  setAnswered]  = useState(false);

  async function handleChoice(choice: string) {
    if (answered) return;
    setAnswered(true);
    const res = onAnswer(choice);
    setResult(res);
    setFlipped(true);        // flip on answer
  }

  function handleNext() {
    setFlipped(false);
    onNext();
    setTimeout(() => {
      setResult(null);
      setAnswered(false);
    }, 1000);
  }

  return (
    <div className="scene">
      <div className={`card ${flipped ? "is-flipped" : ""}`}>

        {/* FRONT — question */}
        <div className="card-face card-front">
          <p className="original-text">{originalText}</p>
          {transliteration && (
            <p className="transliteration">[ {transliteration} ]</p>
          )}
          <p className="question-text">{question}</p>
          <div className="choices">
            {choices.map((c, i) => (
              <button
                key={i}
                className="choice-btn"
                onClick={() => handleChoice(c)}
                disabled={answered}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* BACK — result */}
        <div className="card-face card-back">
          <div className={`result ${result?.is_correct ? "correct" : "wrong"}`}>
            {result?.is_correct ? "✅ Correct!" : "❌ Wrong!"}
          </div>
          
          <p className="correct-answer">
            ✨ {result?.idiom}<br />
            ✔ {result?.correct_choice}
          </p>
          <button className="next-btn" onClick={handleNext}>
            Next Card ➡
          </button>
        </div>

      </div>
    </div>
  );
}