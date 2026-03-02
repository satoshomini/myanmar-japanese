"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { lessons, SubtitleCue } from "@/lib/subtitles";
import { lookupWord } from "@/lib/dictionary";
import Link from "next/link";

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

  useEffect(() => {
    if (currentIndex >= 0 && subtitleRefs.current[currentIndex]) {
      subtitleRefs.current[currentIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentIndex]);

  if (!lesson) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400 mb-4">レッスンが見つかりません</p>
        <Link href="/" className="text-yellow-400 underline">← 戻る</Link>
      </div>
    </div>
  );

  return (
    <main className="h-dvh flex flex-col bg-gray-950 text-white overflow-hidden">
      {/* Fixed video + header area */}
      <div className="flex-shrink-0 bg-gray-950">
        {/* Back button + title */}
        <div className="flex items-center gap-3 px-4 pt-3 pb-2">
          <Link href="/" className="text-yellow-400 text-sm font-medium flex items-center gap-1">
            ‹ 戻る
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{lesson.title}</p>
          </div>
          <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
            {lesson.level}
          </span>
        </div>

        {/* YouTube Player */}
        <div className="mx-4 rounded-xl overflow-hidden bg-black aspect-video">
          <div id="yt-player" className="w-full h-full" />
        </div>
      </div>

      {/* Scrollable subtitle list */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-2">
        {lesson.subtitles.map((cue, i) => {
          const isActive = i === currentIndex;
          const isPast = i < currentIndex;
          return (
            <div
              key={i}
              ref={(el) => { subtitleRefs.current[i] = el; }}
              className={`rounded-2xl px-4 py-3 transition-all duration-300 ${
                isActive
                  ? "bg-yellow-500/15 border border-yellow-400/60"
                  : isPast
                  ? "opacity-25"
                  : "opacity-60"
              }`}
            >
              <p className={`leading-relaxed mb-1 ${isActive ? "text-white font-bold text-base" : "text-gray-300 text-sm"}`}>
                {cue.japanese.split("").map((char, ci) => {
                  const meaning = lookupWord(char);
                  return (
                    <span
                      key={ci}
                      onClick={() => meaning && setPopup({ word: char, meaning })}
                      className={meaning ? "cursor-pointer underline decoration-yellow-400/60 underline-offset-2" : ""}
                    >
                      {char}
                    </span>
                  );
                })}
              </p>
              <p className={`${isActive ? "text-yellow-300 text-sm font-medium" : "text-gray-500 text-xs"}`}>
                {cue.myanmar}
              </p>
            </div>
          );
        })}
      </div>

      {/* Dictionary Popup */}
      {popup && (
        <div
          className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 pb-safe"
          onClick={() => setPopup(null)}
        >
          <div
            className="bg-gray-800 rounded-t-3xl p-6 text-center w-full max-w-lg mx-auto border-t border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-4" />
            <p className="text-4xl font-bold mb-3">{popup.word}</p>
            <p className="text-yellow-300 text-xl mb-2">{popup.meaning}</p>
            <button
              onClick={() => setPopup(null)}
              className="mt-4 text-gray-500 text-sm"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
