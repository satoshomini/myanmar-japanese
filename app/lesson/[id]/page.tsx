"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { lessons, SubtitleCue } from "@/lib/subtitles";
import { lookupWord } from "@/lib/dictionary";

declare global {
  interface Window { YT: any; onYouTubeIframeAPIReady: () => void; }
}

export default function LessonPage() {
  const { id } = useParams();
  const lesson = lessons.find((l) => l.id === String(id));
  const playerRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [popup, setPopup] = useState<{ word: string; meaning: string } | null>(null);
  const subtitleRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!lesson) return;
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("yt-player", {
        videoId: lesson.videoId,
        playerVars: { rel: 0, modestbranding: 1 },
      });
    };

    const timer = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        const t = playerRef.current.getCurrentTime();
        const idx = lesson.subtitles.findIndex((c) => t >= c.start && t < c.end);
        setCurrentIndex(idx);
      }
    }, 300);

    return () => clearInterval(timer);
  }, [lesson]);

  // Auto-scroll to current subtitle
  useEffect(() => {
    if (currentIndex >= 0 && subtitleRefs.current[currentIndex]) {
      subtitleRefs.current[currentIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentIndex]);

  if (!lesson) return <div className="text-white p-8">レッスンが見つかりません</div>;

  const handleWordClick = (char: string) => {
    const meaning = lookupWord(char);
    if (meaning) setPopup({ word: char, meaning });
  };

  return (
    <main className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
      {/* Fixed video player */}
      <div className="flex-shrink-0 bg-gray-950 px-4 pt-4 pb-3 max-w-2xl w-full mx-auto">
        <h1 className="text-lg font-bold mb-2 truncate">{lesson.title}</h1>
        <div className="rounded-xl overflow-hidden aspect-video bg-black">
          <div id="yt-player" className="w-full h-full" />
        </div>
      </div>

      {/* Scrollable subtitle list */}
      <div className="flex-1 overflow-y-auto max-w-2xl w-full mx-auto px-4 py-3 space-y-2">
        {lesson.subtitles.map((cue, i) => {
          const isActive = i === currentIndex;
          const isPast = i < currentIndex;
          return (
            <div
              key={i}
              ref={(el) => { subtitleRefs.current[i] = el; }}
              className={`rounded-xl px-5 py-4 transition-all duration-300 ${
                isActive
                  ? "bg-yellow-500/20 border border-yellow-400 scale-100"
                  : isPast
                  ? "opacity-30"
                  : "opacity-50"
              }`}
            >
              <p className={`text-base leading-relaxed mb-1 ${isActive ? "text-white font-bold text-lg" : "text-gray-300"}`}>
                {cue.japanese.split("").map((char, ci) => {
                  const meaning = lookupWord(char);
                  return (
                    <span
                      key={ci}
                      onClick={() => meaning && handleWordClick(char)}
                      className={meaning ? "cursor-pointer underline decoration-yellow-400 hover:text-yellow-300" : ""}
                    >
                      {char}
                    </span>
                  );
                })}
              </p>
              <p className={`text-sm ${isActive ? "text-yellow-300 font-medium" : "text-gray-500"}`}>
                {cue.myanmar}
              </p>
            </div>
          );
        })}
      </div>

      {/* Dictionary Popup */}
      {popup && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setPopup(null)}
        >
          <div className="bg-gray-800 rounded-2xl p-6 text-center shadow-xl max-w-xs w-full mx-4">
            <p className="text-3xl font-bold mb-2">{popup.word}</p>
            <p className="text-yellow-300 text-xl">{popup.meaning}</p>
            <p className="text-gray-500 text-sm mt-3">タップして閉じる</p>
          </div>
        </div>
      )}
    </main>
  );
}
