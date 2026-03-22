# PitWall AI 🏁

> Your personal Formula 1 race engineer, powered by AI.

## What is this?

**PitWall AI** is a purpose-built F1 chatbot that acts as your personal race engineer on the pit wall. Ask it about race strategy, driver statistics, team histories, circuit details, regulations, and legendary moments — it responds with the authority and personality of a real F1 race engineer.

## Why Formula 1?

F1 is a fascinating intersection of engineering, strategy, and human performance. It has 70+ years of rich history, 20+ active drivers, 24 circuits worldwide, and deeply complex regulations — making it the perfect topic for a chatbot that feels genuinely purpose-built rather than a generic chat wrapper.

The "race engineer" persona gives the bot a distinct personality — it uses radio comms language ("Copy that", "Box box"), references telemetry data, and brings the same calm authority you'd hear during a Grand Prix.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| AI Backend | Groq API (Llama 3 70B) |
| Styling | Vanilla CSS (custom design system) |
| Deployment | Vercel |
| Fonts | Outfit + Inter (Google Fonts) |

## Features

- 🏎️ **F1-trained chatbot** with deep knowledge of drivers, teams, circuits, regulations, and history
- 📡 **Streaming responses** — see the answer build in real-time
- 🎨 **Racing-themed UI** — carbon dark theme, F1 red accents, glassmorphism, grid background
- 💡 **Suggested questions** to get started instantly
- ⚡ **Loading states** — "Analyzing telemetry..." typing indicator
- 🚨 **Error handling** — themed "Radio Failure" messages with retry
- 📱 **Fully responsive** — works on mobile, tablet, and desktop

## Getting Started

### Prerequisites

- Node.js 18+
- A [Groq API key](https://console.groq.com) (free tier available)

### Setup

```bash
# Clone the repo
git clone https://github.com/pigeio/pitwall-ai.git
cd pitwall-ai

# Install dependencies
npm install

# Create environment file
echo "GROQ_API_KEY=your_api_key_here" > .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start chatting.

### Deploy to Vercel

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add `GROQ_API_KEY` as an environment variable
4. Deploy 🚀

## Frontend Thinking

- **First impression**: Dark, premium racing dashboard aesthetic with animated grid background and the iconic F1 red
- **Empty state**: Welcome screen with bot introduction and 4 curated starter questions
- **Loading state**: "Analyzing telemetry..." indicator with pulsing dots animation
- **Error state**: Themed "Radio Failure" message with retry button
- **Streaming**: Responses appear word-by-word for a natural conversation feel
- **Details**: Auto-scroll, keyboard shortcuts (Enter/Shift+Enter), auto-resizing input, markdown rendering for rich responses

## License

MIT
