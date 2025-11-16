/**
 * OCR 결과 표시 카드 컴포넌트
 */

import { OCRResult } from "@/types";

interface OCRResultCardProps {
  result: OCRResult;
  isSpeaking: boolean;
  onSpeak: () => void;
  onReset: () => void;
  onCopy: () => void;
}

export default function OCRResultCard({
  result,
  isSpeaking,
  onSpeak,
  onReset,
  onCopy,
}: OCRResultCardProps) {
  return (
    <div className="card sticky top-24 h-fit">
      {/* 헤더 */}
      <div className="mb-2 pb-2 border-b border-gray-200">
        <h1 className="text-base md:text-lg font-bold text-gray-900 text-center mb-1">
          추출 결과
        </h1>
        <p className="text-xs md:text-sm text-gray-700 font-medium text-center">
          글씨를 찾았어요!
        </p>
      </div>

      {/* 결과 텍스트 박스 */}
      <div className="bg-yellow-100 rounded-lg p-3 mb-2 max-h-[50vh] overflow-auto">
        <p className="text-sm leading-relaxed ocr-text text-gray-900 whitespace-pre-wrap">
          {result.text || "글씨를 찾을 수 없어요"}
        </p>
      </div>

      {/* 상세 정보 */}
      <div className="bg-yellow-50 rounded-lg p-2 mb-2 space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-700 text-[11px] font-medium">
            글자 개수
          </span>
          <span className="font-bold text-gray-900 text-xs">
            {result.word_count}개
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 text-[11px] font-medium">정확도</span>
          <span className="font-bold text-gray-900 text-xs">
            {result.confidence}%
          </span>
        </div>
      </div>

      {/* TTS 버튼 */}
      <button
        onClick={onSpeak}
        className={`w-full py-2 rounded-lg font-bold text-xs mb-2 transition-all ${
          isSpeaking
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
        }`}
      >
        {isSpeaking ? "⏹️ 소리 멈추기" : "🔊 소리로 읽어주기"}
      </button>

      {/* 하단 버튼들 */}
      <div className="grid grid-cols-2 gap-1.5">
        <button
          onClick={onReset}
          className="bg-gray-100 hover:bg-gray-200 rounded-lg p-2 transition-all"
        >
          <div className="text-center">
            <p className="text-xs font-bold text-gray-900">🔄 다시</p>
          </div>
        </button>

        <button
          onClick={onCopy}
          className="bg-gray-100 hover:bg-gray-200 rounded-lg p-2 transition-all"
        >
          <div className="text-center">
            <p className="text-xs font-bold text-gray-900">📋 복사</p>
          </div>
        </button>
      </div>
    </div>
  );
}
