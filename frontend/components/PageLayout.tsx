"use client";

/**
 * 모든 페이지에서 사용하는 공통 레이아웃
 * 헤더 위치와 레이아웃 일관성을 보장합니다
 */

import { useRouter } from "next/navigation";
import Header from "./Header";

interface PageLayoutProps {
  children: React.ReactNode;
  showDefaultButtons?: boolean;
  customButtons?: Array<{
    label: string;
    onClick: () => void;
  }>;
  maxWidth?: "4xl" | "7xl"; // 컨텐츠 최대 너비
  transparentBg?: boolean; // 배경을 투명하게 만들 옵션
}

export default function PageLayout({
  children,
  showDefaultButtons = false,
  customButtons,
  maxWidth = "7xl",
  transparentBg = false,
}: PageLayoutProps) {
  const router = useRouter();

  // 기본 버튼 설정
  const buttons = customButtons || [];

  return (
    <div className={`min-h-screen ${transparentBg ? "bg-transparent" : "bg-white"}`}>
      {/* 고정된 헤더 */}
      <Header
        showDefaultButtons={showDefaultButtons}
        buttons={buttons.length > 0 ? buttons : undefined}
      />

      {/* 메인 컨텐츠 영역 - 일관된 패딩과 최대 너비 */}
      <main
        className={`mx-auto px-4 py-8 ${
          maxWidth === "4xl" ? "max-w-4xl" : "max-w-7xl"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
