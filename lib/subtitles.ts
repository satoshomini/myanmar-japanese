export interface SubtitleCue {
  start: number;
  end: number;
  japanese: string;
  romaji: string;
  myanmar: string;
}

export interface Lesson {
  id: string;
  title: string;
  titleMm: string;
  videoId: string;
  level: string;
  subtitles: SubtitleCue[];
}

export const lessons: Lesson[] = [
  {
    id: "1",
    title: "あとひとつ / FUNKY MONKEY BABYS",
    titleMm: "နောက်တစ်ခုထပ် / ဂျပန်သီချင်း လေ့လာစာ",
    videoId: "bGBy80LdkPI",
    level: "N3",
    subtitles: [
      { start: 13, end: 19, japanese: "あと一粒の涙で ひと言の勇気で", romaji: "ato ichi tsubu no namida de hitokoto no yūki de", myanmar: "မျက်ရည်တစ်စက်ထပ်နဲ့ စကားတစ်ခွန်းရဲ့ ရဲစွမ်းသတ္တိနဲ့" },
      { start: 19, end: 25, japanese: "願いがかなう その時が来るって", romaji: "negai ga kanau sono toki ga kuru tte", myanmar: "ဆုတောင်းချက် ပြည့်မြောက်မည့် အချိန် ရောက်လာမယ်လို့" },
      { start: 25, end: 31, japanese: "僕は信じているから 君もあきらめないでいて", romaji: "boku wa shinji te iru kara kimi mo akirame nai de i te", myanmar: "ငါ ယုံကြည်နေတာမို့ မင်းလည်း လက်မလျှော့နဲ့" },
      { start: 31, end: 50, japanese: "何度でも この両手を あの空へ", romaji: "nan do demo kono ryōte o ano sora e", myanmar: "ဘယ်နှစ်ကြိမ်မဆို ဒီလက်နှစ်ဖက်ကို ထိုမိုးကောင်းကင်ဆီ" },
      { start: 50, end: 53, japanese: "あの日もこんな夏だった", romaji: "ano hi mo konna natsu datsu ta", myanmar: "ထိုနေ့ကလည်း ဒီလို နွေရာသီပဲ" },
      { start: 53, end: 56, japanese: "砂まじりの風が吹いていた", romaji: "suna majiri no kaze ga fui te i ta", myanmar: "သဲပါသောလေ တိုက်ခဲ့တယ်" },
      { start: 56, end: 62, japanese: "グラウンドの真上の空 夕日がまぶしくて", romaji: "guraundo no ma uwanosora yūhi ga mabushiku te", myanmar: "ကွင်းပြင်အပေါ် မိုးကောင်းကင် နေဝင်ချိန် အလွန်တောက်ပတယ်" },
      { start: 62, end: 65, japanese: "どこまで頑張ればいいんだ", romaji: "doko made gambare ba ii n da", myanmar: "ဘယ်လောက်ထိ ကြိုးစားရမှာလဲ" },
      { start: 65, end: 68, japanese: "ぎゅっと唇を噛みしめた", romaji: "gyutto kuchibiru o kamishime ta", myanmar: "နှုတ်ခမ်းကို တင်းကြပ်စွာ ကိုက်မိတယ်" },
      { start: 68, end: 74, japanese: "そんな時 同じ目をした 君に出会ったんだ", romaji: "sonna toki onaji me o shi ta kun ni deatta n da", myanmar: "ထိုအချိန် တူညီသောမျက်လုံးရှိသော မင်းနဲ့ တွေ့ဆုံခဲ့တယ်" },
      { start: 74, end: 86, japanese: "そう 簡単じゃないからこそ 夢はこんなに輝くんだと", romaji: "sō kantan ja nai kara koso yume wa konnani kagayaku n da to", myanmar: "ဟုတ်တယ် လွယ်မဟုတ်တာကြောင့်ပဲ အိပ်မက်က ဒီလောက် တောက်ပနေတယ်" },
      { start: 86, end: 98, japanese: "そう あの日の君の言葉 今でも胸に抱きしめてるよ", romaji: "sō ano hi no kimi no kotoba ima demo mune ni dakishime teru yo", myanmar: "ဟုတ်တယ် ထိုနေ့ မင်းရဲ့ စကားကို အခုထိ ရင်ခွင်မှာ ဆုပ်ကိုင်ထားတယ်" },
      { start: 98, end: 104, japanese: "あと一粒の涙で ひと言の勇気で", romaji: "ato ichi tsubu no namida de hitokoto no yūki de", myanmar: "မျက်ရည်တစ်စက်ထပ်နဲ့ စကားတစ်ခွန်းရဲ့ ရဲစွမ်းသတ္တိနဲ့" },
      { start: 104, end: 110, japanese: "願いがかなう その時が来るって", romaji: "negai ga kanau sono toki ga kuru tte", myanmar: "ဆုတောင်းချက် ပြည့်မြောက်မည့် အချိန် ရောက်လာမယ်လို့" },
      { start: 110, end: 116, japanese: "僕は信じてるから 君もあきらめないでいて", romaji: "boku wa shinji teru kara kimi mo akirame nai de i te", myanmar: "ငါ ယုံကြည်နေတာမို့ မင်းလည်း လက်မလျှော့နဲ့" },
      { start: 116, end: 121, japanese: "何度でも この両手を", romaji: "nan do demo kono ryōte o", myanmar: "ဘယ်နှစ်ကြိမ်မဆို ဒီလက်နှစ်ဖက်ကို" },
      { start: 121, end: 134, japanese: "あの空へ のばして あの空へ", romaji: "ano sora e nobashi te ano sora e", myanmar: "ထိုမိုးကောင်းကင်ဆီ ဆန့်ကာ ထိုမိုးကောင်းကင်ဆီ" },
      { start: 134, end: 138, japanese: "いつもどうしても素直になれずに", romaji: "itsumo dōshitemo sunao ni nare zu ni", myanmar: "အမြဲ ဘာကြောင့်မှန်းမသိ ရိုးသားစွာမနေနိုင်ဘဲ" },
      { start: 138, end: 141, japanese: "自信なんてまるで持てずに", romaji: "jishin nante marude mote zu ni", myanmar: "ယုံကြည်မှုလည်း လုံးဝမရှိဘဲ" },
      { start: 141, end: 147, japanese: "校舎の裏側 人目を気にして歩いていた", romaji: "kōsha no uragawa hitome o ki ni shi te arui te i ta", myanmar: "ကျောင်းနောက်ဖေး သူများမျက်စိကို သတိထားကာ လျှောက်ခဲ့တယ်" },
      { start: 147, end: 150, japanese: "誰かとぶつかりあうことを", romaji: "dare ka to butsukari au koto o", myanmar: "တစ်ယောက်ယောက်နဲ့ ရင်ဆိုင်တာကို" },
      { start: 150, end: 153, japanese: "心のどこかで遠ざけた", romaji: "kokoro no doko ka de tōzake ta", myanmar: "နှလုံးသားထဲ တစ်နေရာမှာ ဝေးကွာအောင် ထားခဲ့တယ်" },
      { start: 153, end: 156, japanese: "それは本当の自分を", romaji: "sore wa hontō no jibun o", myanmar: "ဒါက တကယ်ကိုယ့်ကိုယ်ကို" },
      { start: 156, end: 160, japanese: "見せるのが怖いだけだったんだと", romaji: "miseru no ga kowai dake datsu ta n da to", myanmar: "ပြဖို့ ကြောက်ရွံ့ရုံသာ ဖြစ်ကြောင်း" },
      { start: 160, end: 164, japanese: "教えてくれたのは", romaji: "oshie te kure ta no wa", myanmar: "သွန်သင်ပေးခဲ့တာ" },
      { start: 164, end: 171, japanese: "君と過ごした今日までの日々", romaji: "kimi to sugoshi ta kyō made no hibi", myanmar: "မင်းနဲ့ ဖြတ်သန်းခဲ့သောနေ့ရက်တွေ ဖြစ်တယ်" },
      { start: 171, end: 176, japanese: "そう初めて口に出来た", romaji: "sō hajimete kuchi ni deki ta", myanmar: "ဟုတ်တယ် ပထမဆုံး ပြောနိုင်ခဲ့တယ်" },
      { start: 176, end: 183, japanese: "泣きたいくらいの本当の夢を", romaji: "naki tai kurai no hontō no yume o", myanmar: "ငိုချင်လောက်သော တကယ့်အိပ်မက်ကို" },
      { start: 183, end: 189, japanese: "あとひとつの坂道を ひとつだけの夜を", romaji: "ato hitotsu no sakamichi o hitotsu dake no yoru o", myanmar: "နောက်တစ်ခု တောင်ကြားလမ်း တစ်ညတည်းသော ညကို" },
      { start: 189, end: 195, japanese: "越えられたなら 笑える日がくるって", romaji: "koe rare ta nara waraeru hi ga kurutte", myanmar: "ကျော်လွန်နိုင်ရင် ရယ်မောနိုင်သောနေ့ ရောက်လာမယ်လို့" },
      { start: 195, end: 202, japanese: "今日も信じてるから 君もあきらめないでいて", romaji: "kyō mo shinji teru kara kimi mo akirame nai de i te", myanmar: "ဒီနေ့လည်း ယုံကြည်နေတာမို့ မင်းလည်း လက်မလျှော့နဲ့" },
      { start: 202, end: 206, japanese: "何度でも この両手を", romaji: "nan do demo kono ryōte o", myanmar: "ဘယ်နှစ်ကြိမ်မဆို ဒီလက်နှစ်ဖက်ကို" },
      { start: 206, end: 219, japanese: "あの空へ", romaji: "ano sora e", myanmar: "ထိုမိုးကောင်းကင်ဆီ" },
      { start: 219, end: 224, japanese: "あつくなっても無駄なんて言葉", romaji: "atsuku natte mo muda nante kotoba", myanmar: "စိတ်အားထက်သန်ရင် အချည်းနှီးဆိုတဲ့ စကား" },
      { start: 224, end: 231, japanese: "聞き飽きたよ もしもそうだとしても", romaji: "kiki aki ta yo moshimo sō da toshite mo", myanmar: "ကြားငြီးပြီ အဲဒီလို ဖြစ်ပါစေ" },
      { start: 231, end: 239, japanese: "抑えきれないこの気持ちを 希望と呼ぶなら", romaji: "osae kire nai kono kimochi o kibō to yobu nara", myanmar: "ထိန်းမနိုင်တဲ့ ဒီစိတ်ကို မျှော်လင့်ချက်လို့ ခေါ်မယ်ဆိုရင်" },
      { start: 239, end: 250, japanese: "いったい 誰が止められると言うのだろう", romaji: "ittai dare ga tome rareru to iu no daro u", myanmar: "တကယ်တော့ ဘယ်သူက တားဆီးနိုင်မယ်လို့ ဆိုကြသလဲ" },
      { start: 250, end: 256, japanese: "あと一粒の涙が あとひと言の勇気が", romaji: "ato ichi tsubu no namida ga ato hitokoto no yūki ga", myanmar: "မျက်ရည်တစ်စက် ရဲစွမ်းသတ္တိ နောက်တစ်ခွန်း" },
      { start: 256, end: 262, japanese: "明日を変えるその時を見たんだ", romaji: "ashita o kaeru sono toki o mi ta n da", myanmar: "မနက်ဖြန်ကို ပြောင်းမည့် အချိန်ကို မြင်ခဲ့တယ်" },
      { start: 262, end: 268, japanese: "なくしかけた光 君が思い出させてくれた", romaji: "nakushi kake ta hikari kimi ga omoidasa se te kure ta", myanmar: "ဆုံးရှုံးတော့မည့် အလင်းကို မင်းက သတိရစေခဲ့တယ်" },
      { start: 268, end: 274, japanese: "あの日の景色 忘れない", romaji: "ano hi no keshiki wasure nai", myanmar: "ထိုနေ့ မြင်ကွင်းကို မမေ့နိုင်ဘူး" },
      { start: 274, end: 281, japanese: "あと一粒の涙で ひと言の勇気で", romaji: "ato ichi tsubu no namida de hitokoto no yūki de", myanmar: "မျက်ရည်တစ်စက်ထပ်နဲ့ စကားတစ်ခွန်းရဲ့ ရဲစွမ်းသတ္တိနဲ့" },
      { start: 281, end: 286, japanese: "願いがかなう その時が来るって", romaji: "negai ga kanau sono toki ga kuru tte", myanmar: "ဆုတောင်းချက် ပြည့်မြောက်မည့် အချိန် ရောက်လာမယ်လို့" },
      { start: 286, end: 293, japanese: "僕は信じてるから 君もあきらめないでいて", romaji: "boku wa shinji teru kara kimi mo akirame nai de i te", myanmar: "ငါ ယုံကြည်နေတာမို့ မင်းလည်း လက်မလျှော့နဲ့" },
      { start: 293, end: 298, japanese: "何度でも この両手を", romaji: "nan do demo kono ryōte o", myanmar: "ဘယ်နှစ်ကြိမ်မဆို ဒီလက်နှစ်ဖက်ကို" },
      { start: 298, end: 999, japanese: "あの空へ のばして あの空へ", romaji: "ano sora e nobashi te ano sora e", myanmar: "ထိုမိုးကောင်းကင်ဆီ ဆန့်ကာ ထိုမိုးကောင်းကင်ဆီ" },
    ],
  },
  {
    id: "2",
    title: "secret base〜君がくれたもの〜 / ZONE",
    titleMm: "လျှို့ဝှက်ဌာနချို / ဂျပန်သီချင်း",
    videoId: "ACo60qnd_Lc",
    level: "N3",
    subtitles: [
      { start: 14, end: 18, japanese: "君と夏の終わり 将来の夢", romaji: "kimi to natsu no owari shōrai no yume", myanmar: "မင်းနဲ့ နွေရာသီကုန်ချိန် အနာဂတ်အိပ်မက်" },
      { start: 18, end: 22, japanese: "大きな希望 忘れない", romaji: "ōkina kibō wasure nai", myanmar: "မြော်လင့်ချက်ကြီး မမေ့နိုင်ဘူး" },
      { start: 22, end: 24, japanese: "10年後の8月", romaji: "10 nen go no 8 tsuki", myanmar: "၁၀ နှစ်နောက် သြဂုတ်လမှာ" },
      { start: 24, end: 29, japanese: "また出会えるの 信じて", romaji: "mata deaeru no shinji te", myanmar: "တစ်ဖန်တွေ့နိုင်မယ်လို့ ယုံကြည်တယ်" },
      { start: 54, end: 61, japanese: "出会いはふっとした瞬間 帰り道の交差点で", romaji: "deai wa futto shi ta shunkan kaerimichi no kōsaten de", myanmar: "တွေ့ဆုံမှုက မမျှော်ထားသောအချိန် အပြန်လမ်း လမ်းဆုံမှာ" },
      { start: 61, end: 68, japanese: "声をかけてくれたね 「一緒に帰ろう」", romaji: "koe o kake te kure ta ne ' issho ni kaerō '", myanmar: "ခေါ်ဆိုပေးခဲ့တယ် 'အတူတူ ပြန်ကြရအောင်'" },
      { start: 68, end: 76, japanese: "僕は照れくさそうに カバンで顔を隠しながら", romaji: "boku wa terekusa sō ni kaban de kao o kakushi nagara", myanmar: "ကျွန်တော် ရှက်ရွံ့ဟန်နဲ့ အိတ်နဲ့မျက်နှာဖုံးရင်း" },
      { start: 76, end: 83, japanese: "本当はとてもとても 嬉しかったよ", romaji: "hontōwa totemo totemo ureshikatta yo", myanmar: "တကယ်တော့ အရမ်းအရမ်း ဝမ်းသာခဲ့တယ်" },
      { start: 83, end: 90, japanese: "あぁ花火が夜空きれいに咲いて ちょっとセツナク", romaji: "ā hanabi ga yozora kirei ni sai te chotto setsunaku", myanmar: "အင်း မီးပန်းပွင့်တွေ ညအကောင်းမှာ လှပစွာပွင့်ကာ နည်းနည်းဝမ်းနည်းမိတယ်" },
      { start: 90, end: 97, japanese: "あぁ 風が時間とともに 流れる", romaji: "ā kaze ga jikan totomoni nagareru", myanmar: "အင်း လေက အချိန်နဲ့အတူ စီးဆင်းသွားတယ်" },
      { start: 97, end: 104, japanese: "嬉しくって楽しくって 冒険もいろいろしたね", romaji: "ureshikutte tanoshikutte bōken mo iroiro shi ta ne", myanmar: "ဝမ်းသာပြီး ပျော်ရွင်ကာ စွန့်စားမှုများစွာ လုပ်ခဲ့တယ်နော်" },
      { start: 104, end: 112, japanese: "二人の 秘密の基地の中", romaji: "ni nin no himitsu no kichi no naka", myanmar: "နှစ်ယောက်တည်း လျှို့ဝှက်ဌာနချိုထဲမှာ" },
      { start: 112, end: 125, japanese: "君と夏の終わり 将来の夢 大きな希望忘れない", romaji: "kimi to natsu no owari shōrai no yume ōkina kibō wasure nai", myanmar: "မင်းနဲ့ နွေရာသီကုန်ချိန် အနာဂတ်အိပ်မက် မြော်လင့်ချက်ကြီး မမေ့နိုင်ဘူး" },
      { start: 125, end: 133, japanese: "君が最後まで 心から「ありがとう」", romaji: "kimi ga saigo made kokoro kara ' arigatō '", myanmar: "မင်း နောက်ဆုံးထိ နှလုံးသားဆိုင်ရာ 'ကျေးဇူးတင်တယ်'" },
      { start: 133, end: 140, japanese: "叫んでいたこと 知っていたよ", romaji: "saken de i ta koto shitte i ta yo", myanmar: "အော်ဟစ်နေသည်ကို သိနေခဲ့တယ်" },
      { start: 140, end: 147, japanese: "涙をこらえて 笑顔でさよなら せつないよね", romaji: "namida o korae te egao de sayonara setsunai yo ne", myanmar: "မျက်ရည်တန့်ကာ အပြုံးနဲ့ နှုတ်ဆက်တယ် ဝမ်းနည်းစရာ" },
      { start: 155, end: 163, japanese: "あぁ夏休みもあと少しで 終わっちゃうから", romaji: "ā natsuyasumi mo ato sukoshi de owatchau kara", myanmar: "အင်း နွေရာသီပိတ်ရက်လည်း နည်းနည်းနဲ့ ကုန်တော့မယ်မို့" },
      { start: 170, end: 178, japanese: "悲しくって寂しくって 喧嘩もいろいろしたね", romaji: "kanashikutte sabishikutte kenka mo iroiro shi ta ne", myanmar: "ဝမ်းနည်းပြီး တမ်းတကာ ရန်ဖြစ်မှုများစွာလည်း ရှိခဲ့တယ်နော်" },
      { start: 178, end: 186, japanese: "二人の 秘密の基地の中", romaji: "ni nin no himitsu no kichi no naka", myanmar: "နှစ်ယောက်တည်း လျှို့ဝှက်ဌာနချိုထဲမှာ" },
      { start: 197, end: 213, japanese: "涙をこらえて 笑顔でさよなら せつないよね", romaji: "namida o korae te egao de sayonara setsunai yo ne", myanmar: "မျက်ရည်တန့်ကာ အပြုံးနဲ့ နှုတ်ဆက်တယ် ဝမ်းနည်းစရာ" },
      { start: 219, end: 232, japanese: "手紙書くよ電話もするよ 忘れないでね僕のことを", romaji: "tegami kaku yo denwa mo suru yo wasure nai de ne boku no koto o", myanmar: "စာရေးမယ် ဖုန်းလည်း ဆက်မယ် ကျွန်တော့်ကို မမေ့နဲ့နော်" },
      { start: 232, end: 240, japanese: "いつまでも 二人の 基地の中", romaji: "itsu made mo ni nin no kichi no naka", myanmar: "အမြဲတမ်း နှစ်ယောက်တည်း ဌာနချိုထဲမှာ" },
      { start: 240, end: 252, japanese: "君と夏の終わり ずっと話して 夕日を見てから星を眺め", romaji: "kimi to natsu no owari zutto hanashi te yūhi o mi te kara hoshi o nagame", myanmar: "မင်းနဲ့ နွေကုန်ချိန် အမြဲစကားပြောကာ နေဝင်ကြည့်ပြီး ကြယ်တွေ ငေးကြည့်တယ်" },
      { start: 252, end: 262, japanese: "君の頬を 流れた涙は ずっと忘れない", romaji: "kimi no hō o nagare ta namida wa zutto wasure nai", myanmar: "မင်းပါးပေါ် စီးဆင်းသောမျက်ရည် အမြဲမမေ့နိုင်ဘူး" },
      { start: 247, end: 256, japanese: "君が最後まで 大きく手を振ってくれたこと きっと忘れない", romaji: "kimi ga saigo made ōkiku te o futte kure ta koto kitto wasure nai", myanmar: "မင်း နောက်ဆုံးထိ လက်ကြီးကြီး လှုပ်ပေးခဲ့တာ ဧကန်မမေ့နိုင်ဘူး" },
      { start: 262, end: 275, japanese: "だからこうして 夢の中でずっと永遠に…", romaji: "dakara kōshite yume no naka de zutto eien ni …", myanmar: "ဒါကြောင့် ဒီလို အိပ်မက်ထဲမှာ အမြဲထာဝရ..." },
      { start: 281, end: 295, japanese: "10年後の8月 また出会えるの信じて", romaji: "10 nen go no 8 tsuki mata deaeru no shinji te", myanmar: "၁၀ နှစ်နောက် သြဂုတ်လမှာ တစ်ဖန်တွေ့မယ်လို့ ယုံကြည်တယ်" },
      { start: 295, end: 999, japanese: "涙をこらえて 笑顔でさよなら せつないよね 最高の思い出を…", romaji: "namida o korae te egao de sayonara setsunai yo ne saikō no omoide o …", myanmar: "မျက်ရည်တန့်ကာ အပြုံးနဲ့ နှုတ်ဆက်တယ် ဝမ်းနည်းစရာ... အကောင်းဆုံးသောမှတ်ဉာဏ်..." },
    ],
  },
];
