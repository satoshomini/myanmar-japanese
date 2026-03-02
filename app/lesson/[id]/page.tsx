"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { lessons } from "@/lib/subtitles";
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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

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

  // スクロールコンテナを使って確実に追従
  useEffect(() => {
    if (currentIndex < 0) return;
    const el = subtitleRefs.current[currentIndex];
    const container = scrollContainerRef.current;
    if (!el || !container) return;
    const elTop = el.offsetTop;
    const elHeight = el.offsetHeight;
    const containerHeight = container.clientHeight;
    const targetScroll = elTop - containerHeight / 3 + elHeight / 2;
    container.scrollTo({ top: targetScroll, behavior: "smooth" });
  }, [currentIndex]);

  if (!lesson) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <Link href="/" className="text-yellow-400 underline">← 戻る</Link>
    </div>
  );

  return (
    <main className="h-dvh lg:h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-gray-900 border-b border-gray-800 px-4 lg:px-6 py-3 flex items-center gap-3">
        <Link href="/" className="text-yellow-400 text-sm lg:text-base font-medium hover:text-yellow-300 transition">
          ‹ <span className="hidden lg:inline">レッスン一覧</span>
        </Link>
        <h1 className="flex-1 text-sm lg:text-lg font-bold truncate">{lesson.title}</h1>
        <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 lg:px-3 lg:py-1 rounded-full flex-shrink-0">{lesson.level}</span>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* Left / Top: Video + large subtitle (desktop) */}
        <div className="flex-shrink-0 lg:flex-1 flex flex-col lg:border-r border-gray-800 p-3 lg:p-6 gap-3 lg:gap-4">
          <div className="rounded-xl lg:rounded-2xl overflow-hidden bg-black aspect-video w-full">
            <div id="yt-player" className="w-full h-full" />
          </div>
          {/* Large current subtitle — desktop only */}
          <div className="hidden lg:flex bg-gray-800 rounded-2xl p-5 text-center flex-1 flex-col justify-center min-h-[100px]">
            {currentIndex >= 0 ? (
              <>
                <p className="text-2xl font-bold mb-2 leading-relaxed">
                  {lesson.subtitles[currentIndex].japanese.split("").map((char, ci) => {
                    const meaning = lookupWord(char);
                    return (
                      <span key={ci} onClick={() => meaning && setPopup({ word: char, meaning })}
                        className={meaning ? "cursor-pointer underline decoration-yellow-400/60 underline-offset-4 hover:text-yellow-300 transition" : ""}>
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

        {/* Right / Bottom: Subtitle scroll list */}
        <div className="flex-1 lg:w-96 lg:flex-none overflow-hidden flex flex-col">
          <div className="flex-shrink-0 px-4 py-2 border-b border-gray-800 text-xs text-gray-500 tracking-wider hidden lg:block">
            字幕をタップ → その位置に再生スキップ
          </div>
          {/* ← スクロールコンテナに ref を付ける */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {lesson.subtitles.map((cue, i) => {
              const isActive = i === currentIndex;
              const isPast = i < currentIndex;
              return (
                <div key={i} ref={(el) => { subtitleRefs.current[i] = el; }}
                  onClick={() => playerRef.current?.seekTo?.(cue.start, true)}
                  className={`rounded-2xl px-4 py-3 transition-all duration-300 cursor-pointer active:scale-95 ${
                    isActive ? "bg-yellow-500/15 border border-yellow-400/60"
                    : isPast ? "opacity-25 hover:opacity-60" : "opacity-60 hover:opacity-80"
                  }`}>
                  <p className={`leading-relaxed mb-1 ${isActive ? "text-white font-bold text-base" : "text-gray-300 text-sm"}`}>
                    {cue.japanese.split("").map((char, ci) => {
                      const meaning = lookupWord(char);
                      return (
                        <span key={ci} onClick={() => meaning && setPopup({ word: char, meaning })}
                          className={meaning ? "cursor-pointer underline decoration-yellow-400/60 underline-offset-2" : ""}>
                          {char}
                        </span>
                      );
                    })}
                  </p>
                  <p className={isActive ? "text-yellow-300 text-sm font-medium" : "text-gray-500 text-xs"}>
                    {cue.myanmar}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dictionary Popup */}
      {popup && (
        <div className="fixed inset-0 bg-black/70 flex items-end lg:items-center justify-center z-50" onClick={() => setPopup(null)}>
          <div className="bg-gray-800 rounded-t-3xl lg:rounded-2xl p-6 text-center w-full max-w-sm mx-auto border-t lg:border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-4 lg:hidden" />
            <p className="text-4xl font-bold mb-3">{popup.word}</p>
            <p className="text-yellow-300 text-xl mb-2">{popup.meaning}</p>
            <button onClick={() => setPopup(null)} className="mt-4 text-gray-500 text-sm">閉じる</button>
          </div>
        </div>
      )}
    </main>
  );
}
