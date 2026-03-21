"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatInput({ onSend, isLoading }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask your race engineer..."
          disabled={isLoading}
          rows={1}
          id="chat-input"
        />
        <button
          className="send-btn"
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
          id="send-button"
        >
          ▶
        </button>
      </div>
      <div className="chat-hint">
        Press Enter to send · Shift + Enter for new line
      </div>
    </div>
  );
}
