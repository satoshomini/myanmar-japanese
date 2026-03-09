"use client";

import Link from "next/link";
import Image from "next/image";
import { lessons } from "@/lib/subtitles";
import { useState, useEffect } from "react";
import { getFavorites, toggleFavorite } from "@/lib/storage";

const levelConfig: Record<string, { label: string; mmLabel: string; color: string }> = {
  "初級": { label: "初級", mmLabel: "အခြေခံ", color: "text-green-400" },
  "中級": { label: "中級", mmLabel: "အလယ်အလတ်", color: "text-yellow-400" },
  "上級": { label: "上級", mmLabel: "အဆင့်မြင့်", color: "text-orange-400" },
};
const levelOrder = ["初級", "中級", "上級"];

export default function Home() {
  const [favorites, setFavorites] = useState<string[]>([]);

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
  const newest = [...lessons].reverse().slice(0, 10);

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-10">
      <div className="px-4 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🇯🇵 မြန်မာ Japanese</h1>
          <p className="text-gray-500 text-sm mt-0.5">ဂျပန်သီချင်းနဲ့ ဘာသာစကားလေ့လာပါ</p>
        </div>
        <Link href="/vocab" className="text-yellow-400 text-sm border border-yellow-400/30 rounded-full px-3 py-1.5 hover:bg-yellow-400/10 transition">
          📖 単語帳
        </Link>
      </div>

      {favLessons.length > 0 && (
        <Section title="お気に入り" mmTitle="နှစ်သက်ရာ" color="text-pink-400">
          {favLessons.map(l => <Card key={l.id} lesson={l} isFav={true} onToggle={toggle} />)}
        </Section>
      )}

      <Section title="新着" mmTitle="နောက်ဆုံးထွက်" color="text-white">
        {newest.map(l => <Card key={l.id} lesson={l} isFav={favorites.includes(l.id)} onToggle={toggle} />)}
      </Section>

      {levelOrder.map(lvl => {
        const items = byLevel[lvl];
        if (!items?.length) return null;
        const cfg = levelConfig[lvl];
        return (
          <Section key={lvl} title={cfg.label} mmTitle={cfg.mmLabel} color={cfg.color}>
            {items.map(l => <Card key={l.id} lesson={l} isFav={favorites.includes(l.id)} onToggle={toggle} />)}
          </Section>
        );
      })}
    </main>
  );
}

function Section({ title, mmTitle, color, children }: { title: string; mmTitle: string; color: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="px-4 mb-3 flex items-baseline gap-2">
        <h2 className={`text-lg font-bold ${color}`}>{title}</h2>
        <span className="text-gray-500 text-sm">{mmTitle}</span>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2" style={{ scrollbarWidth: "none" }}>
        {children}
      </div>
    </div>
  );
}

function Card({ lesson, isFav, onToggle }: { lesson: typeof lessons[0]; isFav: boolean; onToggle: (id: string, e: React.MouseEvent) => void }) {
  const parts = lesson.title.split(" / ");
  const lvlColor = { "初級": "bg-green-500", "中級": "bg-yellow-500", "上級": "bg-orange-500" }[lesson.level] || "bg-gray-500";
  return (
    <Link href={`/lesson/${lesson.id}`} className="flex-shrink-0 w-36">
      <div className="rounded-xl overflow-hidden bg-gray-800 border border-gray-700 active:scale-95 transition-transform duration-150">
        <div className="relative aspect-video w-full bg-gray-900">
          <Image src={`https://img.youtube.com/vi/${lesson.videoId}/mqdefault.jpg`} alt={lesson.title} fill className="object-cover" unoptimized />
          <div className="absolute top-1.5 right-1.5">
            <span className={`${lvlColor} text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full`}>{lesson.level}</span>
          </div>
          <button
            onClick={(e) => onToggle(lesson.id, e)}
            className="absolute bottom-1.5 right-1.5 text-lg leading-none drop-shadow-md active:scale-125 transition-transform"
          >
            {isFav ? "❤️" : "🤍"}
          </button>
        </div>
        <div className="p-2">
          <p className="text-xs font-bold leading-tight line-clamp-2">{parts[0]}</p>
          <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{parts[1]}</p>
        </div>
      </div>
    </Link>
  );
}
