import { resultTypes } from "./content";

export type Answers = (0 | 1 | 2 | null)[];

export const emptyAnswers = (): Answers => Array(6).fill(null);

export function isComplete(answers: Answers): boolean {
  return answers.length === 6 && answers.every((answer) => answer !== null);
}

export function getScore(answers: Answers): number {
  return answers.reduce<number>((total, answer) => total + (answer ?? 0), 0);
}

export function getDependency(answers: Answers): number {
  return Math.round((getScore(answers) / 12) * 100);
}

export function getResultType(answers: Answers) {
  const percent = getDependency(answers);
  return resultTypes.find((type) => percent >= type.min && percent <= type.max) ?? resultTypes[0];
}

export function getPatterns(answers: Answers) {
  const value = (index: number) => answers[index] ?? 0;
  return [
    { label: "실행 지연", value: ((value(0) + value(5)) / 4) * 100 },
    { label: "짧은 자극 선호", value: ((value(1) + value(4)) / 4) * 100 },
    { label: "긴 콘텐츠 선호도", value: 100 - ((value(2) + value(3)) / 4) * 100 },
  ];
}
