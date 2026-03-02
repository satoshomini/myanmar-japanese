import Link from "next/link";
import { lessons } from "@/lib/subtitles";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-4 safe-top">
        <h1 className="text-2xl font-bold">🇯🇵 မြန်မာ Japanese</h1>
        <p className="text-gray-400 text-sm mt-1">ဂျပန်ဘာသာ သင်ကြားမှု • ミャンマー人のための日本語</p>
      </div>

      {/* Lesson list */}
      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        <h2 className="text-base font-semibold text-gray-400 uppercase tracking-wider mb-3">レッスン一覧</h2>
        {lessons.map((lesson) => (
          <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
            <div className="bg-gray-800 active:bg-gray-700 rounded-2xl p-4 transition border border-gray-700 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base truncate">{lesson.title}</p>
                <p className="text-gray-400 text-sm mt-0.5 truncate">{lesson.titleMm}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="bg-yellow-500 text-black text-xs font-bold px-2.5 py-1 rounded-full">
                  {lesson.level}
                </span>
                <span className="text-gray-500">›</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
