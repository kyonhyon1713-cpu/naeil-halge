"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { questions } from "@/lib/content";
import { emptyAnswers, getDependency, getPatterns, getResultType, isComplete, type Answers } from "@/lib/scoring";

type Stage = "home" | "quiz" | "result" | "stats" | "story" | "seminar";
type SavedState = { stage: Stage; questionIndex: number; answers: Answers };
const STORAGE_KEY = "naeil-halge-zip-progress";
const stages: Stage[] = ["home", "quiz", "result", "stats", "story", "seminar"];
const subscribe = () => () => {};

function readSavedState(): SavedState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved: unknown = JSON.parse(raw);
    if (!saved || typeof saved !== "object") return null;
    const state = saved as Partial<SavedState>;
    if (!state.stage || !stages.includes(state.stage)) return null;
    if (!Array.isArray(state.answers) || state.answers.length !== 6 || !state.answers.every((answer) => answer === null || answer === 0 || answer === 1 || answer === 2)) return null;
    if (typeof state.questionIndex !== "number" || !Number.isInteger(state.questionIndex) || state.questionIndex < 0 || state.questionIndex > 5) return null;
    if (["result", "stats", "story", "seminar"].includes(state.stage) && !isComplete(state.answers)) return null;
    return state as SavedState;
  } catch {
    return null;
  }
}

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className="arrow-icon">{diagonal ? "↗" : "→"}</span>;
}

function PrimaryButton({ children, onClick, light = false }: { children: React.ReactNode; onClick: () => void; light?: boolean }) {
  return <button className={`primary-button${light ? " primary-button--light" : ""}`} onClick={onClick} type="button"><span>{children}</span><ArrowIcon /></button>;
}

function Brand() {
  return <div className="brand" aria-label="내일 할게.zip"><span className="brand-mark">n.</span><span>내일 할게<span className="brand-dot">.zip</span></span></div>;
}

