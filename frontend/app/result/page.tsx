"use client";

// 사진 찍기 페이지
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다");
      setImageUrl(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    stop();
    setResult(null);
    setImageUrl(null);
    setError(null);
    router.push("/");
  };

  const handleSpeak = () => {
    if (result?.text) {
      speak(result.text);
    }
  };

  const handleCopy = () => {
    if (result?.text) {
      copyToClipboard(result.text);
    }
  };

  return (
    <PageLayout
      customButtons={[
        {
          label: "도움말",
          onClick: () => router.push("/guide"),
        },
        {
          label: "돌아가기",
          onClick: () => router.push("/"),
        },
      ]}
    >
      {!result && (
        <div className="max-w-3xl mx-auto">
          <div className="card bg-white text-center mb-4 md:mb-6 shadow-sm animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3 animate-slide-down">
              📸 사진 찍기
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 mb-5 md:mb-6 leading-relaxed">
              읽고 싶은 글자가 있는 문서를 사진으로 찍어보세요!
              <br />
              사진 속 글자를 크게 보여드리고 소리로 읽어드려요!
            </p>

            {isProcessing ? (
              <LoadingSpinner />
            ) : (
              <>
                {error && (
                  <div className="mb-4 md:mb-5 bg-red-50 border border-red-200 p-3 md:p-4 rounded-xl text-center animate-fade-in">
                    <p className="text-xs md:text-base text-red-800 font-medium">
                      {error}
                    </p>
                    <button
                      onClick={() => setError(null)}
                      className="mt-2 text-xs md:text-sm text-red-600 hover:text-red-800 underline font-medium"
                    >
                      닫기
                    </button>
                  </div>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-black hover:bg-gray-800 text-white font-bold px-6 md:px-8 py-4 md:py-5 rounded-2xl transition-all duration-300 inline-flex items-center gap-2 text-base md:text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <Camera className="w-5 h-5 md:w-6 md:h-6" />
                  사진 선택
                </button>
              </>
            )}
          </div>

          {!isProcessing && (
            <div
              className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-4 md:p-6 shadow-sm animate-slide-up"
              style={{ animationDelay: "100ms" }}
            >
              <div className="flex items-center gap-2 mb-4 md:mb-5">
                <span className="text-xl md:text-2xl">📖</span>
                <h2 className="text-lg md:text-2xl font-bold text-gray-900">
                  이렇게 사용하세요
                </h2>
              </div>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-start gap-2 md:gap-3 bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="bg-blue-500 text-white rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center font-bold flex-shrink-0 text-sm md:text-base shadow-md">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-sm md:text-lg text-gray-900 mb-0.5 md:mb-1">
                      사진을 선택하세요
                    </p>
                    <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                      약봉투, 신문, 편지 등 읽고 싶은 문서를 찍거나 선택해주세요
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 md:gap-3 bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="bg-blue-500 text-white rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center font-bold flex-shrink-0 text-sm md:text-base shadow-md">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-sm md:text-lg text-gray-900 mb-0.5 md:mb-1">
                      글자를 확인하세요
                    </p>
                    <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                      사진 속 글자를 크게 보여드려요
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 md:gap-3 bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="bg-blue-500 text-white rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center font-bold flex-shrink-0 text-sm md:text-base shadow-md">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-sm md:text-lg text-gray-900 mb-0.5 md:mb-1">
                      소리로 듣기
                    </p>
                    <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                      버튼만 누르면 소리로 읽어드려요
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {imageUrl && result && (
        <div id="result-section" className="grid md:grid-cols-2 gap-5 md:gap-6">
          <div
            className="card bg-white animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2 md:mb-3 text-center">
              선택한 사진
            </h3>
            <div className="flex justify-center">
              <img
                src={imageUrl}
                alt="원본 이미지"
                className="max-w-full h-auto rounded-lg border-2 border-gray-200"
              />
            </div>
          </div>

          <div
            className="card bg-white animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="mb-2 md:mb-3 pb-2 md:pb-3 border-b-2 border-gray-200">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 text-center mb-1">
                추출 결과
              </h2>
              <p className="text-sm md:text-base text-gray-600 text-center">
                글씨를 찾았어요!
              </p>
            </div>

            <div className="bg-gray-100 rounded-2xl p-3 md:p-4 mb-2 md:mb-3 max-h-[60vh] overflow-y-auto">
              <p className="text-xs md:text-sm leading-relaxed text-black whitespace-pre-wrap">
                {result.text || "글씨를 찾을 수 없어요"}
              </p>
            </div>

            <button
              onClick={handleSpeak}
              className={`w-full py-3 md:py-4 rounded-xl font-bold text-sm md:text-base transition-all duration-300 shadow-lg hover:shadow-xl ${
                isSpeaking
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-black hover:bg-gray-800 text-white"
              }`}
            >
              {isSpeaking ? "⏹️ 소리 멈추기" : "🔊 소리로 읽어주기"}
            </button>

            <div className="grid grid-cols-2 gap-2 md:gap-3 mt-2 md:mt-3">
              <button
                onClick={handleReset}
                className="bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-xl p-2.5 md:p-3 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="text-center">
                  <p className="text-xs md:text-base font-bold text-gray-900">
                    🔄 다시 선택
                  </p>
                </div>
              </button>

              <button
                onClick={handleCopy}
                className="bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-xl p-2.5 md:p-3 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="text-center">
                  <p className="text-xs md:text-base font-bold text-gray-900">
                    📋 복사
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

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
