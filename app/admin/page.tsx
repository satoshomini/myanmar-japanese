"use client";
import { useState } from "react";
import { lessons } from "@/lib/subtitles";

export default function AdminPage() {
  const [selectedId, setSelectedId] = useState(lessons[0]?.id || "");
  const lesson = lessons.find(l => l.id === selectedId);
  const [cues, setCues] = useState<typeof lesson.subtitles>([]);
  const [loaded, setLoaded] = useState(false);
  const [output, setOutput] = useState("");

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

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 font-mono text-sm">
      <h1 className="text-xl font-bold mb-4">🛠 字幕タイムスタンプ編集</h1>
      <div className="flex gap-2 mb-4 flex-wrap">
        <select
          className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
          value={selectedId}
          onChange={e => { setSelectedId(e.target.value); setLoaded(false); }}
        >
          {lessons.map(l => (
            <option key={l.id} value={l.id}>{l.id}. {l.title}</option>
          ))}
        </select>
        <button onClick={load} className="bg-blue-600 px-3 py-1 rounded">読み込む</button>
        {loaded && <button onClick={generate} className="bg-green-600 px-3 py-1 rounded">コード生成</button>}
      </div>

      {loaded && (
        <div className="space-y-1 mb-4">
          {cues.map((c, i) => (
            <div key={i} className="flex gap-2 items-center bg-gray-900 rounded px-2 py-1">
              <span className="text-gray-400 w-6 text-right">{i+1}</span>
              <input
                type="number"
                step="0.5"
                className="bg-gray-800 border border-gray-700 rounded px-1 w-20 text-center"
                value={c.start}
                onChange={e => {
                  const v = parseFloat(e.target.value);
                  setCues(prev => prev.map((x,j) => j===i ? {...x, start: v} : x));
                }}
              />
              <span className="text-gray-500">→</span>
              <input
                type="number"
                step="0.5"
                className="bg-gray-800 border border-gray-700 rounded px-1 w-20 text-center"
                value={c.end}
                onChange={e => {
                  const v = parseFloat(e.target.value);
                  setCues(prev => prev.map((x,j) => j===i ? {...x, end: v} : x));
                }}
              />
              <span className="flex-1 text-yellow-300 truncate">{c.japanese}</span>
            </div>
          ))}
        </div>
      )}

      {output && (
        <div>
          <p className="text-gray-400 mb-1">↓ lib/subtitles.ts の subtitles: [ ] 内に貼り付け</p>
          <textarea
            readOnly
            className="w-full h-64 bg-gray-900 border border-gray-700 rounded p-2 text-xs"
            value={output}
            onClick={e => (e.target as HTMLTextAreaElement).select()}
          />
        </div>
      )}
    </div>
  );
}
