"use client";

import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";

export default function Home() {
  const router = useRouter();

  return (
    <PageLayout showDefaultButtons={true}>
      <div className="mb-10">
        <div className="rounded-2xl p-6 md:p-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            📖 간단한 사용법
          </h1>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center text-white text-xl font-black bg-black shadow-md">
                1
              </div>
              <div className="mb-3">
                <span className="text-5xl inline-block animate-float">📸</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                사진 찍기
              </h3>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                읽고 싶은 글자가 있는 문서를 사진으로 찍어요
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center text-white text-xl font-black bg-black shadow-md">
                2
              </div>
              <div className="mb-3">
                <span className="text-5xl inline-block animate-float-delay-1">
                  👀
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                글자 확인
              </h3>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                사진 속 글자를 크게 보여드려요
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center text-white text-xl font-black bg-black shadow-md">
                3
              </div>
              <div className="mb-3">
                <span className="text-5xl inline-block animate-float-delay-2">
                  🔊
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                소리로 듣기
              </h3>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                버튼만 누르면 소리로 읽어드려요
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        <div className="lg:col-span-1">
          <div className="card bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="mb-6 text-center">
              <div className="mb-4">
                <span className="text-7xl inline-block animate-wiggle">📸</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                사진 찍기
              </h3>
              <p className="text-lg md:text-xl text-gray-600">
                보고싶은 글자를 사진으로 찍어보세요
              </p>
            </div>

            <button
              onClick={() => router.push("/result")}
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-7 px-8 rounded-2xl transition-all duration-300 mb-6 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-lg md:text-xl">사진 찍기</span>
            </button>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💡</span>
                <h4 className="text-lg md:text-xl font-bold text-gray-900">
                  잘 찍는 방법
                </h4>
              </div>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                밝은 곳에서 · 바르게 · 가까이 · 천천히
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="mb-6 text-center">
              <div className="mb-4">
                <span className="text-7xl inline-block animate-wiggle">👆🏻</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                부분 읽기
              </h3>
              <p className="text-lg md:text-xl text-gray-600">
                필요한 부분만 콕! 집어서 읽어드려요
              </p>
            </div>

            <button
              onClick={() => router.push("/region-ocr")}
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-7 px-8 rounded-2xl transition-all duration-300 mb-6 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-lg md:text-xl">시작하기</span>
            </button>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💡</span>
                <h4 className="text-lg md:text-xl font-bold text-gray-900">
                  사용하는 방법
                </h4>
              </div>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                사진 올리기 · 손가락으로 표시 · 원하는 부분만 선택
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
