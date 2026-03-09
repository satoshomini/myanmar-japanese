"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSavedWords, removeWord, SavedWord } from "@/lib/storage";

// 簡易ふりがな変換（漢字+かなを分離して読み仮名を付与）
// 辞書からルビを引く
const rubyMap: Record<string, string> = {
  "勇気": "ゆうき", "涙": "なみだ", "願い": "ねがい", "夢": "ゆめ",
  "信じる": "しんじる", "両手": "りょうて", "笑顔": "えがお",
  "将来": "しょうらい", "秘密": "ひみつ", "基地": "きち",
  "忘れない": "わすれない", "光": "ひかり", "溶ける": "とける",
  "沈む": "しずむ", "世界": "せかい", "騒がしい": "さわがしい",
  "閉じ込める": "とじこめる", "疲れた": "つかれた", "苦い": "にがい",
  "匂い": "においい", "悲しみ": "かなしみ", "苦しみ": "くるしみ",
  "設定": "せってい", "関係": "かんけい", "出会う": "であう",
  "運命": "うんめい", "触れる": "ふれる", "粉雪": "こなゆき",
  "孤独": "こどく", "幸せ": "しあわせ", "不安": "ふあん",
  "怒り": "いかり", "仲間": "なかま", "友達": "ともだち",
  "家族": "かぞく", "恋人": "こいびと", "子供": "こども",
  "昨日": "きのう", "今夜": "こんや", "場所": "ばしょ",
  "歩く": "あるく", "走る": "はしる", "感じる": "かんじる",
  "守る": "まもる", "輝く": "かがやく", "燃える": "もえる",
  "言葉": "ことば", "歌": "うた", "音楽": "おんがく",
  "未来": "みらい", "過去": "かこ", "瞬間": "しゅんかん",
  "奇跡": "きせき", "出会い": "であい", "別れ": "わかれ",
  "希望": "きぼう", "絶望": "ぜつぼう", "自由": "じゆう",
  "平和": "へいわ", "記憶": "きおく", "強さ": "つよさ",
  "優しさ": "やさしさ", "温もり": "ぬくもり",
  "思い出": "おもいで", "季節": "きせつ", "永遠": "えいえん",
  "特別": "とくべつ", "完璧": "かんぺき",
};

function getReading(word: string): string | null {
  return rubyMap[word] || null;
}

function WordCard({ w, onRemove }: { w: SavedWord; onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  const reading = getReading(w.word);

  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
      {/* メイン行 */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer active:bg-gray-700 transition"
        onClick={() => setOpen(!open)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="text-xl font-bold">{w.word}</p>
            {reading && (
              <p className="text-xs text-gray-400 font-mono">{reading}</p>
            )}
          </div>
          <p className="text-yellow-300 text-sm mt-0.5 truncate">{w.meaning}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-gray-500 text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▼</span>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="text-gray-600 hover:text-red-400 transition text-lg leading-none p-1"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 展開パネル */}
      {open && (
        <div className="border-t border-gray-700 px-4 py-3 bg-gray-900">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500 text-xs mb-1">日本語</p>
              <p className="text-white font-bold text-lg">{w.word}</p>
            </div>
            {reading && (
              <div>
                <p className="text-gray-500 text-xs mb-1">よみかた</p>
                <p className="text-blue-300 font-mono">{reading}</p>
              </div>
            )}
            <div className="col-span-2">
              <p className="text-gray-500 text-xs mb-1">ミャンマー語</p>
              <p className="text-yellow-300 text-base">{w.meaning}</p>
            </div>
            </div>
        </div>
      )}
    </div>
  );
}

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
        <span className="text-gray-500 text-sm bg-gray-800 px-2 py-0.5 rounded-full">{words.length}語</span>
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
        <>
          <p className="px-4 pt-3 pb-1 text-gray-600 text-xs">タップで詳細を開く</p>
          <div className="px-4 pt-1 space-y-2">
            {words.map((w) => (
              <WordCard key={w.word} w={w} onRemove={() => remove(w.word)} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
