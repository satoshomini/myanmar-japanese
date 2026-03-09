import Link from "next/link";
import Image from "next/image";
import { lessons } from "@/lib/subtitles";

const levelConfig: Record<string, { label: string; mmLabel: string; color: string }> = {
  "N5": { label: "N5 入門", mmLabel: "အခြေခံ", color: "text-green-400" },
  "N4": { label: "N4 基礎", mmLabel: "အခြေခံ ၂", color: "text-blue-400" },
  "N3": { label: "N3 中級", mmLabel: "အလယ်အလတ်", color: "text-yellow-400" },
  "N2": { label: "N2 上級", mmLabel: "အဆင့်မြင့်", color: "text-orange-400" },
  "N1": { label: "N1 最上級", mmLabel: "ကျွမ်းကျင်", color: "text-red-400" },
};

const levelOrder = ["N5", "N4", "N3", "N2", "N1"];

export default function Home() {
  const byLevel = levelOrder.reduce((acc, lvl) => {
    acc[lvl] = lessons.filter(l => l.level === lvl);
    return acc;
  }, {} as Record<string, typeof lessons>);

  const allLessons = [...lessons].reverse().slice(0, 10); // 新着

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-10">
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <h1 className="text-2xl font-bold">🇯🇵 မြန်မာ Japanese</h1>
        <p className="text-gray-500 text-sm mt-0.5">ဂျပန်သီချင်းနဲ့ ဘာသာစကားလေ့လာပါ</p>
      </div>

      {/* 新着 */}
      <Section title="新着" mmTitle="နောက်ဆုံးထွက်" color="text-white">
        {allLessons.map(lesson => <Card key={lesson.id} lesson={lesson} />)}
      </Section>

      {/* レベル別 */}
      {levelOrder.map(lvl => {
        const items = byLevel[lvl];
        if (!items?.length) return null;
        const cfg = levelConfig[lvl];
        return (
          <Section key={lvl} title={cfg.label} mmTitle={cfg.mmLabel} color={cfg.color}>
            {items.map(lesson => <Card key={lesson.id} lesson={lesson} />)}
          </Section>
        );
      })}
    </main>
  );
}

function Section({ title, mmTitle, color, children }: {
  title: string; mmTitle: string; color: string; children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <div className="px-4 mb-3 flex items-baseline gap-2">
        <h2 className={`text-lg font-bold ${color}`}>{title}</h2>
        <span className="text-gray-500 text-sm">{mmTitle}</span>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide"
           style={{ scrollbarWidth: 'none' }}>
        {children}
      </div>
    </div>
  );
}

function Card({ lesson }: { lesson: typeof lessons[0] }) {
  const [songTitle, artist] = lesson.title.split(' / ');
  return (
    <Link href={`/lesson/${lesson.id}`} className="flex-shrink-0 w-36">
      <div className="rounded-xl overflow-hidden bg-gray-800 border border-gray-700 active:scale-95 transition-transform duration-150">
        <div className="relative aspect-video w-full bg-gray-900">
          <Image
            src={`https://img.youtube.com/vi/${lesson.videoId}/mqdefault.jpg`}
            alt={lesson.title}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute top-1.5 right-1.5">
            <span className="bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {lesson.level}
            </span>
          </div>
        </div>
        <div className="p-2">
          <p className="text-xs font-bold leading-tight line-clamp-2">{songTitle}</p>
          <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{artist}</p>
        </div>
      </div>
    </Link>
  );
}
