"use client";
import { useState, useRef, useEffect } from "react";
import { lessonsMeta, getLessonById } from "@/lib/subtitles";
import type { Lesson, LessonMeta } from "@/lib/subtitles";
const lessons = lessonsMeta;

declare global { interface Window { YT: any; onYouTubeIframeAPIReady: () => void; } }
type Cue = { start: number; end: number; japanese: string; romaji: string; myanmar: string };

export default function AdminPage() {
  const [selectedId, setSelectedId] = useState(lessons[0]?.id || "");
  const [cues, setCues] = useState<Cue[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [output, setOutput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [tapIndex, setTapIndex] = useState(0);
  const [tapMode, setTapMode] = useState(false);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const origCuesRef = useRef<Cue[]>([]);
  const tapIndexRef = useRef(0);
  const [offsetMsg, setOffsetMsg] = useState("");

  const [fullLesson, setFullLesson] = useState<Lesson | undefined>(undefined);
  useEffect(() => {
    getLessonById(selectedId).then(setFullLesson);
  }, [selectedId]);
  const lesson = fullLesson;

  useEffect(() => {
    if (!lesson) return;
    const init = () => {
      if (!containerRef.current) return;
      if (playerRef.current) {
        playerRef.current.loadVideoById(lesson.videoId);
        return;
      }
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: lesson.videoId,
        width: "100%",
        events: {
          onStateChange: (e: any) => {
            clearInterval(intervalRef.current);
            if (e.data === 1) {
              intervalRef.current = setInterval(() => {
                setCurrentTime(playerRef.current?.getCurrentTime?.() || 0);
              }, 100);
            }
          }
        }
      });
    };
    if (window.YT?.Player) { init(); }
    else {
      window.onYouTubeIframeAPIReady = init;
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [fullLesson]);

  useEffect(() => {
    const el = listRef.current?.children[tapIndex] as HTMLElement;
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [tapIndex]);

  useEffect(() => {
    if (!tapMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") { e.preventDefault(); handleTap(); }
      if (e.code === "ArrowLeft") goBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tapMode, tapIndex, cues]);

  function goBack() {
    if (tapIndexRef.current === 0) return;
    const prev = tapIndexRef.current - 1;
    tapIndexRef.current = prev;
    setTapIndex(prev);
  }

  function shiftAll(delta: number) {
    setCues(prev => prev.map((x, i, arr) => {
      const ns = Math.round((x.start + delta) * 10) / 10;
      const ne = i + 1 < arr.length
        ? Math.round((arr[i + 1].start + delta) * 10) / 10
        : Math.round((x.end + delta) * 10) / 10;
      return { ...x, start: ns, end: ne };
    }));
    setOffsetMsg(`全体を${delta >= 0 ? "+" : ""}${delta}s ずらした`);
  }

  function load() {
    if (!lesson) return;
    const initial = lesson.subtitles.map(c => ({ ...c }));
    origCuesRef.current = initial;
    setCues(initial);
    setLoaded(true);
    tapIndexRef.current = 0;
    setTapIndex(0);
    setOutput("");
    setOffsetMsg("");
  }

  function generate() {
    const lines = cues.map(c =>
      `      { start: ${c.start}, end: ${c.end}, japanese: "${c.japanese.replace(/"/g,"'")}", romaji: "${c.romaji.replace(/"/g,"'")}", myanmar: "${c.myanmar.replace(/"/g,"'")}" },`
    ).join("\n");
    setOutput(lines);
  }

  async function autoApply() {
    setSaving(true); setSaveMsg("");
    try {
      const res = await fetch("/api/admin-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: selectedId, cues }),
      });
      const data = await res.json();
      setSaveMsg(data.ok ? "✅ 反映完了！" : "❌ " + data.error);
    } catch (e: any) { setSaveMsg("❌ " + e.message); }
    setSaving(false);
  }

  function handleTap() {
    const idx = tapIndexRef.current;
    if (idx >= cues.length) return;
    const t = Math.round((playerRef.current?.getCurrentTime?.() || 0) * 10) / 10;
    setCues(prev => prev.map((x, j) => {
      if (j === idx) return { ...x, start: t };           // 現在の歌詞のstartを設定
      if (j === idx - 1) return { ...x, end: t };        // 前の歌詞のendを自動調整
      return x;
    }));
    const next = Math.min(idx + 1, cues.length - 1);
    tapIndexRef.current = next;
    setTapIndex(next);
  }

  // 表示用: tapIndex-1（今セットした歌詞）を表示。次にセットする歌詞はサブ表示
  const displayIndex = Math.max(0, tapIndex - 1);
  const nextIndex = tapIndex;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-3 font-mono text-sm select-none">
      <h1 className="text-lg font-bold mb-2">🛠 タイムスタンプ編集</h1>

      <div className="flex gap-2 mb-2 flex-wrap items-center">
        <select className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs"
          value={selectedId} onChange={e => { setSelectedId(e.target.value); setLoaded(false); setOutput(""); }}>
          {lessons.map(l => <option key={l.id} value={l.id}>{l.id}. {l.title}</option>)}
        </select>
        <button onClick={load} className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-xs">読み込む</button>
        {loaded && <button onClick={generate} className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-xs">コード生成</button>}
        {loaded && <button onClick={autoApply} disabled={saving} className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-3 py-1 rounded text-xs font-bold">{saving ? "反映中..." : "🚀 自動反映"}</button>}
        {saveMsg && <span className="text-xs font-bold">{saveMsg}</span>}
        {loaded && (
          <button onClick={() => setTapMode(m => !m)}
            className={`px-3 py-1 rounded text-xs font-bold ${tapMode ? "bg-orange-600" : "bg-gray-700"}`}>
            {tapMode ? "✋ タップ中" : "👆 タップモード"}
          </button>
        )}
        <span className="text-yellow-400 text-xs font-bold">▶ {currentTime.toFixed(1)}s</span>
      </div>

      <div ref={containerRef} className="w-full max-w-xl mb-2 aspect-video bg-black" />

      {loaded && tapMode && (
        <div className="mb-3">
          {/* 現在表示中の歌詞（tapIndex-1: 直前にセットしたもの） */}
          <div className="bg-gray-900 rounded-xl p-3 mb-1 text-center">
            <p className="text-gray-500 text-xs mb-1">
              {tapIndex === 0 ? "最初の歌詞" : `✅ セット済み ${displayIndex + 1} / ${cues.length}`}
            </p>
            <p className="text-white text-xl font-bold leading-snug">
              {tapIndex === 0 ? "▼ TAPで最初の歌詞のStartを設定" : cues[displayIndex]?.japanese}
            </p>
            {tapIndex > 0 && <p className="text-gray-400 text-xs mt-1">{cues[displayIndex]?.romaji}</p>}
          </div>
          {/* 次にタップする歌詞（小さく表示） */}
          {nextIndex < cues.length && (
            <div className="bg-gray-800 rounded-lg px-3 py-1.5 mb-2 text-center opacity-70">
              <p className="text-orange-400 text-xs font-bold">👆 次: {nextIndex + 1}/{cues.length}</p>
              <p className="text-gray-300 text-sm">{cues[nextIndex]?.japanese}</p>
            </div>
          )}
          <button
            onPointerDown={handleTap}
            className="w-full py-8 bg-orange-600 hover:bg-orange-500 active:bg-orange-400 active:scale-95 rounded-2xl text-3xl font-bold transition-all"
          >
            TAP
            <span className="block text-base font-normal opacity-70 mt-1">{currentTime.toFixed(1)}s</span>
          </button>
          <div className="flex gap-2 mt-2">
            <button onClick={goBack}
              className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm">← 戻る</button>
            <button onClick={() => setTapIndex(i => Math.min(cues.length - 1, i + 1))}
              className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm">スキップ →</button>
          </div>
          {offsetMsg && <p className="text-center text-green-400 text-xs mt-1 font-bold">{offsetMsg}</p>}
          <div className="flex gap-1 mt-2 justify-center">
            <span className="text-gray-500 text-xs self-center">全体:</span>
            {[-1, -0.5, -0.1, 0.1, 0.5, 1].map(d => (
              <button key={d} onClick={() => shiftAll(d)}
                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs font-mono">
                {d > 0 ? `+${d}` : d}s
              </button>
            ))}
          </div>
          <p className="text-center text-gray-500 text-xs mt-1">Space / ← キーでも操作できます</p>
        </div>
      )}

      {loaded && (
        <div ref={listRef} className="space-y-0.5 mb-3 max-h-52 overflow-y-auto border border-gray-800 rounded p-1">
          {cues.map((c, i) => (
            <div key={i}
              className={`flex gap-1 items-center rounded px-1 py-0.5 cursor-pointer transition-colors
                ${i === tapIndex && tapMode ? "bg-orange-900 ring-1 ring-orange-500" : "hover:bg-gray-800"}`}
              onClick={() => { tapIndexRef.current = i; setTapIndex(i); playerRef.current?.seekTo?.(c.start, true); }}>
              <span className="text-gray-600 w-5 text-right text-xs">{i+1}</span>
              <input type="number" step="0.5" className="bg-gray-800 border border-gray-700 rounded px-1 w-16 text-center text-xs"
                value={c.start} onClick={e => e.stopPropagation()}
                onChange={e => setCues(prev => prev.map((x,j) => j===i ? {...x, start: parseFloat(e.target.value)||0} : x))} />
              <span className="text-gray-600 text-xs">-</span>
              <input type="number" step="0.5" className="bg-gray-800 border border-gray-700 rounded px-1 w-16 text-center text-xs"
                value={c.end} onClick={e => e.stopPropagation()}
                onChange={e => setCues(prev => prev.map((x,j) => j===i ? {...x, end: parseFloat(e.target.value)||0} : x))} />
              <span className={`flex-1 truncate text-xs ${i === tapIndex && tapMode ? "text-orange-300 font-bold" : "text-gray-300"}`}>
                {c.japanese}
              </span>
            </div>
          ))}
        </div>
      )}

      {output && (
        <div>
          <p className="text-gray-500 mb-1 text-xs">↓ コピーして貼り付け</p>
          <textarea readOnly className="w-full h-40 bg-gray-900 border border-gray-700 rounded p-2 text-xs"
            value={output} onClick={e => (e.target as HTMLTextAreaElement).select()} />
        </div>
      )}
    </div>
  );
}
