import Link from "next/link";
import Image from "next/image";
import { lessons } from "@/lib/subtitles";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="px-4 pt-8 pb-6 text-center">
        <h1 className="text-3xl font-bold mb-1">🇯🇵 မြန်မာ Japanese</h1>
        <p className="text-gray-400 text-sm">ဂျပန်ဘာသာ သင်ကြားမှု • ミャンマー人のための日本語</p>
      </div>

      {/* 2-column grid */}
      <div className="px-4 pb-8 grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        {lessons.map((lesson) => (
          <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
            <div className="bg-gray-900 rounded-2xl overflow-hidden active:scale-95 transition-transform duration-150 border border-gray-800">
              {/* Thumbnail */}
              <div className="relative aspect-video w-full bg-gray-800">
                <Image
                  src={`https://img.youtube.com/vi/${lesson.videoId}/mqdefault.jpg`}
                  alt={lesson.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {/* Level badge overlay */}
                <div className="absolute top-2 right-2">
                  <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                    {lesson.level}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="font-bold text-sm leading-tight line-clamp-1">{lesson.title.split(' / ')[0]}</p>
                <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{lesson.title.split(' / ')[1]}</p>
                <p className="text-gray-600 text-xs mt-1.5">{lesson.subtitles.length} フレーズ</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