export default function Experience() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const [stage, setStage] = useState<Stage>(() => typeof window === "undefined" ? "home" : readSavedState()?.stage ?? "home");
  const [questionIndex, setQuestionIndex] = useState(() => typeof window === "undefined" ? 0 : readSavedState()?.questionIndex ?? 0);
  const [answers, setAnswers] = useState<Answers>(() => typeof window === "undefined" ? emptyAnswers() : readSavedState()?.answers ?? emptyAnswers());
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!mounted) return;
    if (stage === "home" && questionIndex === 0 && answers.every((answer) => answer === null)) {
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ stage, questionIndex, answers }));
    }
  }, [mounted, stage, questionIndex, answers]);

  useEffect(() => () => { if (advanceTimer.current) clearTimeout(advanceTimer.current); }, []);

  const goTo = (next: Stage) => {
    setStage(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const start = () => {
    setQuestionIndex(0);
    goTo("quiz");
  };

  const choose = (score: 0 | 1 | 2) => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setAnswers((current) => current.map((answer, index) => index === questionIndex ? score : answer));
    advanceTimer.current = setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        setQuestionIndex(questionIndex + 1);
        window.scrollTo({ top: 0, behavior: "instant" });
      } else {
        goTo("result");
      }
    }, 260);
  };

  const previous = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (questionIndex === 0) goTo("home");
    else setQuestionIndex(questionIndex - 1);
  };

  const restart = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    sessionStorage.removeItem(STORAGE_KEY);
    setAnswers(emptyAnswers());
    setQuestionIndex(0);
    goTo("home");
  };

  const result = getResultType(answers);
  const percent = getDependency(answers);

  if (!mounted) return <div className="site-shell" />;

  return (
    <div className={`site-shell site-shell--${stage}`}>
      <header className="site-header"><Brand /><span className="header-side">AN INTERACTIVE STORY <span className="header-spark">✳</span></span></header>
      <main aria-live="polite">
        {stage === "home" && <section className="home-screen screen-enter">
          <div className="home-copy">
            <div className="eyebrow"><span className="eyebrow-line" />A SMALL TEST ABOUT US</div>
            <h1>해야지.<br />진짜 해야지.</h1>
            <p className="home-question">그런데 왜 항상<br /><strong>시작은 조금 뒤일까요?</strong></p>
            <p className="home-description">책, 영화, 유튜브, 숏폼, 그리고 AI.<br />우리가 콘텐츠를 소비하는 방식은 빠르게 달라지고 있습니다.</p>
            <p className="home-invitation">6개의 질문으로 지금의 내 습관을 확인해보세요.</p>
            <div className="home-action"><div className="test-meta"><span>6 QUESTIONS</span><span className="meta-divider" /><span>약 1분</span></div><PrimaryButton onClick={start}>시작하기</PrimaryButton><p className="fine-print">정답은 없습니다.<br />지금의 나와 가장 가까운 답을 골라주세요.</p></div>
          </div>
          <div className="home-art" aria-hidden="true"><div className="art-orbit art-orbit--one" /><div className="art-orbit art-orbit--two" /><div className="art-disc"><span>나중에<br />할게</span><span className="art-disc-dot">✳</span></div><div className="art-sticker art-sticker--top">TO DO<br />↘</div><div className="art-sticker art-sticker--bottom">maybe<br />tomorrow.</div><span className="art-small-star">✳</span></div>
          <div className="home-bottom"><span>SCROLL LESS, THINK MORE?</span><span>01 / 06</span></div>
        </section>}

        {stage === "quiz" && <section key={questionIndex} className="quiz-screen screen-enter">
          <div className="quiz-top"><button className="text-back" onClick={previous} type="button"><span aria-hidden="true">←</span> 이전</button><span className="quiz-counter"><strong>{questionIndex + 1}</strong> / 6</span></div>
          <div className="progress-track" role="progressbar" aria-label="테스트 진행률" aria-valuenow={questionIndex + 1} aria-valuemin={0} aria-valuemax={6}><span style={{ width: `${((questionIndex + 1) / 6) * 100}%` }} /></div>
          <div className="quiz-body"><div className="question-tag">QUESTION {String(questionIndex + 1).padStart(2, "0")} <span>—</span> {questions[questionIndex].eyebrow}</div><h1>{questions[questionIndex].lines.map((line, index) => <span key={index}>{line}<br /></span>)}</h1>{questions[questionIndex].followup && <p className="question-followup">{questions[questionIndex].followup}</p>}{questions[questionIndex].note && <p className="question-note">{questions[questionIndex].note.map((line, index) => <span key={index}>{line}<br /></span>)}</p>}
            <div className="choice-list" role="group" aria-label="답변 선택">{questions[questionIndex].choices.map((choice) => <button className={`choice-card${answers[questionIndex] === choice.score ? " choice-card--selected" : ""}`} key={choice.label} onClick={() => choose(choice.score)} type="button" aria-pressed={answers[questionIndex] === choice.score}><span className="choice-letter">{choice.label}</span><span className="choice-text">{choice.text}</span><span className="choice-arrow" aria-hidden="true">↗</span></button>)}</div>
          </div>
          <div className="quiz-footer"><span>JUST PICK WHAT FEELS LIKE YOU.</span><span>내일 할게.zip</span></div>
        </section>}

        {stage === "result" && <section className="result-screen screen-enter narrow-screen">
          <div className="section-kicker"><span className="kicker-dot" /> YOUR RESULT</div>
          <h1 className="result-heading">내일의 나<br />의존도</h1>
          <div className="result-number"><span>{percent}</span><span className="result-percent">%</span></div>
          <div className="result-type"><div className="result-type-label">MY TYPE <span>↘</span></div><div className="result-type-title"><span className="result-icon">{result.icon}</span><h2>{result.name}</h2></div><p>{result.description.map((line, index) => <span key={index}>{line}<br /></span>)}</p><blockquote>{result.quote}</blockquote></div>
          <div className="patterns"><div className="patterns-head"><span>당신의 응답 패턴</span><span>RESPONSE PATTERN</span></div>{getPatterns(answers).map((pattern, index) => <div className="pattern" key={pattern.label}><div className="pattern-label"><span><em>0{index + 1}</em>{pattern.label}</span><strong>{pattern.value}%</strong></div><div className="pattern-track"><span style={{ width: `${pattern.value}%` }} /></div></div>)}</div>
          <p className="result-disclaimer">※ 이 결과는 의료·심리 진단이 아닌 응답 기반 콘텐츠용 지표입니다.</p>
          <PrimaryButton onClick={() => goTo("stats")}>나만 이런 걸까?</PrimaryButton>
        </section>}

        {stage === "stats" && <section className="stats-screen screen-enter narrow-screen">
          <div className="section-kicker"><span className="kicker-dot" /> THE RESEARCH</div>
          <p className="stats-pretitle">그런데,</p><h1>이런 습관이<br />나만의 이야기일까요?</h1>
          <div className="research-card"><div className="research-card-top"><span>국내 대학생 본조사</span><span>01 / RESEARCH</span></div><div className="research-number">220<span>명</span></div><div className="research-card-bottom">숏폼 중독 성향 <span>↔</span> 자기통제</div></div>
          <p className="research-summary">두 특성 사이에<br /><strong>통계적으로 의미 있는 관련성</strong>이 확인됐습니다.</p>
          <div className="traits"><div className="traits-heading">숏폼 이용 문제의<br />3가지 특성 <span>↘</span></div><div className="trait"><span className="trait-number">01</span><div><h2>금단</h2><p>보지 못할 때 불편함이나<br />계속 확인하고 싶은 느낌</p></div></div><div className="trait"><span className="trait-number">02</span><div><h2>기분조절 추구</h2><p>심심하거나 기분이 좋지 않을 때<br />숏폼을 통해 기분을 전환하려는 경향</p></div></div><div className="trait"><span className="trait-number">03</span><div><h2>일상생활장애</h2><p>숏폼 이용이 공부·생활 등<br />해야 할 일에 영향을 주는 상태</p></div></div></div>
          <div className="stats-recap">숏폼 이용 문제는<br /><strong>금단 · 기분조절 추구 · 일상생활장애</strong><br />3가지 특성으로 나타났습니다.</div>
          <h2 className="stats-question"><span>“5분만 볼게”가 길어지는 경험,</span><strong>정말 의지만의 문제일까요?</strong></h2>
          <p className="source">국내 대학생 대상 숏폼 중독 척도 연구<br />예비조사 <strong>218명</strong> · 본조사 <strong>220명</strong></p>
          <PrimaryButton onClick={() => goTo("story")}>다음 이야기 보기</PrimaryButton>
        </section>}

        {stage === "story" && <section className="story-screen screen-enter">
          <div className="story-inner"><div className="section-kicker"><span className="kicker-dot" /> A DIFFERENT QUESTION</div><div className="story-question"><p>그렇다면 정말<br /><strong>우리의 집중력이 나빠진 걸까요?</strong></p><span className="story-or">아니면</span><h1>우리가 정보를 받아들이는 방식이<br /><em>달라진 걸까요?</em></h1></div>
            <div className="media-flow" aria-label="책에서 영화, 유튜브, 숏폼, AI로 변화하는 흐름"><div>책</div><span>↓</span><div>영화</div><span>↓</span><div>유튜브</div><span>↓</span><div>숏폼</div><span>↓</span><div>AI</div></div>
            <div className="story-paragraphs"><p>책 한 권을 읽지 않아도<br />내용을 알 수 있고,</p><p>영화 한 편을 보지 않아도<br />결말을 알 수 있고,</p><p>긴 영상을 보지 않아도<br />핵심만 몇 초 안에 볼 수 있고,</p><p>궁금한 것은 AI에게 물으면<br />바로 답을 얻을 수 있는 시대.</p></div>
            <div className="story-conclusion"><p>우리는 정보를 덜 보는 게 아니라</p><h2>다르게 보고 있는 건 아닐까요?</h2></div><PrimaryButton light onClick={() => goTo("seminar")}>그 이야기, 이어서 보기</PrimaryButton>
          </div>
        </section>}

        {stage === "seminar" && <section className="seminar-screen screen-enter"><div className="seminar-inner"><div className="section-kicker"><span className="kicker-dot" /> 에듀리본 2026 하반기 프로젝트</div><div className="seminar-hero"><span className="seminar-hero-label">THE SPOILER YOU MIGHT NEED</span><h1>「어쩌면 필요할<br />스포일러」</h1><div className="seminar-hero-orbit" aria-hidden="true">✳</div><h2>우리가 정보를 받아들이는 방식은<br />어떻게 달라지고 있을까요?</h2></div>
            <div className="seminar-parts"><article className="seminar-part"><div className="part-meta"><span>PART 01</span><span>BOOK ↗</span></div><div><h2>책을 안 읽게 된 걸까,<br />읽는 방식이 달라진 걸까?</h2></div><div className="part-symbol" aria-hidden="true">✳</div></article><article className="seminar-part"><div className="part-meta"><span>PART 02</span><span>MOVIE ↗</span></div><div><h2>2시간의 이야기보다<br />몇 분짜리 요약이 익숙해진 시대</h2></div><div className="part-symbol" aria-hidden="true">◌</div></article><article className="seminar-part"><div className="part-meta"><span>AND</span><span>AI ↗</span></div><div><h2>검색하고 읽고 비교하던 과정까지<br />AI가 대신하는 시대</h2></div><div className="part-symbol" aria-hidden="true">↗</div></article></div>
            <div className="event-card"><span className="event-kicker">SAVE THE DATE <span>✳</span></span><h2>「어쩌면 필요할 스포일러」</h2><div className="event-date">2026.10.08 <span>THU</span></div><div className="event-details"><span>19:30 – 20:30</span><span>📍 장소 추후 공지</span></div><div className="event-project">에듀리본 2026 하반기 프로젝트</div></div><div className="seminar-end"><p>당신에게도,</p><h2>어쩌면 필요한 스포일러.</h2><button onClick={restart} type="button">↻ 처음부터 다시 보기</button></div></div></section>}
      </main>
    </div>
  );
}
