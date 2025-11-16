/**
 * OCR 처리 커스텀 훅
 */

import { useState } from "react";
import { OCRResult } from "@/types";
import { ocrAPI } from "@/services/api";
import { compressImage } from "@/lib/image";
import { IMAGE_COMPRESSION_THRESHOLD } from "@/lib/config";

export function useOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      console.log(
        "📸 원본 파일 크기:",
        (file.size / 1024 / 1024).toFixed(2),
        "MB"
      );

      // 이미지 압축 (threshold 이상일 경우)
      let processedFile = file;
      if (file.size > IMAGE_COMPRESSION_THRESHOLD) {
        console.log("🔄 이미지 압축 중...");
        processedFile = await compressImage(file);
        console.log(
          "✅ 압축 후 크기:",
          (processedFile.size / 1024 / 1024).toFixed(2),
          "MB"
        );
      }

      const response = await ocrAPI.processImage(processedFile);

      if (response.success) {
        setResult(response.data);
      } else {
        setError("OCR 결과를 불러오지 못했습니다.");
      }
    } catch (err: any) {
      console.error("❌ OCR 요청 오류:", err);

      let errorMessage = "처리 중 오류가 발생했습니다";

      if (err.code === "ECONNABORTED") {
        errorMessage = "⏱️ 요청 시간이 초과되었습니다. 다시 시도해주세요.";
      } else if (err.response) {
        errorMessage =
          err.response?.data?.detail || `⚠️ 서버 오류 (${err.response.status})`;
      } else if (err.request) {
        errorMessage = "📡 네트워크 연결을 확인해주세요.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return {
    isProcessing,
    result,
    error,
    processImage,
    reset,
    setError,
  };
}
