"use client";

// 챗봇 데모
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, Camera, History, HelpCircle } from "lucide-react";

export default function FloatingRemote() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (!isHovered) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
      }
    }, 4000);

    return () => clearInterval(blinkInterval);
  }, [isHovered]);

  const buttons = [
    {
      icon: Home,
      label: "홈",
      onClick: () => router.push("/"),
      color: "bg-blue-400 hover:bg-blue-500",
    },
    {
      icon: Camera,
      label: "사진찍기",
      onClick: () => router.push("/result"),
      color: "bg-green-400 hover:bg-green-500",
    },
    {
      icon: History,
      label: "기록보기",
      onClick: () => router.push("/history"),
      color: "bg-purple-400 hover:bg-purple-500",
    },
    {
      icon: HelpCircle,
      label: "도움말",
      onClick: () => router.push("/guide"),
      color: "bg-orange-400 hover:bg-orange-500",
    },
  ];

  return (
    <div className="fixed right-6 top-20 z-50 hidden md:block">
      <div className="relative">
        <div className="absolute inset-0 bg-yellow-200 rounded-full blur-xl opacity-40 animate-pulse"></div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-20 h-20 bg-gradient-to-br from-yellow-200 via-amber-100 to-yellow-100 hover:from-yellow-300 hover:via-amber-200 hover:to-yellow-200 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex flex-col items-center justify-center border-4 border-white"
          title={isExpanded ? "닫기" : "메뉴 열기"}
        >
          <div className="flex gap-2">
            <div
              className={`w-2 h-2 bg-gray-700 rounded-full transition-all duration-200 ${
                isBlinking ? "scale-y-[0.2]" : ""
              } ${isHovered ? "scale-150" : ""}`}
            ></div>
            <div
              className={`w-2 h-2 bg-gray-700 rounded-full transition-all duration-200 ${
                isBlinking ? "scale-y-[0.2]" : ""
              } ${isHovered ? "scale-150" : ""}`}
            ></div>
          </div>

          <div className="flex gap-6 absolute top-9">
            <div
              className={`w-2 h-2 bg-orange-300 rounded-full transition-all duration-300 ${
                isHovered ? "opacity-100 scale-125" : "opacity-60"
              }`}
            ></div>
            <div
              className={`w-2 h-2 bg-orange-300 rounded-full transition-all duration-300 ${
                isHovered ? "opacity-100 scale-125" : "opacity-60"
              }`}
            ></div>
          </div>
        </button>

        <div
          className={`absolute right-24 top-1/2 -translate-y-1/2 transition-all duration-300 ${
            !isExpanded
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-4 pointer-events-none"
          }`}
        >
          <div className="relative bg-white rounded-2xl shadow-xl px-4 py-2.5 border-2 border-yellow-300">
            <p className="text-gray-800 text-sm font-medium whitespace-nowrap">
              무엇을 도와드릴까요?
            </p>

            <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-l-[12px] border-l-yellow-300 border-b-[10px] border-b-transparent"></div>
            <div className="absolute left-full top-1/2 -translate-y-1/2 -translate-x-[2px] w-0 h-0 border-t-[8px] border-t-transparent border-l-[10px] border-l-white border-b-[8px] border-b-transparent"></div>
          </div>
        </div>

        <div
          className={`absolute left-1/2 -translate-x-1/2 top-24 flex flex-col gap-2 transition-all duration-300 ${
            isExpanded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          {buttons.map((button, index) => {
            const Icon = button.icon;
            return (
              <div key={index} className="relative group">
                <button
                  onClick={button.onClick}
                  className={`w-14 h-14 ${button.color} rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:rotate-6 active:scale-95 flex items-center justify-center border-2 border-white`}
                  style={{
                    transitionDelay: isExpanded ? `${index * 50}ms` : "0ms",
                  }}
                  title={button.label}
                >
                  <Icon className="w-6 h-6 text-white" />
                </button>

                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  <div className="bg-gray-800 text-white text-base px-4 py-2 rounded-xl shadow-lg font-medium">
                    {button.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
