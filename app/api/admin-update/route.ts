import { NextRequest, NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const REPO = "satoshomini/myanmar-japanese";
const BRANCH = "main";

async function getFile(path: string) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`, {
    headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub get failed: ${res.status}`);
  const data = await res.json();
  return { sha: data.sha, content: Buffer.from(data.content, "base64").toString("utf-8") };
}

async function putFile(path: string, content: string, sha: string, message: string) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: Buffer.from(content).toString("base64"), sha, branch: BRANCH }),
  });
  if (!res.ok) throw new Error(`GitHub put failed: ${res.status} ${await res.text()}`);
}

export async function POST(req: NextRequest) {
  try {
    const { lessonId, cues } = await req.json();
    if (!lessonId || !cues) return NextResponse.json({ error: "missing params" }, { status: 400 });

    const chunkIdx = Math.floor((parseInt(lessonId) - 1) / 10);
    const chunkPath = `public/lessons/chunk_${chunkIdx}.json`;

    const { sha: chunkSha, content: chunkRaw } = await getFile(chunkPath);
    const chunk: any[] = JSON.parse(chunkRaw);
    const li = chunk.findIndex((l: any) => l.id === lessonId);
    if (li === -1) return NextResponse.json({ error: `lesson ${lessonId} not found in chunk_${chunkIdx}` }, { status: 404 });

    chunk[li].subtitles = cues;
    await putFile(chunkPath, JSON.stringify(chunk), chunkSha, `Admin: update lesson ${lessonId} timing`);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
