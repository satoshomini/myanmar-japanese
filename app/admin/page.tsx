"use client";
import { useState, useRef } from "react";
import YouTube from "react-youtube";
import { lessons } from "@/lib/subtitles";

type Cue = { start: number; end: number; japanese: string; romaji: string; myanmar: string };

export default function AdminPage() {
  const [selectedId, setSelectedId] = useState(lessons[0]?.id || "");
  const [cues, setCues] = useState<Cue[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [output, setOutput] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef<any>(null);

  const lesson = lessons.find(l => l.id === selectedId);

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

  function seekTo(t: number) {
    playerRef.current?.seekTo(t, true);
  }

  function setStartNow(i: number) {
    setCurrentTime(ct => {
      setCues(prev => prev.map((x, j) => j === i ? { ...x, start: Math.round(ct * 10) / 10 } : x));
      return ct;
    });
  }

  const activeCue = cues.findIndex(c => currentTime >= c.start && currentTime < c.end);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 font-mono text-sm">
      <h1 className="text-xl font-bold mb-4">🛠 字幕タイムスタンプ編集</h1>

      <div className="flex gap-2 mb-4 flex-wrap items-center">
        <select
          className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
          value={selectedId}
          onChange={e => { setSelectedId(e.target.value); setLoaded(false); setOutput(""); }}
        >
          {lessons.map(l => (
            <option key={l.id} value={l.id}>{l.id}. {l.title}</option>
          ))}
        </select>
        <button onClick={load} className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded">読み込む</button>
        {loaded && <button onClick={generate} className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded">コード生成</button>}
        <span className="text-gray-400">現在: {currentTime.toFixed(1)}s</span>
      </div>

      {lesson && (
        <div className="mb-4 w-full max-w-xl">
          <YouTube
            videoId={lesson.videoId}
            opts={{ width: "100%", playerVars: { autoplay: 0 } }}
            onReady={e => { playerRef.current = e.target; }}
            onStateChange={e => {
              if (e.data === 1) {
                const interval = setInterval(() => {
                  setCurrentTime(playerRef.current?.getCurrentTime() || 0);
                }, 200);
                (playerRef.current as any)._interval = interval;
              } else {
                clearInterval((playerRef.current as any)?._interval);
              }
            }}
          />
        </div>
      )}

      {loaded && (
        <div className="space-y-1 mb-4 max-h-96 overflow-y-auto">
          {cues.map((c, i) => (
            <div
              key={i}
              className={`flex gap-1 items-center rounded px-2 py-1 cursor-pointer ${i === activeCue ? "bg-yellow-900" : "bg-gray-900 hover:bg-gray-800"}`}
              onClick={() => seekTo(c.start)}
            >
              <span className="text-gray-500 w-5 text-right text-xs">{i+1}</span>
              <input
                type="number" step="0.5"
                className="bg-gray-800 border border-gray-700 rounded px-1 w-18 text-center text-xs"
                value={c.start}
                onClick={e => e.stopPropagation()}
                onChange={e => setCues(prev => prev.map((x,j) => j===i ? {...x, start: parseFloat(e.target.value)} : x))}
              />
              <span className="text-gray-600 text-xs">→</span>
              <input
                type="number" step="0.5"
                className="bg-gray-800 border border-gray-700 rounded px-1 w-18 text-center text-xs"
                value={c.end}
                onClick={e => e.stopPropagation()}
                onChange={e => setCues(prev => prev.map((x,j) => j===i ? {...x, end: parseFloat(e.target.value)} : x))}
              />
              <button
                className="bg-orange-700 hover:bg-orange-600 px-1 rounded text-xs"
                onClick={e => { e.stopPropagation(); setStartNow(i); }}
                title="現在時刻をstartにセット"
              >⏱Now</button>
              <span className={`flex-1 truncate text-xs ${i === activeCue ? "text-yellow-300 font-bold" : "text-gray-300"}`}>{c.japanese}</span>
            </div>
          ))}
        </div>
      )}

      {output && (
        <div>
          <p className="text-gray-400 mb-1 text-xs">↓ lib/subtitles.ts の subtitles: [ ] 内に貼り付け</p>
          <textarea
            readOnly
            className="w-full h-48 bg-gray-900 border border-gray-700 rounded p-2 text-xs"
            value={output}
            onClick={e => (e.target as HTMLTextAreaElement).select()}
          />
        </div>
      )}
    </div>
  );
}
