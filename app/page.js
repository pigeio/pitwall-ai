"use client";

import { useState, useCallback } from "react";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import RaceBackground from "@/components/RaceBackground";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (content) => {
    const userMessage = { role: "user", content };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed (${response.status})`);
      }

      // Read the SSE stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botContent = "";

      // Add empty bot message that we'll fill
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.text) {
                botContent += parsed.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: botContent,
                  };
                  return updated;
                });
              }
            } catch (parseErr) {
              // Skip malformed chunks
              if (parseErr.message === "Stream interrupted") {
                throw parseErr;
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      // Remove the empty bot message if it was added
      setMessages((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].role === "assistant" && !prev[prev.length - 1].content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const handleRetry = useCallback(() => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
      if (lastUserMessage) {
        // Remove the failed attempt
        setMessages((prev) => {
          const lastUserIndex = prev.map(m => m.role).lastIndexOf("user");
          return prev.slice(0, lastUserIndex);
        });
        setError(null);
        sendMessage(lastUserMessage.content);
      }
    }
  }, [messages, sendMessage]);

  const handleSuggestionClick = useCallback((text) => {
    sendMessage(text);
  }, [sendMessage]);

  return (
    <>
      <RaceBackground />
      <div className="app">
        <header className="header">
          <div className="header-left">
            <div className="header-logo">🏁</div>
            <div>
              <div className="header-title">PitWall AI</div>
              <div className="header-subtitle">F1 Race Engineer</div>
            </div>
          </div>
          <div className="header-status">
            <span className="status-dot" />
            Online
          </div>
        </header>

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          error={error}
          onSuggestionClick={handleSuggestionClick}
          onRetry={handleRetry}
        />

        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </>
  );
}
