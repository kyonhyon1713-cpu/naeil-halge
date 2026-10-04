export type Choice = { label: "A" | "B" | "C"; text: string; score: 0 | 1 | 2 };
export type Question = { eyebrow: string; lines: string[]; followup?: string; note?: string[]; choices: Choice[] };

const choices = (a: string, b: string, c: string): Choice[] => [
  { label: "A", text: a, score: 0 },
  { label: "B", text: b, score: 1 },
  { label: "C", text: c, score: 2 },
];

export const questions: Question[] = [
  {
    eyebrow: "해야 할 일이 생겼다",
    lines: ["해야 할 일이 있는데", "딱히 마감은 정해져 있지 않다."],
    followup: "나는 보통?",
    choices: choices("생각났을 때 바로 시작한다.", "조금 있다가 시작한다.", "미루다가 급해지면 시작한다."),
  },
  {
    eyebrow: '"5분만" 보려고 숏폼을 켰다',
    lines: ["자기 전,", "“딱 5분만 보고 자야지” 하고", "쇼츠·릴스를 켰다."],
    followup: "보통 나는?",
    choices: choices("몇 개 보고 끈다.", "생각보다 꽤 오래 본다.", "시간이 얼마나 지났는지 모를 때가 있다."),
  },
  {
    eyebrow: "보고 싶은 영화가 2시간 30분이다",
    lines: ["보고 싶었던 영화가 있는데", "러닝타임이 2시간 30분이다."],
    followup: "나는?",
    choices: choices("재미있어 보이면 그냥 본다.", "조금 고민되지만 본다.", "요약이나 리뷰부터 찾아본다."),
  },
  {
    eyebrow: "최근 책 한 권을 끝까지 읽은 때는?",
    lines: ["최근 내가 직접 골라", "책 한 권을 처음부터 끝까지 읽은 게 언제인가요?"],
    note: ["전공서·시험책 제외,", "내가 선택해서 읽은 책 기준"],
    choices: choices("최근 1~3개월 이내", "최근 6개월 이내", "잘 기억나지 않는다."),
  },
  {
    eyebrow: "10분의 빈 시간이 생겼다",
    lines: ["약속까지 10분 남았다.", "특별히 할 것은 없다."],
    followup: "가장 먼저 하는 행동은?",
    choices: choices("그냥 쉬거나 주변을 본다.", "메시지나 SNS를 확인한다.", "쇼츠·릴스 같은 숏폼을 켠다."),
  },
  {
    eyebrow: "사실 지금도 미루고 있는 게 있다",
    lines: ["지금도", "“해야 하는데…” 하면서", "계속 미루고 있는 일이 있나요?"],
    choices: choices("딱히 없다.", "하나 정도 있다.", "여러 개 있다."),
  },
];

export type ResultType = { min: number; max: number; icon: string; name: string; description: string[]; quote: string };

export const resultTypes: ResultType[] = [
  { min: 0, max: 24, icon: "🚀", name: "생각하면 바로 하는 편", description: ["생각한 것을 비교적 빠르게 행동으로 옮기는 편이에요.", "해야 할 일과 쉬는 시간을 구분하는 데 비교적 익숙합니다."], quote: "“일단 시작하고 생각할게.”" },
  { min: 25, max: 49, icon: "⏳", name: "시작까지 조금 필요한 편", description: ["해야 할 일은 알고 있지만", "시작하기 전에 약간의 준비 시간이 필요한 편입니다."], quote: "“조금 있다가 하면 되지.”" },
  { min: 50, max: 74, icon: "📅", name: "내일의 나를 믿는 편", description: ["해야 한다는 생각은 자주 하지만", "지금 시작하기보다 미래의 나에게 넘기는 경우가 조금 많은 편이에요."], quote: "“내일부터 진짜 한다.”" },
  { min: 75, max: 100, icon: "📱", name: "5분만 보고 할게", description: ["당장 해야 할 일보다", "짧고 빠르게 즐길 수 있는 콘텐츠에 먼저 손이 가는 경우가 많은 편이에요."], quote: "“쇼츠 하나만 보고…”" },
];
