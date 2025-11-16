"use client";

import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";

export default function GuidePage() {
  const router = useRouter();

  return (
    <PageLayout
      maxWidth="7xl"
      customButtons={[
        {
          label: "돌아가기",
          onClick: () => router.push("/"),
        },
      ]}
    >
      {/* 가이드 헤더 */}
      <div className="mb-2">
        <div className="bg-gray-100 rounded-2xl p-5 md:p-6 text-center">
          <div className="mb-3"></div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            📖 읽어드림 사용 가이드
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            읽어드림을 쉽고 편하게 사용하는 방법을 알려드려요
          </p>
        </div>
      </div>

      {/* 추가 기능들 */}
      <div className="grid md:grid-cols-3 gap-4 mb-5">
        {/* 음성 듣기 */}
        <div className="bg-gray-100 rounded-2xl p-5 md:p-6">
          <div className="text-center mb-3">
            <span className="text-5xl inline-block animate-float">🔊</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
            음성으로 듣기
          </h3>
          <p className="text-base text-gray-600 text-center">
            읽어드림 버튼을 누르면 글자를 소리로 읽어드려요
          </p>
        </div>

        {/* 복사하기 */}
        <div className="bg-gray-100 rounded-2xl p-5 md:p-6">
          <div className="text-center mb-3">
            <span className="text-5xl inline-block animate-float-delay-1">
              📋
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
            복사하기
          </h3>
          <p className="text-base text-gray-600 text-center">
            읽은 내용을 다른 곳에 붙여넣을 수 있어요
          </p>
        </div>

        {/* 기록 보기 */}
        <div className="bg-gray-100 rounded-2xl p-5 md:p-6">
          <div className="text-center mb-3">
            <span className="text-5xl inline-block animate-float-delay-2">
              📚
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
            기록 보기
          </h3>
          <p className="text-base text-gray-600 text-center">
            이전에 읽었던 내용을 다시 볼 수 있어요
          </p>
        </div>
      </div>

      {/* 팁 섹션 */}
      <div className="bg-gray-100 rounded-2xl p-5 md:p-6">
        <div className="text-center mb-5">
          <div className="mb-3">
            <span className="text-5xl inline-block animate-wiggle">💡</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            더 잘 사용하는 방법
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4">
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              사진 잘 찍기
            </h4>
            <ul className="text-base text-gray-700 space-y-1">
              <li>• 밝은 곳에서 찍으세요</li>
              <li>• 문서를 바르게 놓고 찍으세요</li>
              <li>• 글자가 크게 보이도록 가까이서 찍으세요</li>
              <li>• 손이 흔들리지 않게 천천히 찍으세요</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-4">
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              더 정확하게
            </h4>
            <ul className="text-base text-gray-700 space-y-1">
              <li>• 그림자가 생기지 않게 해주세요</li>
              <li>• 글자가 선명하게 보이는지 확인하세요</li>
              <li>• 한 번에 너무 많은 글자를 찍지 마세요</li>
              <li>• 필요한 부분만 선택해서 읽으세요</li>
            </ul>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
