"use client";

/**
 * 공통 헤더 컴포넌트
 */

import { useRouter } from "next/navigation";
import Logo from "./Logo";

interface HeaderButton {
  label: string;
  onClick: () => void;
}

interface HeaderProps {
  buttons?: HeaderButton[];
  showDefaultButtons?: boolean;
}

export default function Header({
  buttons,
  showDefaultButtons = false,
}: HeaderProps) {
  const router = useRouter();

  // 기본 버튼 (메인 페이지용)
  const defaultButtons: HeaderButton[] = [
    {
      label: "도움말",
      onClick: () => router.push("/guide"),
    },
    {
      label: "지난기록",
      onClick: () => router.push("/history"),
    },
  ];

  const displayButtons = showDefaultButtons ? defaultButtons : buttons || [];

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200 h-20">
      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <div className="cursor-pointer" onClick={() => router.push("/")}>
              <Logo />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {displayButtons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-4 py-2 md:px-6 md:py-3 rounded-xl transition-all hover-scale-sm"
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
