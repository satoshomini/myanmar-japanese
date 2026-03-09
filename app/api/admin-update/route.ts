import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { lessonId, cues } = await req.json();
    if (!lessonId || !cues) return NextResponse.json({ error: "missing params" }, { status: 400 });

    const filePath = path.join(process.cwd(), "lib/subtitles.ts");
    let content = fs.readFileSync(filePath, "utf-8");

    // インデックス順で全行を置き換え（テキスト検索しない）
    const newLines = cues.map((c: any) =>
      `      { start: ${c.start}, end: ${c.end}, japanese: "${String(c.japanese).replace(/"/g,"'")}", romaji: "${String(c.romaji).replace(/"/g,"'")}", myanmar: "${String(c.myanmar).replace(/"/g,"'")}" },`
    ).join("\n");

    const regex = new RegExp(`(  \\{\\n    id: "${lessonId}"[\\s\\S]*?subtitles: \\[)([\\s\\S]*?)(\\n    \\],\\n  \\},)`);
    if (!regex.test(content)) return NextResponse.json({ error: "lesson not found" }, { status: 404 });

    content = content.replace(regex, `$1\n${newLines}$3`);
    fs.writeFileSync(filePath, content);

    await new Promise<void>((resolve, reject) => {
      exec(
        `GIT_SSH_COMMAND="ssh -i /Users/mini/.ssh/github_myanmar" git add lib/subtitles.ts && git commit -m "Admin: update lesson ${lessonId} timing" && GIT_SSH_COMMAND="ssh -i /Users/mini/.ssh/github_myanmar" git push`,
        { cwd: process.cwd() },
        (err, _stdout, stderr) => err ? reject(new Error(stderr)) : resolve()
      );
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
