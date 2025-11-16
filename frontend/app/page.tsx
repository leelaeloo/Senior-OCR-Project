"use client";

import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";

export default function Home() {
  const router = useRouter();

  // 메인 화면
  return (
    <PageLayout showDefaultButtons={true}>
      {/* 사용 가이드 */}
      <div className="mb-6">
        <div className="bg-gray-100 rounded-2xl p-5 md:p-6 text-center">
          <h1 className="text-xl md:text-4xl font-bold text-gray-900 mb-5">
            📖 간단한 사용법
          </h1>

          {/* 3단계 가이드 */}
          <div className="grid md:grid-cols-3 gap-3">
            {/* 1단계 */}
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center text-white text-lg font-black bg-black animate-pulse-badge">
                1
              </div>
              <div className="mb-2">
                <span className="text-4xl inline-block animate-float">📸</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                사진 찍기
              </h3>
              <p className="text-lg text-gray-700">
                읽고 싶은 글자가 있는 문서를 사진으로 찍어요
              </p>
            </div>

            {/* 2단계 */}
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center text-white text-lg font-black bg-black animate-pulse-badge">
                2
              </div>
              <div className="mb-2">
                <span className="text-4xl inline-block animate-float-delay-1">
                  👀
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                글자 확인
              </h3>
              <p className="text-lg text-gray-700">
                사진 속 글자를 크게 보여드려요
              </p>
            </div>

            {/* 3단계 */}
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center text-white text-lg font-black bg-black animate-pulse-badge">
                3
              </div>
              <div className="mb-2">
                <span className="text-4xl inline-block animate-float-delay-2">
                  🔊
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                소리로 듣기
              </h3>
              <p className="text-lg text-gray-700">
                버튼만 누르면 소리로 읽어드려요
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <div className="card bg-white">
            {/* 시작하기 헤더 */}
            <div className="mb-5 text-center">
              <div className="mb-3">
                <span className="text-6xl inline-block animate-wiggle">📸</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                사진 찍기
              </h3>
              <p className="text-base md:text-xl text-gray-700">
                보고싶은 글자를 사진으로 찍어보세요
              </p>
            </div>

            {/* 메인 촬영 버튼 */}
            <button
              onClick={() => router.push("/result")}
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-6 px-6 rounded-xl transition-all mb-5 hover-scale-sm"
            >
              <span className="text-xl">사진 찍기</span>
            </button>

            {/* 빠른 팁 */}
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-xl font-bold text-gray-900">
                  잘 찍는 방법
                </h4>
              </div>
              <p className="text-base text-gray-700">
                밝은 곳에서 · 바르게 · 가까이 · 천천히
              </p>
            </div>
          </div>
        </div>

        {/* 오른쪽: 부분 읽기 */}
        <div className="lg:col-span-1">
          {/* 부분 읽기 카드 */}
          <div className="card bg-white">
            <div className="mb-5 text-center">
              <div className="mb-3">
                <span className="text-6xl inline-block animate-wiggle">👆🏻</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                부분 읽기
              </h3>
              <p className="text-base md:text-xl text-gray-700">
                필요한 부분만 콕! 집어서 읽어드려요
              </p>
            </div>

            {/* 메인 버튼 */}
            <button
              onClick={() => router.push("/region-ocr")}
              className="w-full bg-black hover:bg-gray-800 text-white font-bold px-6 py-6 rounded-xl transition-all mb-5 text-xl hover-scale-sm"
            >
              시작하기
            </button>

            {/* 사용 팁 */}
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-xl font-bold text-gray-900">
                  사용하는 방법
                </h4>
              </div>
              <p className="text-base text-gray-700">
                사진 올리기 · 손가락으로 표시 · 원하는 부분만 선택
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
