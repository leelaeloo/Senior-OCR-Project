"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera, Trash2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined"
    ? `${window.location.origin}/api`
    : "http://localhost:8000/api");

interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function RegionOCR() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageDrawInfoRef = useRef<{
    offsetX: number;
    offsetY: number;
    drawWidth: number;
    drawHeight: number;
  } | null>(null);

  // 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setResult(null);
      setCurrentRegion(null);
      imageDrawInfoRef.current = null; // 초기화
    }
  };

  // 캔버스에 이미지 그리기
  useEffect(() => {
    if (imageUrl && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        imageRef.current = img;

        // 정사각형 캔버스 크기 설정
        const maxSize = Math.min(600, window.innerWidth - 80);
        canvas.width = maxSize;
        canvas.height = maxSize;

        // 이미지를 정사각형에 맞게 조정 (contain 방식)
        const imgRatio = img.width / img.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgRatio > 1) {
          // 가로가 더 긴 이미지
          drawWidth = maxSize;
          drawHeight = maxSize / imgRatio;
          offsetX = 0;
          offsetY = (maxSize - drawHeight) / 2;
        } else {
          // 세로가 더 긴 이미지
          drawHeight = maxSize;
          drawWidth = maxSize * imgRatio;
          offsetX = (maxSize - drawWidth) / 2;
          offsetY = 0;
        }

        // 배경을 흰색으로 채우기
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, maxSize, maxSize);

        // 이미지 그리기
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // 이미지 그리기 정보 저장
        imageDrawInfoRef.current = { offsetX, offsetY, drawWidth, drawHeight };
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  // 캔버스에 영역 그리기
  const drawRegion = (region: Region) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const drawInfo = imageDrawInfoRef.current;
    if (!ctx || !imageRef.current || !canvas || !drawInfo) return;

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 배경을 흰색으로 채우기
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 저장된 정보로 이미지 다시 그리기
    ctx.drawImage(
      imageRef.current,
      drawInfo.offsetX,
      drawInfo.offsetY,
      drawInfo.drawWidth,
      drawInfo.drawHeight
    );

    // 선택 영역 그리기
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(region.x, region.y, region.width, region.height);

    // 반투명 오버레이
    ctx.fillStyle = "rgba(251, 191, 36, 0.2)";
    ctx.fillRect(region.x, region.y, region.width, region.height);
  };

  // 마우스 다운
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (result) return; // 결과가 있으면 영역 선택 비활성화

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPos({ x, y });
    setCurrentRegion(null);
  };

  // 마우스 이동
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const region: Region = {
      x: Math.min(startPos.x, x),
      y: Math.min(startPos.y, y),
      width: Math.abs(x - startPos.x),
      height: Math.abs(y - startPos.y),
    };

    drawRegion(region);
  };

  // 마우스 업
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const region: Region = {
      x: Math.min(startPos.x, x),
      y: Math.min(startPos.y, y),
      width: Math.abs(x - startPos.x),
      height: Math.abs(y - startPos.y),
    };

    setIsDrawing(false);

    // 최소 크기 확인
    if (region.width > 10 && region.height > 10) {
      setCurrentRegion(region);
      drawRegion(region);
    }
  };

  // 터치 이벤트 핸들러 (모바일 지원)
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (result) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    setIsDrawing(true);
    setStartPos({ x, y });
    setCurrentRegion(null);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const region: Region = {
      x: Math.min(startPos.x, x),
      y: Math.min(startPos.y, y),
      width: Math.abs(x - startPos.x),
      height: Math.abs(y - startPos.y),
    };

    drawRegion(region);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas || !e.changedTouches[0]) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.changedTouches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const region: Region = {
      x: Math.min(startPos.x, x),
      y: Math.min(startPos.y, y),
      width: Math.abs(x - startPos.x),
      height: Math.abs(y - startPos.y),
    };

    setIsDrawing(false);

    if (region.width > 10 && region.height > 10) {
      setCurrentRegion(region);
      drawRegion(region);
    }
  };

  // OCR 처리
  const processRegionOCR = async () => {
    if (!image || !currentRegion) return;

    setIsProcessing(true);

    try {
      const canvas = canvasRef.current;
      if (!canvas || !imageRef.current) return;

      // 캔버스 스케일 계산
      const scale = imageRef.current.width / canvas.width;

      // 실제 이미지 좌표로 변환
      const actualRegion = {
        x: Math.round(currentRegion.x * scale),
        y: Math.round(currentRegion.y * scale),
        width: Math.round(currentRegion.width * scale),
        height: Math.round(currentRegion.height * scale),
      };

      const formData = new FormData();
      formData.append("file", image);
      formData.append("x", actualRegion.x.toString());
      formData.append("y", actualRegion.y.toString());
      formData.append("width", actualRegion.width.toString());
      formData.append("height", actualRegion.height.toString());
      formData.append("language", "kor+eng");

      const response = await axios.post(`${API_URL}/ocr/region`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      if (response.data.success) {
        setResult(response.data.data);
      }
    } catch (err: any) {
      console.error("OCR 오류:", err);
      alert(err.response?.data?.detail || "OCR 처리 중 오류가 발생했습니다");
    } finally {
      setIsProcessing(false);
    }
  };

  // TTS
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const cleanedText = text.replace(/\n+/g, ". ");
        const utterance = new SpeechSynthesisUtterance(cleanedText);
        utterance.lang = "ko-KR";
        utterance.rate = 0.8;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    } else {
      alert("음성 기능을 지원하지 않는 브라우저입니다");
    }
  };

  // 초기화
  const reset = () => {
    setCurrentRegion(null);
    setResult(null);
    setIsSpeaking(false);
    speechSynthesis.cancel();

    // 캔버스 초기화
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const drawInfo = imageDrawInfoRef.current;
    if (ctx && imageRef.current && canvas && drawInfo) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 배경을 흰색으로 채우기
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 저장된 정보로 이미지 다시 그리기
      ctx.drawImage(
        imageRef.current,
        drawInfo.offsetX,
        drawInfo.offsetY,
        drawInfo.drawWidth,
        drawInfo.drawHeight
      );
    }
  };

  return (
    <PageLayout
      customButtons={[
        {
          label: "돌아가기",
          onClick: () => router.push("/"),
        },
      ]}
    >
      {!imageUrl ? (
        // 이미지 업로드 화면
        <div className="max-w-2xl mx-auto">
          <div className="card text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              부분 읽기
            </h2>
            <p className="text-base md:text-lg text-gray-700 mb-6">
              사진을 올리고, 읽을 부분을 손가락 또는 마우스로 표시해주세요
              <br />
              천천히 그어도 괜찮아요!
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-black hover:bg-gray-800 text-white font-bold px-8 py-4 rounded-xl transition-all inline-flex items-center gap-3"
            >
              <Camera className="w-6 h-6" />
              사진 선택
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* 사용 가이드 */}
          <div className="bg-blue-100 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📖</span>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                이렇게 사용하세요
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-white rounded-xl p-4">
                <div className="bg-blue-300 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-bold text-xl text-gray-900 mb-1">
                    사진을 선택하세요
                  </p>
                  <p className="text-base text-gray-600">
                    약봉투, 신문, 편지 등 읽고 싶은 문서를 찍거나 선택해주세요
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-xl p-4">
                <div className="bg-blue-300 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-bold text-xl text-gray-900 mb-1">
                    읽을 부분을 표시하세요
                  </p>
                  <p className="text-base text-gray-600">
                    손가락이나 마우스로 천천히 드래그해서 읽고 싶은 부분을
                    선택하세요
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-xl p-4">
                <div className="bg-blue-300 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-bold text-xl text-gray-900 mb-1">
                    읽기 버튼을 누르세요
                  </p>
                  <p className="text-base text-gray-600">
                    선택한 부분의 글자를 크게 보여드리고 소리로 읽어드려요
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // 영역 선택 및 결과 화면
        <div
          className={`grid gap-8 transition-all duration-500 ${
            result ? "md:grid-cols-2" : "md:grid-cols-1"
          }`}
        >
          {/* 왼쪽: 캔버스 영역 */}
          <div
            className={`transition-all duration-500 ${
              result ? "" : "max-w-2xl mx-auto"
            }`}
          >
            <div className="card">
              <h2 className="text-2xl md:text-2xl font-bold text-gray-900 mb-4 text-center">
                {result
                  ? "선택한 부분"
                  : "읽을 부분을 손가락 또는 마우스로 표시해주세요"}
              </h2>
              <div className="flex justify-center mb-4">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="border-2 border-gray-300 rounded-lg cursor-crosshair"
                  style={{ touchAction: "none" }}
                />
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 justify-center flex-wrap">
                {currentRegion && !result && (
                  <button
                    onClick={processRegionOCR}
                    disabled={isProcessing}
                    className="bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white font-bold px-6 py-3 rounded-xl transition-all"
                  >
                    {isProcessing ? "처리 중..." : "선택 부분 읽기"}
                  </button>
                )}

                {result && (
                  <button
                    onClick={reset}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-5 py-3 rounded-xl transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    다시 선택
                  </button>
                )}

                <button
                  onClick={() => {
                    setImage(null);
                    setImageUrl(null);
                    setResult(null);
                    setCurrentRegion(null);
                    setIsSpeaking(false);
                    speechSynthesis.cancel();
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-5 py-3 rounded-xl transition-all"
                >
                  새 사진
                </button>
              </div>
            </div>
          </div>

          {/* 오른쪽: 결과 영역 - 결과가 있을 때만 표시 */}
          {result && (
            <div className="animate-slide-in-right">
              <div className="card sticky top-24 h-fit">
                {/* 헤더 */}
                <div className="mb-4 pb-4 border-b-2 border-gray-200">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
                    추출 결과
                  </h1>
                  <p className="text-base md:text-xl text-blue-800 font-medium text-center">
                    글씨를 찾았어요!
                  </p>
                </div>

                {/* 결과 텍스트 박스 (스크롤 가능) */}
                <div className="bg-gray-100 rounded-2xl p-5 mb-4 max-h-[60vh] overflow-y-auto">
                  <p className="text-base leading-relaxed text-black whitespace-pre-wrap">
                    {result.text || "글씨를 찾을 수 없어요"}
                  </p>
                </div>

                {/* TTS 버튼 */}
                <button
                  onClick={() => speak(result.text)}
                  className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
                    isSpeaking
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-black hover:bg-gray-800 text-white"
                  }`}
                >
                  {isSpeaking ? "⏹️ 소리 멈추기" : "🔊 소리로 읽어주기"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}
