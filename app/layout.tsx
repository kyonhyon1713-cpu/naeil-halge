import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "내일 할게.zip | 어쩌면 필요할 스포일러";
const description = "6개의 질문으로 알아보는 나의 미루기와 콘텐츠 소비 습관. 책, 영화, 숏폼, AI 시대의 변화를 다루는 인터랙티브 테스트.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", locale: "ko_KR" },
  twitter: { card: "summary", title, description },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
