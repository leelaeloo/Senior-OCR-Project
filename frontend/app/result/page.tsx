"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useTTS } from "@/hooks/useTTS";
import { copyToClipboard } from "@/lib/clipboard";
import { API_URL } from "@/lib/config";
import { Camera } from "lucide-react";

interface OCRResult {
  text: string;
  confidence: number;
  word_count: number;
}

export default function ResultPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isSpeaking, speak, stop } = useTTS();

  // 파일 선택 핸들러
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 미리보기 URL 생성
    const imagePreviewUrl = URL.createObjectURL(file);
    setImageUrl(imagePreviewUrl);
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/ocr`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("OCR 처리에 실패했습니다");
      }

      const responseData = await response.json();
      setResult(responseData.data);

      // 결과 섹션으로 스크롤
      setTimeout(() => {
        document.getElementById("result-section")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다");
      setImageUrl(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // 홈으로 돌아가기
  const handleReset = () => {
    stop();
    setResult(null);
    setImageUrl(null);
    setError(null);
    router.push("/");
  };

  // TTS 핸들러
  const handleSpeak = () => {
    if (result?.text) {
      speak(result.text);
    }
  };

  // 복사 핸들러
  const handleCopy = () => {
    if (result?.text) {
      copyToClipboard(result.text);
    }
  };

  return (
    <PageLayout showDefaultButtons={true}>
      {/* 업로드 섹션 */}
      <div className="max-w-2xl mx-auto">
        <div className="card bg-white text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            사진 찍기
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-6">
            읽고 싶은 글자가 있는 문서를 사진으로 찍어보세요!
            <br />
            사진 속 글자를 크게 보여드리고 소리로 읽어드려요!
          </p>

          {isProcessing ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* 에러 메시지 */}
              {error && (
                <div className="mb-4 bg-red-50 p-4 rounded-xl text-center animate-fade-in">
                  <p className="text-base text-red-800 font-medium">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                  >
                    닫기
                  </button>
                </div>
              )}

              {/* 메인 촬영 버튼 */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-black hover:bg-gray-800 text-white font-bold px-8 py-4 rounded-xl transition-all inline-flex items-center gap-3"
              >
                <Camera className="w-6 h-6" />
                사진 선택
              </button>
            </>
          )}
        </div>

        {/* 사용 가이드 - 사진 업로드 전에만 표시 */}
        {!imageUrl && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📖</span>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                이렇게 사용하세요
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-white rounded-xl p-4">
                <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">
                    사진을 선택하세요
                  </p>
                  <p className="text-sm text-gray-600">
                    약봉투, 신문, 편지 등 읽고 싶은 문서를 찍거나 선택해주세요
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-xl p-4">
                <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">
                    글자를 확인하세요
                  </p>
                  <p className="text-sm text-gray-600">
                    사진 속 글자를 크게 보여드려요
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-xl p-4">
                <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">소리로 듣기</p>
                  <p className="text-sm text-gray-600">
                    버튼만 누르면 소리로 읽어드려요
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 결과 섹션 (이미지 업로드 후 표시) - 2단 레이아웃 */}
      {imageUrl && result && (
        <div id="result-section" className="grid md:grid-cols-2 gap-6 mt-8">
          {/* 왼쪽: 원본 이미지 */}
          <div className="card bg-white">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center">
              선택한 사진
            </h2>
            <div className="flex justify-center">
              <img
                src={imageUrl}
                alt="원본 이미지"
                className="max-w-full h-auto rounded-lg border-2 border-gray-200"
              />
            </div>
          </div>

          {/* 오른쪽: 추출 결과 */}
          <div className="card bg-white">
            <div className="mb-4 pb-4 border-b-2 border-gray-200">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
                추출 결과
              </h1>
              <p className="text-base md:text-lg text-gray-700 font-medium text-center">
                ✅ 글씨를 찾았어요!
              </p>
            </div>

            {/* 결과 텍스트 박스 (스크롤 가능) */}
            <div className="bg-yellow-100 rounded-2xl p-5 mb-4 max-h-[40vh] overflow-y-auto">
              <p className="text-lg leading-relaxed text-gray-900 whitespace-pre-wrap">
                {result.text || "글씨를 찾을 수 없어요"}
              </p>
            </div>

            {/* 상세 정보 */}
            <div className="bg-yellow-50 rounded-2xl p-4 mb-4 space-y-2">
              <div className="flex justify-between py-1">
                <span className="text-gray-700 text-sm font-medium">
                  글자 개수
                </span>
                <span className="font-bold text-gray-900 text-base">
                  {result.word_count}개
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-700 text-sm font-medium">
                  정확도
                </span>
                <span className="font-bold text-gray-900 text-base">
                  {result.confidence}%
                </span>
              </div>
            </div>

            {/* TTS 버튼 */}
            <button
              onClick={handleSpeak}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
                isSpeaking
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-black hover:bg-gray-800 text-white"
              }`}
            >
              {isSpeaking ? "⏹️ 소리 멈추기" : "🔊 소리로 읽어주기"}
            </button>

            {/* 하단 버튼들 */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <button
                onClick={handleReset}
                className="bg-gray-100 hover:bg-gray-200 rounded-xl p-3 transition-all"
              >
                <div className="text-center">
                  <p className="text-base font-bold text-gray-900">
                    🔄 다시 선택
                  </p>
                </div>
              </button>

              <button
                onClick={handleCopy}
                className="bg-gray-100 hover:bg-gray-200 rounded-xl p-3 transition-all"
              >
                <div className="text-center">
                  <p className="text-base font-bold text-gray-900">📋 복사</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </PageLayout>
  );
}
