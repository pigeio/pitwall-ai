"use client";

export default function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <div className="message-avatar">🏁</div>
      <div className="typing-bubble">
        <span className="typing-text">Analyzing telemetry</span>
        <div className="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
