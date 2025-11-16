"use client";

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
  transparentBg?: boolean; // 배경을 투명
}

export default function PageLayout({
  children,
  showDefaultButtons = false,
  customButtons,
  maxWidth = "7xl",
  transparentBg = false,
}: PageLayoutProps) {
  const router = useRouter();

  const buttons = customButtons || [];

  return (
    <div
      className={`min-h-screen ${
        transparentBg ? "bg-transparent" : "bg-white"
      }`}
    >
      <Header
        showDefaultButtons={showDefaultButtons}
        buttons={buttons.length > 0 ? buttons : undefined}
      />

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
