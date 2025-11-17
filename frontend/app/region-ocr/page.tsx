"use client";

// 부분 읽기 페이지
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera, Trash2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setResult(null);
      setCurrentRegion(null);
      imageDrawInfoRef.current = null;
    }
  };

  useEffect(() => {
    if (imageUrl && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        imageRef.current = img;

        const maxSize = Math.min(600, window.innerWidth - 80);
        canvas.width = maxSize;
        canvas.height = maxSize;

        const imgRatio = img.width / img.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgRatio > 1) {
          drawWidth = maxSize;
          drawHeight = maxSize / imgRatio;
          offsetX = 0;
          offsetY = (maxSize - drawHeight) / 2;
        } else {
          drawHeight = maxSize;
          drawWidth = maxSize * imgRatio;
          offsetX = (maxSize - drawWidth) / 2;
          offsetY = 0;
        }

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, maxSize, maxSize);

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        imageDrawInfoRef.current = { offsetX, offsetY, drawWidth, drawHeight };
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  const drawRegion = (region: Region) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const drawInfo = imageDrawInfoRef.current;
    if (!ctx || !imageRef.current || !canvas || !drawInfo) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      imageRef.current,
      drawInfo.offsetX,
      drawInfo.offsetY,
      drawInfo.drawWidth,
      drawInfo.drawHeight
    );

    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(region.x, region.y, region.width, region.height);

    ctx.fillStyle = "rgba(251, 191, 36, 0.2)";
    ctx.fillRect(region.x, region.y, region.width, region.height);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (result) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPos({ x, y });
    setCurrentRegion(null);
  };

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

    if (region.width > 10 && region.height > 10) {
      setCurrentRegion(region);
      drawRegion(region);
    }
  };

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

  const processRegionOCR = async () => {
    if (!image || !currentRegion) return;

    setIsProcessing(true);

    try {
      const canvas = canvasRef.current;
      if (!canvas || !imageRef.current) return;

      const scale = imageRef.current.width / canvas.width;

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

  const reset = () => {
    setCurrentRegion(null);
    setResult(null);
    setIsSpeaking(false);
    speechSynthesis.cancel();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const drawInfo = imageDrawInfoRef.current;
    if (ctx && imageRef.current && canvas && drawInfo) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
          label: "도움말",
          onClick: () => router.push("/guide"),
        },
        {
          label: "돌아가기",
          onClick: () => router.push("/"),
        },
      ]}
    >
      {!imageUrl ? (
        // 이미지 업로드 화면
        <div className="max-w-3xl mx-auto">
          <div className="card bg-white text-center mb-4 md:mb-6 shadow-sm animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3 animate-slide-down">
              👆🏻 부분 읽기
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 mb-5 md:mb-6 leading-relaxed">
              사진을 올리고, 읽을 부분을 손가락 또는 마우스로 표시해주세요
              <br />
              천천히 그어도 괜찮아요!
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-black hover:bg-gray-800 text-white font-bold px-6 md:px-8 py-4 md:py-5 rounded-2xl transition-all duration-300 inline-flex items-center gap-2 text-base md:text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <Camera className="w-5 h-5 md:w-6 md:h-6" />
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
                    읽을 부분을 표시하세요
                  </p>
                  <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                    손가락이나 마우스로 천천히 드래그해서 읽고 싶은 부분을
                    선택하세요
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 md:gap-3 bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="bg-blue-500 text-white rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center font-bold flex-shrink-0 text-sm md:text-base shadow-md">
                  3
                </div>
                <div>
                  <p className="font-bold text-sm md:text-lg text-gray-900 mb-0.5 md:mb-1">
                    읽기 버튼을 누르세요
                  </p>
                  <p className="text-xs md:text-base text-gray-600 leading-relaxed">
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
          className={`grid gap-5 md:gap-6 transition-all duration-500 ${
            result ? "md:grid-cols-2" : "md:grid-cols-1"
          }`}
        >
          <div
            className={`transition-all duration-500 ${
              result ? "" : "max-w-2xl mx-auto"
            }`}
          >
            <div className="card animate-fade-in">
              <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2 md:mb-3 text-center">
                {result
                  ? "선택한 부분"
                  : "읽을 부분을 손가락 또는 마우스로 표시해주세요"}
              </h3>
              <div className="flex justify-center mb-3">
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

              {isProcessing ? (
                <LoadingSpinner
                  message="글씨를 찾고 있어요"
                  submessage="잠시만 기다려주세요..."
                />
              ) : (
                <div className="flex gap-2 justify-center flex-wrap">
                  {currentRegion && !result && (
                    <button
                      onClick={processRegionOCR}
                      className="bg-black hover:bg-gray-800 text-white font-bold px-4 md:px-5 py-2.5 md:py-3 rounded-xl transition-all text-xs md:text-sm"
                    >
                      선택 부분 읽기
                    </button>
                  )}

                  {result && (
                    <button
                      onClick={reset}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-all flex items-center gap-1.5 text-xs md:text-sm"
                    >
                      <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
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
                    className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-all text-xs md:text-sm"
                  >
                    새 사진
                  </button>
                </div>
              )}
            </div>
          </div>

          {result && !isProcessing && (
            <div className="animate-slide-in-right">
              <div className="card sticky top-24 h-fit">
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
                  onClick={() => speak(result.text)}
                  className={`w-full py-3 md:py-4 rounded-xl font-bold text-sm md:text-base transition-all ${
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
