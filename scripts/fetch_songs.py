import urllib.request, urllib.parse, json, re, time, sys, html as html_lib
import xml.etree.ElementTree as ET

def fetch_subtitles(vid):
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'ja,en;q=0.9',
    }
    req = urllib.request.Request(f"https://www.youtube.com/watch?v={vid}", headers=headers)
    page = urllib.request.urlopen(req, timeout=15).read().decode('utf-8')
    m = re.search(r'"captionTracks":(\[.*?\])', page)
    if not m: return None
    tracks = json.loads(m.group(1))
    def pri(t):
        lc = t.get('languageCode',''); g = t.get('kind','') == 'asr'
        if lc.startswith('ja') and not g: return 0
        if lc.startswith('ja'): return 1
        if not g: return 2
        return 3
    tracks.sort(key=pri)
    track = tracks[0]
    xml_req = urllib.request.Request(track['baseUrl'], headers=headers)
    xml_data = urllib.request.urlopen(xml_req, timeout=15).read().decode('utf-8')
    root = ET.fromstring(xml_data)
    cues = []
    for el in root.findall('.//text'):
        s = float(el.get('start',0)); d = float(el.get('dur',3))
        t = html_lib.unescape((el.text or '').replace('\n',' ')).strip()
        if t: cues.append({'start':s,'end':s+d,'text':t})
    return cues

def fetch_lrc(artist, title):
    q = urllib.parse.quote(f"{artist} {title}")
    req = urllib.request.Request(f"https://lrclib.net/api/search?q={q}", headers={'User-Agent': 'MyanmarJapanese/1.0'})
    hits = json.loads(urllib.request.urlopen(req, timeout=8).read())
    ja = [h for h in hits if h.get('syncedLyrics') and
          any('\u3040'<=c<='\u30ff' or '\u4e00'<=c<='\u9fff' for c in (h.get('syncedLyrics') or '')[:300])]
    if not ja: return None
    lines = []
    for line in ja[0]['syncedLyrics'].strip().split('\n'):
        mm = re.match(r'\[(\d+):(\d+\.\d+)\]\s*(.*)', line)
        if mm:
            t = int(mm.group(1))*60+float(mm.group(2)); text = mm.group(3).strip()
            if text: lines.append((t, text))
    return lines

def align(auto_cues, lrc_lines):
    if not auto_cues or not lrc_lines: return None
    offset = auto_cues[0]['start'] - lrc_lines[0][0]
    cues = []
    for i,(t,text) in enumerate(lrc_lines):
        s = max(0, t+offset); e = max(s+1, (lrc_lines[i+1][0]+offset) if i+1<len(lrc_lines) else s+5)
        cues.append({'start':round(s),'end':round(e),'japanese':text})
    return cues

