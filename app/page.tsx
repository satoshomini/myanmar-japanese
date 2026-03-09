import Link from "next/link";
import Image from "next/image";
import { lessons } from "@/lib/subtitles";

const levelConfig: Record<string, { label: string; mmLabel: string; color: string }> = {
  "初級": { label: "初級", mmLabel: "အခြေခံ", color: "text-green-400" },
  "中級": { label: "中級", mmLabel: "အလယ်အလတ်", color: "text-yellow-400" },
  "上級": { label: "上級", mmLabel: "အဆင့်မြင့်", color: "text-orange-400" },
};

const levelOrder = ["初級", "中級", "上級"];

export default function Home() {
  const byLevel = levelOrder.reduce((acc, lvl) => {
    acc[lvl] = lessons.filter(l => l.level === lvl);
    return acc;
  }, {} as Record<string, typeof lessons>);

  const newest = [...lessons].reverse().slice(0, 10);

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-10">
      <div className="px-4 pt-8 pb-4">
        <h1 className="text-2xl font-bold">🇯🇵 မြန်မာ Japanese</h1>
        <p className="text-gray-500 text-sm mt-0.5">ဂျပန်သီချင်းနဲ့ ဘာသာစကားလေ့လာပါ</p>
      </div>

      <Section title="新着" mmTitle="နောက်ဆုံးထွက်" color="text-white">
        {newest.map(l => <Card key={l.id} lesson={l} />)}
      </Section>

      {levelOrder.map(lvl => {
        const items = byLevel[lvl];
        if (!items?.length) return null;
        const cfg = levelConfig[lvl];
        return (
          <Section key={lvl} title={cfg.label} mmTitle={cfg.mmLabel} color={cfg.color}>
            {items.map(l => <Card key={l.id} lesson={l} />)}
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
      <div className="flex gap-3 overflow-x-auto px-4 pb-2" style={{ scrollbarWidth: 'none' }}>
        {children}
      </div>
    </div>
  );
}

function Card({ lesson }: { lesson: typeof lessons[0] }) {
  const parts = lesson.title.split(' / ');
  const songTitle = parts[0];
  const artist = parts[1] || '';
  const lvlColor = { '初級': 'bg-green-500', '中級': 'bg-yellow-500', '上級': 'bg-orange-500' }[lesson.level] || 'bg-gray-500';
  return (
    <Link href={`/lesson/${lesson.id}`} className="flex-shrink-0 w-36">
      <div className="rounded-xl overflow-hidden bg-gray-800 border border-gray-700 active:scale-95 transition-transform duration-150">
        <div className="relative aspect-video w-full bg-gray-900">
          <Image src={`https://img.youtube.com/vi/${lesson.videoId}/mqdefault.jpg`} alt={lesson.title} fill className="object-cover" unoptimized />
          <div className="absolute top-1.5 right-1.5">
            <span className={`${lvlColor} text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full`}>{lesson.level}</span>
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
