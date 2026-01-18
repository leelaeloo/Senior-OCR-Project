"use client";

// 모바일 PWA 하단 네비게이션 (챗봇 중앙 배치)
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Camera, History, HelpCircle } from "lucide-react";

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [showBubble, setShowBubble] = useState(true);
  const [isBlinking, setIsBlinking] = useState(false);

  // 눈 깜빡임 효과
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);

    return () => clearInterval(blinkInterval);
  }, []);

  // 말풍선 자동 숨김 (10초 후)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    {
      icon: Home,
      label: "홈",
      path: "/",
    },
    {
      icon: Camera,
      label: "사진",
      path: "/result",
    },
    null, // 챗봇 자리 (가운데)
    {
      icon: History,
      label: "기록",
      path: "/history",
    },
    {
      icon: HelpCircle,
      label: "도움말",
      path: "/guide",
    },
  ];

  const handleChatbotClick = () => {
    setShowBubble(!showBubble);
  };

  return (
    <nav className="fixed bottom-2 left-2 right-2 z-50 md:hidden rounded-2xl">
      {/* 배경 */}
      <div className="absolute inset-0 bg-white/95 backdrop-blur-lg border border-gray-200 shadow-xl rounded-2xl"></div>

      {/* 네비게이션 아이템 */}
      <div className="relative flex justify-around items-center h-16 px-1 safe-area-bottom">
        {navItems.map((item, index) => {
          // 가운데 챗봇
          if (item === null) {
            return (
              <div key="chatbot" className="relative flex flex-col items-center -mt-8">
                {/* 말풍선 */}
                <div
                  className={`absolute -top-14 left-1/2 -translate-x-1/2 transition-all duration-300 ${
                    showBubble
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="relative bg-white rounded-2xl shadow-lg px-3 py-2 border-2 border-amber-300 whitespace-nowrap">
                    <p className="text-gray-800 text-xs font-medium">
                      무엇을 도와드릴까요?
                    </p>
                    {/* 말풍선 꼬리 */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-amber-300"></div>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-[2px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white"></div>
                  </div>
                </div>

                {/* 챗봇 버튼 */}
                <button
                  onClick={handleChatbotClick}
                  className="relative w-16 h-16 bg-gradient-to-br from-amber-200 via-yellow-300 to-amber-200 rounded-full shadow-xl flex flex-col items-center justify-center border-4 border-white transition-all duration-300 active:scale-95"
                >
                  {/* 글로우 효과 */}
                  <div className="absolute inset-0 bg-amber-200 rounded-full blur-lg opacity-50 animate-pulse -z-10"></div>

                  {/* 눈 */}
                  <div className="flex gap-2">
                    <div
                      className={`w-2 h-2 bg-white rounded-full transition-all duration-200 ${
                        isBlinking ? "scale-y-[0.2]" : ""
                      }`}
                    ></div>
                    <div
                      className={`w-2 h-2 bg-white rounded-full transition-all duration-200 ${
                        isBlinking ? "scale-y-[0.2]" : ""
                      }`}
                    ></div>
                  </div>

                  {/* 볼터치 */}
                  <div className="flex gap-6 absolute top-8">
                    <div className="w-1.5 h-1.5 bg-pink-300 rounded-full opacity-60"></div>
                    <div className="w-1.5 h-1.5 bg-pink-300 rounded-full opacity-60"></div>
                  </div>
                </button>
              </div>
            );
          }

          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-yellow-400/20"
                  : "active:bg-gray-100 active:scale-95"
              }`}
            >
              <Icon
                className={`w-6 h-6 mb-0.5 transition-colors ${
                  isActive ? "text-yellow-500" : "text-gray-500"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-yellow-600" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
