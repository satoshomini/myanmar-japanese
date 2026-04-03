"use client";

import Link from "next/link";
import Image from "next/image";
import { lessonsMeta } from "@/lib/subtitles";
const lessons = lessonsMeta;
import { useState, useEffect } from "react";
import { getFavorites, toggleFavorite } from "@/lib/storage";

const levelConfig: Record<string, { label: string; mmLabel: string; color: string; bg: string; emoji: string }> = {
  "初級": { label: "初級", mmLabel: "အခြေခံ", color: "text-green-400", bg: "bg-green-500", emoji: "🟢" },
  "中級": { label: "中級", mmLabel: "အလယ်အလတ်", color: "text-yellow-400", bg: "bg-yellow-500", emoji: "🟡" },
  "上級": { label: "上級", mmLabel: "အဆင့်မြင့်", color: "text-orange-400", bg: "bg-orange-500", emoji: "🟠" },
};
const levelOrder = ["初級", "中級", "上級"];

export default function Home() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"home" | "search">("home");

  useEffect(() => { setFavorites(getFavorites()); }, []);

  const toggle = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(id);
    setFavorites(getFavorites());
  };

  const byLevel = levelOrder.reduce((acc, lvl) => {
    acc[lvl] = lessons.filter(l => l.level === lvl);
    return acc;
  }, {} as Record<string, typeof lessons>);

  const favLessons = favorites.map(id => lessons.find(l => l.id === id)).filter(Boolean) as typeof lessons;
  const newest = [...lessons].reverse().slice(0, 12);

  const searchResults = search.trim()
    ? lessons.filter(l => l.title.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-24">
      {/* ヘッダー */}
      <div className="px-4 pt-8 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">🇯🇵 မြန်မာ Japanese</h1>
            <p className="text-gray-500 text-xs mt-0.5">ဂျပန်သီချင်းနဲ့ ဘာသာစကားလေ့လာပါ</p>
          </div>
          <Link href="/vocab" className="flex items-center gap-1.5 text-yellow-400 text-sm border border-yellow-400/30 rounded-full px-3 py-1.5 hover:bg-yellow-400/10 transition">
            📖 <span>単語帳</span>
          </Link>
        </div>
            );
          })}
          <div className="flex-1 bg-gray-900 rounded-xl px-3 py-2 text-center border border-gray-800">
            <div className="text-lg font-bold text-white">{lessons.length}</div>
            <div className="text-gray-500 text-[10px]">🎵 合計</div>
          </div>
        </div>

        {/* 検索バー */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="曲名・アーティストを検索..."
            value={search}
            onChange={e => { setSearch(e.target.value); setActiveTab(e.target.value ? "search" : "home"); }}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
          />
          {search && (
            <button onClick={() => { setSearch(""); setActiveTab("home"); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">×</button>
          )}
        </div>
      </div>

      {/* 検索結果 */}
      {activeTab === "search" && (
        <div className="px-4 mt-2">
          <p className="text-gray-500 text-xs mb-3">{searchResults.length}件ヒット</p>
          <div className="grid grid-cols-2 gap-3">
            {searchResults.map(l => (
              <Card key={l.id} lesson={l} isFav={favorites.includes(l.id)} onToggle={toggle} grid />
            ))}
          </div>
        </div>
      )}

      {/* ホームコンテンツ */}
      {activeTab === "home" && (
        <>
          {favLessons.length > 0 && (
            <Section title="❤️ お気に入り" mmTitle="နှစ်သက်ရာ" color="text-pink-400">
              {favLessons.map(l => <Card key={l.id} lesson={l} isFav={true} onToggle={toggle} />)}
            </Section>
          )}

          <Section title="🆕 新着" mmTitle="နောက်ဆုံးထွက်" color="text-white">
            {newest.map(l => <Card key={l.id} lesson={l} isFav={favorites.includes(l.id)} onToggle={toggle} />)}
          </Section>

          {levelOrder.map(lvl => {
            const items = byLevel[lvl];
            if (!items?.length) return null;
            const cfg = levelConfig[lvl];
            return (
              <Section key={lvl} title={`${cfg.emoji} ${cfg.label}`} mmTitle={`${cfg.mmLabel} · ${items.length}曲`} color={cfg.color}>
                {items.map(l => <Card key={l.id} lesson={l} isFav={favorites.includes(l.id)} onToggle={toggle} />)}
              </Section>
            );
          })}
        </>
      )}

      {/* ボトムナビ */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur border-t border-gray-800 flex">
        <button onClick={() => { setActiveTab("home"); setSearch(""); }} className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-xs transition ${activeTab==="home"?"text-white":"text-gray-600"}`}>
          <span className="text-lg">🏠</span> ホーム
        </button>
        <button onClick={() => setActiveTab("search")} className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-xs transition ${activeTab==="search"?"text-white":"text-gray-600"}`}>
          <span className="text-lg">🔍</span> 検索
        </button>
        <Link href="/vocab" className="flex-1 py-3 flex flex-col items-center gap-0.5 text-xs text-gray-600 hover:text-white transition">
          <span className="text-lg">📖</span> 単語帳
        </Link>
      </div>
    </main>
  );
}

function Section({ title, mmTitle, color, children }: { title: string; mmTitle: string; color: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="px-4 mb-3 flex items-baseline gap-2">
        <h2 className={`text-base font-bold ${color}`}>{title}</h2>
        <span className="text-gray-600 text-xs">{mmTitle}</span>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        {children}
      </div>
    </div>
  );
}

function Card({ lesson, isFav, onToggle, grid }: { lesson: typeof lessons[0]; isFav: boolean; onToggle: (id: string, e: React.MouseEvent) => void; grid?: boolean }) {
  const parts = lesson.title.split(" / ");
  const songName = parts[0];
  const artist = parts[1] || "";
  const cfg = levelConfig[lesson.level];
  return (
    <Link href={`/lesson/${lesson.id}`} className={grid ? "block" : "flex-shrink-0 w-36"}>
      <div className="rounded-xl overflow-hidden bg-gray-900 border border-gray-800 active:scale-95 transition-all duration-150 hover:border-gray-600">
        <div className="relative aspect-video w-full bg-gray-800">
          <Image src={`https://img.youtube.com/vi/${lesson.videoId}/mqdefault.jpg`} alt={lesson.title} fill className="object-cover" unoptimized />
          <div className="absolute top-1.5 left-1.5">
            <span className={`${cfg?.bg || "bg-gray-500"} text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full`}>{lesson.level}</span>
          </div>
          <button
            onClick={(e) => onToggle(lesson.id, e)}
            className="absolute bottom-1.5 right-1.5 text-lg leading-none drop-shadow-lg active:scale-125 transition-transform"
          >
            {isFav ? "❤️" : "🤍"}
          </button>
        </div>
        <div className="p-2">
          <p className="text-white text-xs font-medium leading-tight truncate">{songName}</p>
          <p className="text-gray-500 text-[10px] truncate mt-0.5">{artist}</p>
        </div>
      </div>
    </Link>
  );
}
import Link from "next/link";
import Image from "next/image";
import { lessonsMeta } from "@/lib/subtitles";
const lessons = lessonsMeta;
import { useState, useEffect } from "react";
import { getFavorites, toggleFavorite } from "@/lib/storage";

const levelConfig: Record<string, { label: string; mmLabel: string; color: string; bg: string; emoji: string }> = {
  "初級": { label: "初級", mmLabel: "အခြေခံ", color: "text-green-400", bg: "bg-green-500", emoji: "🟢" },
  "中級": { label: "中級", mmLabel: "အလယ်အလတ်", color: "text-yellow-400", bg: "bg-yellow-500", emoji: "🟡" },
  "上級": { label: "上級", mmLabel: "အဆင့်မြင့်", color: "text-orange-400", bg: "bg-orange-500", emoji: "🟠" },
};
const levelOrder = ["初級", "中級", "上級"];

export default function Home() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"home" | "search">("home");

  useEffect(() => { setFavorites(getFavorites()); }, []);

  const toggle = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(id);
    setFavorites(getFavorites());
  };

  const byLevel = levelOrder.reduce((acc, lvl) => {
    acc[lvl] = lessons.filter(l => l.level === lvl);
    return acc;
  }, {} as Record<string, typeof lessons>);

  const favLessons = favorites.map(id => lessons.find(l => l.id === id)).filter(Boolean) as typeof lessons;
  const newest = [...lessons].reverse().slice(0, 12);

  const searchResults = search.trim()
    ? lessons.filter(l => l.title.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-24">
      {/* ヘッダー */}
      <div className="px-4 pt-8 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">🇯🇵 မြန်မာ Japanese</h1>
            <p className="text-gray-500 text-xs mt-0.5">ဂျပန်သီချင်းနဲ့ ဘာသာစကားလေ့လာပါ</p>
          </div>
          <Link href="/vocab" className="flex items-center gap-1.5 text-yellow-400 text-sm border border-yellow-400/30 rounded-full px-3 py-1.5 hover:bg-yellow-400/10 transition">
            📖 <span>単語帳</span>
          </Link>
        </div>
            );
          })}
          <div className="flex-1 bg-gray-900 rounded-xl px-3 py-2 text-center border border-gray-800">
            <div className="text-lg font-bold text-white">{lessons.length}</div>
            <div className="text-gray-500 text-[10px]">🎵 合計</div>
          </div>
        </div>

        {/* 検索バー */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="曲名・アーティストを検索..."
            value={search}
            onChange={e => { setSearch(e.target.value); setActiveTab(e.target.value ? "search" : "home"); }}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
          />
          {search && (
            <button onClick={() => { setSearch(""); setActiveTab("home"); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">×</button>
          )}
        </div>
      </div>

      {/* 検索結果 */}
      {activeTab === "search" && (
        <div className="px-4 mt-2">
          <p className="text-gray-500 text-xs mb-3">{searchResults.length}件ヒット</p>
          <div className="grid grid-cols-2 gap-3">
            {searchResults.map(l => (
              <Card key={l.id} lesson={l} isFav={favorites.includes(l.id)} onToggle={toggle} grid />
            ))}
          </div>
        </div>
      )}

      {/* ホームコンテンツ */}
      {activeTab === "home" && (
        <>
          {favLessons.length > 0 && (
            <Section title="❤️ お気に入り" mmTitle="နှစ်သက်ရာ" color="text-pink-400">
              {favLessons.map(l => <Card key={l.id} lesson={l} isFav={true} onToggle={toggle} />)}
            </Section>
          )}

          <Section title="🆕 新着" mmTitle="နောက်ဆုံးထွက်" color="text-white">
            {newest.map(l => <Card key={l.id} lesson={l} isFav={favorites.includes(l.id)} onToggle={toggle} />)}
          </Section>

          {levelOrder.map(lvl => {
            const items = byLevel[lvl];
            if (!items?.length) return null;
            const cfg = levelConfig[lvl];
            return (
              <Section key={lvl} title={`${cfg.emoji} ${cfg.label}`} mmTitle={`${cfg.mmLabel} · ${items.length}曲`} color={cfg.color}>
                {items.map(l => <Card key={l.id} lesson={l} isFav={favorites.includes(l.id)} onToggle={toggle} />)}
              </Section>
            );
          })}
        </>
      )}

      {/* ボトムナビ */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur border-t border-gray-800 flex">
        <button onClick={() => { setActiveTab("home"); setSearch(""); }} className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-xs transition ${activeTab==="home"?"text-white":"text-gray-600"}`}>
          <span className="text-lg">🏠</span> ホーム
        </button>
        <button onClick={() => setActiveTab("search")} className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-xs transition ${activeTab==="search"?"text-white":"text-gray-600"}`}>
          <span className="text-lg">🔍</span> 検索
        </button>
        <Link href="/vocab" className="flex-1 py-3 flex flex-col items-center gap-0.5 text-xs text-gray-600 hover:text-white transition">
          <span className="text-lg">📖</span> 単語帳
        </Link>
      </div>
    </main>
  );
}

function Section({ title, mmTitle, color, children }: { title: string; mmTitle: string; color: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="px-4 mb-3 flex items-baseline gap-2">
        <h2 className={`text-base font-bold ${color}`}>{title}</h2>
        <span className="text-gray-600 text-xs">{mmTitle}</span>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        {children}
      </div>
    </div>
  );
}

function Card({ lesson, isFav, onToggle, grid }: { lesson: typeof lessons[0]; isFav: boolean; onToggle: (id: string, e: React.MouseEvent) => void; grid?: boolean }) {
  const parts = lesson.title.split(" / ");
  const songName = parts[0];
  const artist = parts[1] || "";
  const cfg = levelConfig[lesson.level];
  return (
    <Link href={`/lesson/${lesson.id}`} className={grid ? "block" : "flex-shrink-0 w-36"}>
      <div className="rounded-xl overflow-hidden bg-gray-900 border border-gray-800 active:scale-95 transition-all duration-150 hover:border-gray-600">
        <div className="relative aspect-video w-full bg-gray-800">
          <Image src={`https://img.youtube.com/vi/${lesson.videoId}/mqdefault.jpg`} alt={lesson.title} fill className="object-cover" unoptimized />
          <div className="absolute top-1.5 left-1.5">
            <span className={`${cfg?.bg || "bg-gray-500"} text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full`}>{lesson.level}</span>
          </div>
          <button
            onClick={(e) => onToggle(lesson.id, e)}
            className="absolute bottom-1.5 right-1.5 text-lg leading-none drop-shadow-lg active:scale-125 transition-transform"
          >
            {isFav ? "❤️" : "🤍"}
          </button>
        </div>
        <div className="p-2">
          <p className="text-white text-xs font-medium leading-tight truncate">{songName}</p>
          <p className="text-gray-500 text-[10px] truncate mt-0.5">{artist}</p>
        </div>
      </div>
    </Link>
  );
}
