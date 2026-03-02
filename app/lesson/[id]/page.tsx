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
  const lesson = lessons.find((l) => l.id === id);
  const playerRef = useRef<any>(null);
  const [currentCue, setCurrentCue] = useState<SubtitleCue | null>(null);
  const [popup, setPopup] = useState<{ word: string; meaning: string } | null>(null);

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
        const cue = lesson.subtitles.find((c) => t >= c.start && t < c.end) || null;
        setCurrentCue(cue);
      }
    }, 500);

    return () => clearInterval(timer);
  }, [lesson]);

  if (!lesson) return <div className="text-white p-8">レッスンが見つかりません</div>;

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">{lesson.title}</h1>
        <p className="text-gray-400 text-sm mb-4">{lesson.titleMm}</p>

        <div className="rounded-xl overflow-hidden aspect-video mb-4 bg-black">
          <div id="yt-player" className="w-full h-full" />
        </div>

        <div className="bg-gray-800 rounded-xl p-5 min-h-24 text-center">
          {currentCue ? (
            <>
              <p className="text-xl font-semibold mb-2 leading-relaxed">
                {currentCue.japanese.split("").map((char, i) => {
                  const meaning = lookupWord(char);
                  return (
                    <span
                      key={i}
                      onClick={() => meaning && setPopup({ word: char, meaning })}
                      className={meaning ? "cursor-pointer underline decoration-yellow-400 hover:text-yellow-300" : ""}
                    >
                      {char}
                    </span>
                  );
                })}
              </p>
              <p className="text-yellow-300 text-lg">{currentCue.myanmar}</p>
            </>
          ) : (
            <p className="text-gray-500">▶ 動画を再生してください</p>
          )}
        </div>

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
      </div>
    </main>
  );
}
