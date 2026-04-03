import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { lessonId, cues } = await req.json();
    if (!lessonId || !cues) return NextResponse.json({ error: "missing params" }, { status: 400 });

    const chunkIdx = Math.floor((parseInt(lessonId) - 1) / 10);
    const filePath = path.join(process.cwd(), `public/lessons/chunk_${chunkIdx}.json`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: `chunk file not found: chunk_${chunkIdx}.json` }, { status: 404 });
    }

    const chunk: any[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const lessonIdx = chunk.findIndex((l: any) => l.id === lessonId);
    if (lessonIdx === -1) {
      return NextResponse.json({ error: `lesson ${lessonId} not found in chunk_${chunkIdx}.json` }, { status: 404 });
    }

    chunk[lessonIdx].subtitles = cues;
    fs.writeFileSync(filePath, JSON.stringify(chunk, null, 2));

    await new Promise<void>((resolve, reject) => {
      exec(
        `GIT_SSH_COMMAND="ssh -i /Users/mini/.ssh/github_myanmar" git add public/lessons/chunk_${chunkIdx}.json && git commit -m "Admin: update lesson ${lessonId} timing" && GIT_SSH_COMMAND="ssh -i /Users/mini/.ssh/github_myanmar" git push`,
        { cwd: process.cwd() },
        (err, _stdout, stderr) => err ? reject(new Error(stderr)) : resolve()
      );
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