candidates = [
    ("パプリカ / Foorin","Foorin","パプリカ","T0valuAksuo","初級"),
    ("にんじゃりばんばん / きゃりーぱみゅぱみゅ","きゃりーぱみゅぱみゅ","にんじゃりばんばん","teMdjJ3w9iM","初級"),
    ("ようかい体操第一 / Dream5","Dream5","ようかい体操第一","VyKLQXOj0ts","初級"),
    ("シュガーソングとビターステップ / UNISON SQUARE GARDEN","UNISON SQUARE GARDEN","シュガーソングとビターステップ","ERLEeGVWYxg","初級"),
    ("マリーゴールド / あいみょん","あいみょん","マリーゴールド","0xSiBpUdW4E","中級"),
    ("白日 / King Gnu","King Gnu","白日","ony539T074w","中級"),
    ("前前前世 / RADWIMPS","RADWIMPS","前前前世","PDSkFeMVNFs","中級"),
    ("群青 / YOASOBI","YOASOBI","群青","Y4nEEZwckuU","中級"),
    ("炎 / LiSA","LiSA","炎","4DxL6IKmXx4","中級"),
    ("怪物 / YOASOBI","YOASOBI","怪物","dy90tA3TT1c","中級"),
    ("春泥棒 / ヨルシカ","ヨルシカ","春泥棒","Sw1Flgub9s8","中級"),
    ("感電 / 米津玄師","米津玄師","感電","UFQEttrn6CQ","中級"),
    ("紅蓮華 / LiSA","LiSA","紅蓮華","x1FV6IrjZCY","中級"),
    ("ハルジオン / YOASOBI","YOASOBI","ハルジオン","kzdJkT4kp-A","中級"),
    ("もう少しだけ / YOASOBI","YOASOBI","もう少しだけ","K1Tz2yNmamI","中級"),
    ("アイドル / YOASOBI","YOASOBI","アイドル","ZRtdQ81jPUQ","中級"),
    ("ミックスナッツ / Official髭男dism","Official髭男dism","ミックスナッツ","CbH2F0kXgTY","中級"),
    ("Cry Baby / Official髭男dism","Official髭男dism","Cry Baby","O1bhZgkC4Gw","中級"),
    ("チェリー / スピッツ","スピッツ","チェリー","Eze6-eHmtJg","中級"),
    ("ロビンソン / スピッツ","スピッツ","ロビンソン","51CH3dPaWXc","中級"),
    ("366日 / HY","HY","366日","glsH4Mgxz-g","中級"),
    ("さくら / 森山直太朗","森山直太朗","さくら","p_2F2lKV9uA","中級"),
    ("First Love / 宇多田ヒカル","宇多田ヒカル","First Love","o1sUaVJUeB0","中級"),
    ("ハナミズキ / 一青窈","一青窈","ハナミズキ","TngUo1gDNOg","中級"),
    ("カタオモイ / Aimer","Aimer","カタオモイ","fULxdsuzN08","中級"),
    ("Subtitle / Official髭男dism","Official髭男dism","Subtitle","hN5MBlGv2Ac","上級"),
    ("残響散歌 / Aimer","Aimer","残響散歌","tLQLa6lM3Us","上級"),
    ("海の幽霊 / 米津玄師","米津玄師","海の幽霊","1s84rIhPuhk","上級"),
    ("廻廻奇譚 / Eve","Eve","廻廻奇譚","1tk1pqwrOys","上級"),
    ("ドラえもんのうた / 大杉久美子","大杉久美子","ドラえもんのうた","ypRTzt1KrF8","初級"),
    ("アンパンマンのマーチ / ドリーミング","ドリーミング","アンパンマンのマーチ","5mLape5F0Fw","初級"),
    ("さんぽ / 井上あずみ","井上あずみ","さんぽ","KjqNqm23Ti0","初級"),
    ("世界に一つだけの花 / SMAP","SMAP","世界に一つだけの花","qZq-q75KeMw","初級"),
    ("ひまわりの約束 / 秦基博","秦基博","ひまわりの約束","rKsQ-3N-Bks","初級"),
    ("虹 / 菅田将暉","菅田将暉","虹","hkBbUf4oGfA","初級"),
    ("だから僕は音楽を辞めた / ヨルシカ","ヨルシカ","だから僕は音楽を辞めた","KTZ-y85Erus","上級"),
    ("ただ君に晴れ / ヨルシカ","ヨルシカ","ただ君に晴れ","ZdzoLCLliW0","上級"),
    ("春はゆく / Aimer","Aimer","春はゆく","ekP7VLeXnqY","上級"),
    ("猫 / DISH//","DISH//","猫","es-TULCdfvQ","上級"),
    ("正直 / back number","back number","正直","kNH3eExqWFw","上級"),
    ("花束を君に / 宇多田ヒカル","宇多田ヒカル","花束を君に","yCZFof7Y0tQ","上級"),
    ("One Last Kiss / 宇多田ヒカル","宇多田ヒカル","One Last Kiss","0Uhh62MUEic","上級"),
    ("蒼のワルツ / Eve","Eve","蒼のワルツ","pyDCubgU57g","上級"),
]

with open('lib/subtitles.ts') as f:
    existing = f.read()
existing_vids = set(re.findall(r'videoId: "([^"]+)"', existing))

results = []
skipped = []

for song_title, artist, title, vid, level in candidates:
    if vid in existing_vids:
        print(f"⏭ {song_title}: 既存スキップ"); continue
    print(f"[{len(results)+len(skipped)+1}] {song_title} ...", flush=True)
    try:
        auto_cues = fetch_subtitles(vid)
        if not auto_cues:
            print(f"  → 字幕なし"); skipped.append(song_title); time.sleep(5); continue
        lrc_lines = fetch_lrc(artist, title)
        if not lrc_lines:
            print(f"  → LRCなし"); skipped.append(song_title); time.sleep(2); continue
        cues = align(auto_cues, lrc_lines)
        if not cues:
            skipped.append(song_title); continue
        results.append({'title':song_title,'vid':vid,'level':level,'cues':cues})
        print(f"  ✅ {len(cues)} lines")
        time.sleep(8)
    except Exception as e:
        err = str(e)[:80]
        print(f"  ❌ {err}")
        skipped.append(song_title)
        if '429' in err:
            print("  → 429! 120秒待機..."); time.sleep(120)
        else:
            time.sleep(8)

print(f"\n✅ {len(results)}曲 / ❌ {len(skipped)}曲スキップ")
with open('/tmp/aligned_songs.json','w') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
if not results:
    sys.exit(1)
