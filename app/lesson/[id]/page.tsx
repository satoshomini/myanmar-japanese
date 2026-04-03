"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getLessonById } from "@/lib/subtitles";
import type { Lesson } from "@/lib/subtitles";
import { lookupWord } from "@/lib/dictionary";
import { saveWord, isWordSaved, toggleFavorite, isFavorite } from "@/lib/storage";
import Link from "next/link";

declare global {
  interface Window { YT: any; onYouTubeIframeAPIReady: () => void; }
}

function renderWithDict(text: string, onWord: (word: string, meaning: string) => void) {
  const spans = [];
  let i = 0;
  while (i < text.length) {
    const match = lookupWord(text, i);
    if (match) {
      const { word, meaning, length } = match;
      spans.push(
        <span key={i}
          onClick={(e) => { e.stopPropagation(); onWord(word, meaning); }}
          className="cursor-pointer text-yellow-100 hover:text-yellow-300 transition border-b-2 border-yellow-400 mr-[3px] pb-px">
          {word}
        </span>
      );
      i += length;
    } else {
      spans.push(<span key={i}>{text[i]}</span>);
      i++;
    }
  }
  return spans;
}

export default function LessonPage() {
  const { id } = useParams();
  const [lesson, setLesson] = useState<Lesson | undefined>(undefined);
  useEffect(() => {
    getLessonById(String(id)).then(setLesson);
  }, [id]);
  const playerRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const manualOverrideRef = useRef<number>(0);
  const [popup, setPopup] = useState<{ word: string; meaning: string } | null>(null);
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set());
  const [fav, setFav] = useState(false);
  useEffect(() => { if (lesson) setFav(isFavorite(lesson.id)); }, [lesson]);
  const subtitleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!lesson) return;
    const initPlayer = () => {
      playerRef.current = new window.YT.Player("yt-player", {
        videoId: lesson.videoId,
        playerVars: { rel: 0, modestbranding: 1 },
      });
    };
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
    }
    const timer = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        const t = playerRef.current.getCurrentTime();
        const idx = lesson.subtitles.findIndex((c, i) => t >= c.start && t < (lesson.subtitles[i + 1]?.start ?? c.end));
        if (Date.now() > manualOverrideRef.current) setCurrentIndex(idx);
      }
    }, 300);
    return () => clearInterval(timer);
  }, [lesson]);

  useEffect(() => {
    if (currentIndex < 0) return;
    // クリック直後のmanual override中はauto-scrollしない
    if (Date.now() < manualOverrideRef.current) return;
    const el = subtitleRefs.current[currentIndex];
    const container = scrollContainerRef.current;
    if (!el || !container) return;
    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const relativeTop = elRect.top - containerRect.top + container.scrollTop;
    container.scrollTo({ top: relativeTop - container.clientHeight / 3, behavior: "smooth" });
  }, [currentIndex]);

  if (!lesson) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <Link href="/" className="text-yellow-400 underline">← 戻る</Link>
    </div>
  );

  const onWord = (word: string, meaning: string) => setPopup({ word, meaning });

  return (
    <main className="h-dvh lg:h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-gray-900 border-b border-gray-800 px-4 lg:px-6 py-3 flex items-center gap-3">
        <Link href="/" className="text-yellow-400 text-sm lg:text-base font-medium hover:text-yellow-300 transition">
          ‹ <span className="hidden lg:inline">レッスン一覧</span>
        </Link>
        <h1 className="flex-1 text-sm lg:text-lg font-bold truncate">{lesson.title}</h1>
        <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 lg:px-3 lg:py-1 rounded-full flex-shrink-0">{lesson.level}</span>
        <button
          onClick={() => { const next = !fav; toggleFavorite(lesson.id); setFav(next); }}
          className="flex-shrink-0 text-2xl leading-none active:scale-90 transition-transform"
        >
          {fav ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left / Top: Video + large subtitle */}
        <div className="flex-shrink-0 lg:flex-1 flex flex-col lg:border-r border-gray-800 p-3 lg:p-6 gap-3 lg:gap-4">
          <div className="rounded-xl lg:rounded-2xl overflow-hidden bg-black aspect-video w-full">
            <div id="yt-player" className="w-full h-full" />
          </div>
          <div className="hidden lg:flex bg-gray-800 rounded-2xl p-5 text-center flex-1 flex-col justify-center min-h-[100px]">
            {currentIndex >= 0 ? (
              <>
                <p className="text-2xl font-bold mb-2 leading-relaxed">
                  {renderWithDict(lesson.subtitles[currentIndex].japanese, onWord)}
                </p>
                <p className="text-gray-400 text-sm font-mono mb-2">{lesson.subtitles[currentIndex].romaji}</p>
                <p className="text-yellow-300 text-lg">{lesson.subtitles[currentIndex].myanmar}</p>
              </>
            ) : (
              <p className="text-gray-500">▶ 動画を再生すると字幕が表示されます</p>
            )}
          </div>
        </div>

        {/* Right / Bottom: Subtitle list */}
        <div className="flex-1 lg:w-96 lg:flex-none overflow-hidden flex flex-col">
          <div className="flex-shrink-0 px-4 py-2 border-b border-gray-800 text-xs text-gray-500 tracking-wider hidden lg:block">
            字幕タップ → スキップ ｜ 黄色の単語 → 意味
          </div>
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {lesson.subtitles.map((cue, i) => {
              const isActive = i === currentIndex;
              const isPast = i < currentIndex;
              return (
                <div key={i} ref={(el) => { subtitleRefs.current[i] = el; }}
                  onClick={() => { playerRef.current?.seekTo?.(cue.start, true); setCurrentIndex(i); manualOverrideRef.current = Date.now() + 1000; }}
                  className={`rounded-2xl px-4 py-3 transition-all duration-300 cursor-pointer active:scale-95 ${
                    isActive ? "bg-yellow-500/15 border border-yellow-400/60"
                    : isPast ? "opacity-25 hover:opacity-50" : "opacity-60 hover:opacity-80"
                  }`}>
                  <p className={`leading-relaxed mb-0.5 ${isActive ? "text-white font-bold text-base" : "text-gray-300 text-sm"}`}>
                    {renderWithDict(cue.japanese, onWord)}
                  </p>
                  {cue.romaji && (
                    <p className={`text-xs font-mono ${isActive ? "text-gray-400" : "text-gray-600"}`}>{cue.romaji}</p>
                  )}
                  {cue.myanmar && (
                    <p className={`text-xs mt-0.5 ${isActive ? "text-yellow-300 text-sm font-medium" : "text-gray-500"}`}>{cue.myanmar}</p>
                  )}
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
            <div className="flex gap-3 mt-5 justify-center">
              <button
                onClick={() => { saveWord(popup.word, popup.meaning); setSavedWords(new Set([...savedWords, popup.word])); }}
                className={`px-5 py-2 rounded-full text-sm font-bold transition ${savedWords.has(popup.word) || isWordSaved(popup.word) ? "bg-yellow-500 text-black" : "bg-gray-700 text-white hover:bg-yellow-500 hover:text-black"}`}
              >
                {savedWords.has(popup.word) || isWordSaved(popup.word) ? "✓ 保存済み" : "📖 単語帳に保存"}
              </button>
              <button onClick={() => setPopup(null)} className="px-5 py-2 rounded-full text-sm text-gray-400 bg-gray-700">閉じる</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
