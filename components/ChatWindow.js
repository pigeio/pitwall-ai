"use client";

import { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import WelcomeScreen from "./WelcomeScreen";
import TypingIndicator from "./TypingIndicator";
import ErrorMessage from "./ErrorMessage";

export default function ChatWindow({
  messages,
  isLoading,
  error,
  onSuggestionClick,
  onRetry,
}) {
  const bottomRef = useRef(null);
  const windowRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const isEmpty = messages.length === 0 && !isLoading && !error;

  return (
    <div className="chat-window" ref={windowRef} id="chat-window">
      {isEmpty ? (
        <WelcomeScreen onSuggestionClick={onSuggestionClick} />
      ) : (
        <>
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          {error && <ErrorMessage error={error} onRetry={onRetry} />}
        </>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
