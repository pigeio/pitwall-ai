"use client";

export default function WelcomeScreen({ onSuggestionClick }) {
  const suggestions = [
    {
      icon: "🏆",
      text: "Break down Verstappen's record 2023 season",
    },
    {
      icon: "🛞",
      text: "Explain tire strategy for a 2-stop at Spa",
    },
    {
      icon: "🏎️",
      text: "Who are the top 5 greatest F1 drivers ever?",
    },
    {
      icon: "⚙️",
      text: "What's DRS and how does ground effect work?",
    },
  ];

  return (
    <div className="welcome">
      <div className="welcome-icon">🏁</div>
      <h1>PitWall AI</h1>
      <p>
        Your personal F1 race engineer, ready to break down strategy, drivers,
        circuits, history, and everything Formula 1. Copy that — let&apos;s go.
      </p>
      <div className="welcome-suggestions">
        {suggestions.map((s, i) => (
          <button
            key={i}
            className="suggestion-btn"
            onClick={() => onSuggestionClick(s.text)}
          >
            <span className="suggestion-icon">{s.icon}</span>
            {s.text}
          </button>
        ))}
      </div>
    </div>
  );
}
