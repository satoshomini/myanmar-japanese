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

  const SubtitleList = () => (
    <div className="h-full overflow-y-auto px-4 py-3 space-y-2">
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
  );

  return (
    <>
      {/* ===== MOBILE (< lg) ===== */}
      <main className="lg:hidden h-dvh flex flex-col bg-gray-950 text-white overflow-hidden">
        <div className="flex-shrink-0 bg-gray-950">
          <div className="flex items-center gap-3 px-4 pt-3 pb-2">
            <Link href="/" className="text-yellow-400 text-sm font-medium">‹ 戻る</Link>
            <p className="flex-1 text-sm font-semibold truncate">{lesson.title}</p>
            <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">{lesson.level}</span>
          </div>
          <div className="mx-4 rounded-xl overflow-hidden bg-black aspect-video">
            <div id="yt-player" className="w-full h-full" />
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <SubtitleList />
        </div>
      </main>

      {/* ===== DESKTOP (>= lg) ===== */}
      <main className="hidden lg:flex h-screen flex-col bg-gray-950 text-white overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center gap-4">
          <Link href="/" className="text-yellow-400 font-medium hover:text-yellow-300 transition">← レッスン一覧</Link>
          <h1 className="flex-1 text-lg font-bold truncate">{lesson.title}</h1>
          <span className="bg-yellow-500 text-black text-sm font-bold px-3 py-1 rounded-full">{lesson.level}</span>
        </div>

        {/* 2-column layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Video + info */}
          <div className="w-1/2 xl:w-3/5 flex flex-col border-r border-gray-800 p-6 gap-4">
            <div className="rounded-2xl overflow-hidden bg-black aspect-video w-full">
              <div id="yt-player" className="w-full h-full" />
            </div>
            {/* Current subtitle large display */}
            <div className="bg-gray-800 rounded-2xl p-5 text-center flex-1 flex flex-col justify-center min-h-[100px]">
              {currentIndex >= 0 ? (
                <>
                  <p className="text-2xl font-bold mb-2 leading-relaxed">
                    {lesson.subtitles[currentIndex].japanese.split("").map((char, ci) => {
                      const meaning = lookupWord(char);
                      return (
                        <span
                          key={ci}
                          onClick={() => meaning && setPopup({ word: char, meaning })}
                          className={meaning ? "cursor-pointer underline decoration-yellow-400/60 underline-offset-4 hover:text-yellow-300 transition" : ""}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </p>
                  <p className="text-yellow-300 text-lg">{lesson.subtitles[currentIndex].myanmar}</p>
                </>
              ) : (
                <p className="text-gray-500">▶ 動画を再生すると字幕が表示されます</p>
              )}
            </div>
          </div>

          {/* Right: Subtitle scroll list */}
          <div className="w-1/2 xl:w-2/5 overflow-hidden flex flex-col">
            <div className="flex-shrink-0 px-4 py-3 border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
              字幕リスト — タップで単語の意味
            </div>
            <div className="flex-1 overflow-hidden">
              <SubtitleList />
            </div>
          </div>
        </div>
      </main>

      {/* Dictionary Popup (shared) */}
      {popup && (
        <div
          className="fixed inset-0 bg-black/70 flex items-end lg:items-center justify-center z-50"
          onClick={() => setPopup(null)}
        >
          <div
            className="bg-gray-800 rounded-t-3xl lg:rounded-2xl p-6 text-center w-full max-w-sm mx-auto border-t lg:border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-4 lg:hidden" />
            <p className="text-4xl font-bold mb-3">{popup.word}</p>
            <p className="text-yellow-300 text-xl mb-2">{popup.meaning}</p>
            <button onClick={() => setPopup(null)} className="mt-4 text-gray-500 text-sm">閉じる</button>
          </div>
        </div>
      )}
    </>
  );
}
