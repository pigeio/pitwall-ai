import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "PitWall AI — Your F1 Race Engineer",
  description:
    "An AI-powered Formula 1 expert chatbot. Get insights on race strategy, driver stats, team histories, circuits, and regulations from your personal pit wall engineer.",
  keywords: ["Formula 1", "F1", "chatbot", "AI", "race engineer", "pit wall", "racing"],
  openGraph: {
    title: "PitWall AI — Your F1 Race Engineer",
    description: "Chat with an AI F1 race engineer about strategy, history, and everything Formula 1.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
