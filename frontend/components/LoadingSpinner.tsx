/**
 * 로딩 스피너 컴포넌트
 */

interface LoadingSpinnerProps {
  message?: string;
  submessage?: string;
}

export default function LoadingSpinner({
  message = "글씨를 찾고 있어요",
  submessage = "잠시만 기다려주세요...",
}: LoadingSpinnerProps) {
  return (
    <div className="text-center py-12 animate-fade-in">
      {/* 향상된 스피너 */}
      <div className="relative inline-block mb-6">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-400"></div>
        <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-t-4 border-gray-600"></div>
        <div className="absolute top-0 left-0 rounded-full h-16 w-16 shadow-glow"></div>
      </div>

      {/* 메시지 */}
      <p className="text-xl text-gray-900 font-bold mb-2 animate-pulse-soft">
        {message}
      </p>
      <p className="text-base text-gray-600 animate-fade-in">{submessage}</p>

      {/* 점 애니메이션 */}
      <div className="flex justify-center gap-2 mt-4">
        <div
          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
}
