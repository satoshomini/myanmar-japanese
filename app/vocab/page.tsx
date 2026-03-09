"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSavedWords, removeWord, SavedWord } from "@/lib/storage";

export default function VocabPage() {
  const [words, setWords] = useState<SavedWord[]>([]);

  useEffect(() => { setWords(getSavedWords()); }, []);

  const remove = (word: string) => {
    removeWord(word);
    setWords(getSavedWords());
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-10">
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-4 flex items-center gap-3">
        <Link href="/" className="text-yellow-400 text-sm">‹ ホーム</Link>
        <h1 className="flex-1 font-bold text-lg">📖 マイ単語帳</h1>
        <span className="text-gray-500 text-sm">{words.length}語</span>
      </div>

      {words.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 gap-4 text-center px-8">
          <p className="text-5xl">📖</p>
          <p className="text-gray-400">まだ単語が保存されていません</p>
          <p className="text-gray-600 text-sm">レッスン中に黄色い単語をタップして「保存」すると追加されます</p>
          <Link href="/" className="mt-4 bg-yellow-500 text-black font-bold px-6 py-2.5 rounded-full text-sm">
            レッスンを始める
          </Link>
        </div>
      ) : (
        <div className="px-4 pt-4 space-y-2">
          {words.map((w) => (
            <div key={w.word} className="bg-gray-800 rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="flex-1">
                <p className="text-lg font-bold">{w.word}</p>
                <p className="text-yellow-300 text-sm mt-0.5">{w.meaning}</p>
              </div>
              <button
                onClick={() => remove(w.word)}
                className="text-gray-600 hover:text-red-400 transition text-xl leading-none p-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
