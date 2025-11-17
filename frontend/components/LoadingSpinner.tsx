// 로딩 스피너
interface LoadingSpinnerProps {
  message?: string;
  submessage?: string;
}

export default function LoadingSpinner({
  message = "글씨를 찾고 있어요",
  submessage = "잠시만 기다려주세요...",
}: LoadingSpinnerProps) {
  return (
    <div className="text-center py-8 md:py-12 animate-fade-in">
      <div className="relative inline-block mb-5 md:mb-6">
        <div className="animate-spin rounded-full h-14 w-14 md:h-16 md:w-16 border-4 border-gray-300"></div>
        <div
          className="absolute top-0 left-0 rounded-full h-14 w-14 md:h-16 md:w-16 border-4 border-transparent border-t-gray-600 border-r-gray-600"
          style={{ animation: "spin 1s linear infinite reverse" }}
        ></div>

        <div
          className="absolute top-0 left-0 rounded-full h-14 w-14 md:h-16 md:w-16 border-4 border-transparent border-t-black"
          style={{ animation: "spin 0.6s linear infinite" }}
        ></div>
      </div>

      <p className="text-base md:text-xl text-gray-900 font-bold mb-1.5 md:mb-2 animate-pulse-soft">
        {message}
      </p>
      <p className="text-sm md:text-base text-gray-600 animate-fade-in">
        {submessage}
      </p>

      <div className="flex justify-center gap-1.5 md:gap-2 mt-3 md:mt-4">
        <div
          className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-700 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
}
