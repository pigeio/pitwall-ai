"use client";

export default function ErrorMessage({ error, onRetry }) {
  return (
    <div className="error-message">
      <div className="message-avatar" style={{ background: "linear-gradient(135deg, #e10600, #ff3830)", borderRadius: "8px", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, boxShadow: "0 2px 8px rgba(225,6,0,0.2)" }}>
        ⚠️
      </div>
      <div className="error-bubble">
        <div className="error-title">🚨 Radio Failure!</div>
        <div className="error-text">
          {error || "We've lost comms with the pit wall. Let's try again."}
        </div>
        <button className="error-retry" onClick={onRetry} id="retry-button">
          ↻ Retry Connection
        </button>
      </div>
    </div>
  );
}
