"use client";

// 가이드 페이지
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";

export default function GuidePage() {
  const router = useRouter();

  return (
    <PageLayout
      maxWidth="7xl"
      customButtons={[
        {
          label: "지난기록",
          onClick: () => router.push("/history"),
        },
        {
          label: "돌아가기",
          onClick: () => router.push("/"),
        },
      ]}
    >
      <div className="mb-4 md:mb-6 animate-fade-in">
        <div className="rounded-2xl p-4 md:p-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3 animate-slide-down">
            📖 읽어드림 사용 가이드
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-gray-600">
            읽어드림을 쉽고 편하게 사용하는 방법을 알려드려요
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        <div
          className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up"
          style={{ animationDelay: "100ms" }}
        >
          <div className="text-center mb-2 md:mb-3">
            <span className="text-4xl md:text-5xl inline-block animate-float">
              🔊
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 text-center">
            음성으로 듣기
          </h3>
          <p className="text-sm md:text-base text-gray-600 text-center leading-relaxed">
            읽어드림 버튼을 누르면 글자를 소리로 읽어드려요
          </p>
        </div>

        <div
          className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up"
          style={{ animationDelay: "200ms" }}
        >
          <div className="text-center mb-2 md:mb-3">
            <span className="text-4xl md:text-5xl inline-block animate-float-delay-1">
              📋
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 text-center">
            복사하기
          </h3>
          <p className="text-sm md:text-base text-gray-600 text-center leading-relaxed">
            읽은 내용을 다른 곳에 붙여넣을 수 있어요
          </p>
        </div>

        <div
          className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up"
          style={{ animationDelay: "300ms" }}
        >
          <div className="text-center mb-2 md:mb-3">
            <span className="text-4xl md:text-5xl inline-block animate-float-delay-2">
              📚
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 text-center">
            기록 보기
          </h3>
          <p className="text-sm md:text-base text-gray-600 text-center leading-relaxed">
            이전에 읽었던 내용을 다시 볼 수 있어요
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl p-4 md:p-6 animate-slide-up"
        style={{ animationDelay: "400ms" }}
      >
        <div className="text-center mb-4 md:mb-6">
          <div className="mb-2 md:mb-3">
            <span className="text-4xl md:text-5xl inline-block animate-wiggle">
              💡
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            더 잘 사용하는 방법
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <h4 className="text-base md:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>📸</span> 사진 잘 찍기
            </h4>
            <ul className="text-sm md:text-base text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-gray-900 font-medium">•</span>
                <span>밝은 곳에서 찍으세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-900 font-medium">•</span>
                <span>문서를 바르게 놓고 찍으세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-900 font-medium">•</span>
                <span>글자가 크게 보이도록 가까이서 찍으세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-900 font-medium">•</span>
                <span>손이 흔들리지 않게 천천히 찍으세요</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <h4 className="text-base md:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>✨</span> 더 정확하게
            </h4>
            <ul className="text-sm md:text-base text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-gray-900 font-medium">•</span>
                <span>그림자가 생기지 않게 해주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-900 font-medium">•</span>
                <span>글자가 선명하게 보이는지 확인하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-900 font-medium">•</span>
                <span>한 번에 너무 많은 글자를 찍지 마세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-900 font-medium">•</span>
                <span>필요한 부분만 선택해서 읽으세요</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
