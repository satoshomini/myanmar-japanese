const Kuroshiro = require('kuroshiro').default;
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');
const fs = require('fs');

async function run() {
  const k = new Kuroshiro();
  await k.init(new KuromojiAnalyzer());
  const conv = async (t) => (await k.convert(
    t.replace(/[「」…。、　]/g,' '), {to:'romaji',mode:'spaced'}
  )).replace(/\s+/g,' ').trim().replace(/"/g,"'");

  const songs = JSON.parse(fs.readFileSync('/tmp/aligned_songs.json'));
  let existing = fs.readFileSync('lib/subtitles.ts','utf-8');
  const ids = [...existing.matchAll(/id: "(\d+)"/g)].map(m=>parseInt(m[1]));
  let id = ids.length ? Math.max(...ids) + 1 : 7;

  const blocks = [];
  for (const s of songs) {
    const cues = [];
    for (const c of s.cues) {
      const ro = await conv(c.japanese);
      cues.push(`      { start: ${c.start}, end: ${c.end}, japanese: "${c.japanese.replace(/"/g,"'")}", romaji: "${ro}", myanmar: "" },`);
    }
    blocks.push(`  {\n    id: "${id}",\n    title: "${s.title}",\n    titleMm: "${s.title}",\n    videoId: "${s.vid}",\n    level: "${s.level}",\n    subtitles: [\n${cues.join('\n')}\n    ],\n  },`);
    id++;
  }
  const lastIdx = existing.lastIndexOf('];');
  fs.writeFileSync('lib/subtitles.ts', existing.slice(0, lastIdx) + blocks.join('\n') + '\n];\n');
  console.log('Added', blocks.length, 'songs (id up to', id-1, ')');
}
run().catch(e => { console.error(e); process.exit(1); });
