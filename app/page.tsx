import Link from "next/link";
import { lessons } from "@/lib/subtitles";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🇯🇵 မြန်မာ Japanese</h1>
        <p className="text-gray-400 mb-8">ဂျပန်ဘာသာ သင်ကြားမှု • ミャンマー人のための日本語</p>

        <h2 className="text-xl font-semibold mb-4 text-yellow-400">レッスン一覧</h2>
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
              <div className="bg-gray-800 hover:bg-gray-700 rounded-xl p-5 transition cursor-pointer border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg">{lesson.title}</p>
                    <p className="text-gray-400 text-sm mt-1">{lesson.titleMm}</p>
                  </div>
                  <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                    {lesson.level}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
