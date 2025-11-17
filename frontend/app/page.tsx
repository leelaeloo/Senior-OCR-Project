"use client";

// 메인 페이지
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";

export default function Home() {
  const router = useRouter();

  return (
    <PageLayout showDefaultButtons={true}>
      <div className="hidden md:block mb-6 animate-fade-in">
        <div className="rounded-2xl p-4 md:p-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 animate-slide-down">
            📖 간단한 사용법
          </h1>

          <div className="grid md:grid-cols-3 gap-3 md:gap-4">
            <div
              className="bg-white border border-gray-200 rounded-2xl p-4 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: "100ms" }}
            >
              <div className="rounded-full w-10 h-10 mx-auto mb-3 flex items-center justify-center text-white text-lg font-black bg-black shadow-md transition-transform duration-300 hover:scale-110">
                1
              </div>
              <div className="mb-2">
                <span className="text-4xl inline-block animate-float">📸</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                사진 찍기
              </h3>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                읽고 싶은 글자가 있는 문서를 사진으로 찍어요
              </p>
            </div>

            <div
              className="bg-white border border-gray-200 rounded-2xl p-4 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <div className="rounded-full w-10 h-10 mx-auto mb-3 flex items-center justify-center text-white text-lg font-black bg-black shadow-md transition-transform duration-300 hover:scale-110">
                2
              </div>
              <div className="mb-2">
                <span className="text-4xl inline-block animate-float-delay-1">
                  👀
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                글자 확인
              </h3>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                사진 속 글자를 크게 보여드려요
              </p>
            </div>

            <div
              className="bg-white border border-gray-200 rounded-2xl p-4 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: "300ms" }}
            >
              <div className="rounded-full w-10 h-10 mx-auto mb-3 flex items-center justify-center text-white text-lg font-black bg-black shadow-md transition-transform duration-300 hover:scale-110">
                3
              </div>
              <div className="mb-2">
                <span className="text-4xl inline-block animate-float-delay-2">
                  🔊
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                소리로 듣기
              </h3>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                버튼만 누르면 소리로 읽어드려요
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div
          className="lg:col-span-1 animate-slide-up"
          style={{ animationDelay: "100ms" }}
        >
          <div className="card bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="mb-4 md:mb-5 text-center">
              <div className="mb-2 md:mb-3">
                <span className="text-5xl md:text-6xl inline-block animate-wiggle">
                  📸
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                사진 찍기
              </h3>
              <p className="text-sm md:text-base lg:text-lg text-gray-600">
                보고싶은 글자를 사진으로 찍어보세요
              </p>
            </div>

            <button
              onClick={() => router.push("/result")}
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-5 md:py-6 px-5 md:px-7 rounded-2xl transition-all duration-300 mb-3 md:mb-5 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-lg md:text-xl">사진 찍기</span>
            </button>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 md:p-4 transition-all duration-300 hover:bg-gray-100">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg md:text-xl">💡</span>
                <h4 className="text-sm md:text-base lg:text-lg font-bold text-gray-900">
                  잘 찍는 방법
                </h4>
              </div>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                밝은 곳에서 · 바르게 · 가까이 · 천천히
              </p>
            </div>
          </div>
        </div>

        <div
          className="lg:col-span-1 animate-slide-up"
          style={{ animationDelay: "200ms" }}
        >
          <div className="card bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="mb-4 md:mb-5 text-center">
              <div className="mb-2 md:mb-3">
                <span className="text-5xl md:text-6xl inline-block animate-wiggle">
                  👆🏻
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                부분 읽기
              </h3>
              <p className="text-sm md:text-base lg:text-lg text-gray-600">
                필요한 부분만 콕! 집어서 읽어드려요
              </p>
            </div>

            <button
              onClick={() => router.push("/region-ocr")}
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-5 md:py-6 px-5 md:px-7 rounded-2xl transition-all duration-300 mb-3 md:mb-5 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-lg md:text-xl">시작하기</span>
            </button>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 md:p-4 transition-all duration-300 hover:bg-gray-100">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg md:text-xl">💡</span>
                <h4 className="text-sm md:text-base lg:text-lg font-bold text-gray-900">
                  사용하는 방법
                </h4>
              </div>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                사진 올리기 · 손가락으로 표시 · 원하는 부분만 선택
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
