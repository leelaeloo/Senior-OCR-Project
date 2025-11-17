"use client";

// 헤더
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
    <header
      className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm"
      style={{ width: "100vw", position: "sticky", left: 0, right: 0 }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "80px",
          }}
        >
          <div style={{ width: "clamp(160px, 40vw, 280px)", flexShrink: 0 }}>
            <div className="cursor-pointer" onClick={() => router.push("/")}>
              <Logo />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexShrink: 0,
            }}
          >
            {displayButtons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className="hover:bg-gray-200 text-gray-900 font-bold px-3 py-2 md:px-6 md:py-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap text-sm md:text-base"
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
