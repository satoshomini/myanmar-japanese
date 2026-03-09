"use client";
import { useState, useRef, useEffect } from "react";
import { lessons } from "@/lib/subtitles";

declare global { interface Window { YT: any; onYouTubeIframeAPIReady: () => void; } }
type Cue = { start: number; end: number; japanese: string; romaji: string; myanmar: string };

export default function AdminPage() {
  const [selectedId, setSelectedId] = useState(lessons[0]?.id || "");
  const [cues, setCues] = useState<Cue[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [output, setOutput] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const lesson = lessons.find(l => l.id === selectedId);

  useEffect(() => {
    const initPlayer = () => {
      if (!containerRef.current || !lesson) return;
      if (playerRef.current) { playerRef.current.destroy(); }
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: lesson.videoId,
        width: "100%",
        events: {
          onStateChange: (e: any) => {
            clearInterval(intervalRef.current);
            if (e.data === 1) {
              intervalRef.current = setInterval(() => {
                setCurrentTime(playerRef.current?.getCurrentTime?.() || 0);
              }, 200);
            }
          }
        }
      });
    };
    if (window.YT) { initPlayer(); }
    else {
      window.onYouTubeIframeAPIReady = initPlayer;
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [selectedId]);

  function load() {
    if (!lesson) return;
    setCues(lesson.subtitles.map(c => ({ ...c })));
    setLoaded(true);
    setOutput("");
  }

  function generate() {
    const lines = cues.map(c =>
      `      { start: ${c.start}, end: ${c.end}, japanese: "${c.japanese.replace(/"/g,"'")}", romaji: "${c.romaji.replace(/"/g,"'")}", myanmar: "${c.myanmar.replace(/"/g,"'")}" },`
    ).join("\n");
    setOutput(lines);
  }

  function seekTo(t: number) { playerRef.current?.seekTo?.(t, true); }

  function setStartNow(i: number) {
    const t = Math.round(playerRef.current?.getCurrentTime?.() * 10) / 10 || 0;
    setCues(prev => prev.map((x, j) => j === i ? { ...x, start: t } : x));
  }

  const activeCue = cues.findIndex(c => currentTime >= c.start && currentTime < c.end);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 font-mono text-sm">
      <h1 className="text-xl font-bold mb-3">🛠 タイムスタンプ編集</h1>
      <div className="flex gap-2 mb-3 flex-wrap items-center">
        <select className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
          value={selectedId} onChange={e => { setSelectedId(e.target.value); setLoaded(false); setOutput(""); }}>
          {lessons.map(l => <option key={l.id} value={l.id}>{l.id}. {l.title}</option>)}
        </select>
        <button onClick={load} className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded">読み込む</button>
        {loaded && <button onClick={generate} className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded">コード生成</button>}
        <span className="text-yellow-400 font-bold">▶ {currentTime.toFixed(1)}s</span>
      </div>
      <div ref={containerRef} className="w-full max-w-xl mb-3 aspect-video bg-black" />
      {loaded && (
        <div className="space-y-0.5 mb-4 max-h-80 overflow-y-auto border border-gray-800 rounded p-1">
          {cues.map((c, i) => (
            <div key={i} className={`flex gap-1 items-center rounded px-1 py-0.5 cursor-pointer ${i === activeCue ? "bg-yellow-900" : "hover:bg-gray-800"}`}
              onClick={() => { const t = Math.round((playerRef.current?.getCurrentTime?.() || 0) * 10) / 10; setCues(prev => prev.map((x, j) => j === i ? { ...x, start: t } : x)); }}>
              <span className="text-gray-600 w-5 text-right text-xs">{i+1}</span>
              <input type="number" step="0.5" className="bg-gray-800 border border-gray-700 rounded px-1 w-16 text-center text-xs"
                value={c.start} onClick={e => e.stopPropagation()}
                onChange={e => setCues(prev => prev.map((x,j) => j===i ? {...x, start: parseFloat(e.target.value)||0} : x))} />
              <span className="text-gray-600 text-xs">-</span>
              <input type="number" step="0.5" className="bg-gray-800 border border-gray-700 rounded px-1 w-16 text-center text-xs"
                value={c.end} onClick={e => e.stopPropagation()}
                onChange={e => setCues(prev => prev.map((x,j) => j===i ? {...x, end: parseFloat(e.target.value)||0} : x))} />
              <button className="bg-orange-700 hover:bg-orange-500 px-1 rounded text-xs shrink-0"
                onClick={e => { e.stopPropagation(); setStartNow(i); }}>⏱</button>
              <span className={`flex-1 truncate text-xs ${i === activeCue ? "text-yellow-300 font-bold" : "text-gray-300"}`}>{c.japanese}</span>
            </div>
          ))}
        </div>
      )}
      {output && (
        <div>
          <p className="text-gray-500 mb-1 text-xs">↓ lib/subtitles.ts の subtitles: [] 内に貼り付け</p>
          <textarea readOnly className="w-full h-40 bg-gray-900 border border-gray-700 rounded p-2 text-xs"
            value={output} onClick={e => (e.target as HTMLTextAreaElement).select()} />
        </div>
      )}
    </div>
  );
}
