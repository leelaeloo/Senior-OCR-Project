import {
  Camera,
  FileText,
  Pill,
  Newspaper,
  MousePointerClick,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface DocumentTypeGridProps {
  onSelectFile: () => void;
}

export default function DocumentTypeGrid({
  onSelectFile,
}: DocumentTypeGridProps) {
  const router = useRouter();

  return (
    <>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={onSelectFile}
          className="bg-yellow-100 hover:bg-yellow-200 rounded-lg p-2 transition-all animate-scale-in aspect-square"
          style={{ animationDelay: "0ms" }}
        >
          <div className="flex flex-col items-center justify-center gap-1 text-center h-full">
            <div className="bg-red-100 rounded-full p-1.5">
              <Pill className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">약봉투</p>
              <p className="text-[9px] text-gray-600">약 설명서</p>
            </div>
          </div>
        </button>

        <button
          onClick={onSelectFile}
          className="bg-yellow-100 hover:bg-yellow-200 rounded-lg p-2 transition-all animate-scale-in aspect-square"
          style={{ animationDelay: "100ms" }}
        >
          <div className="flex flex-col items-center justify-center gap-1 text-center h-full">
            <div className="bg-orange-100 rounded-full p-1.5">
              <FileText className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">일반 문서</p>
              <p className="text-[9px] text-gray-600">서류, 편지</p>
            </div>
          </div>
        </button>

        <button
          onClick={onSelectFile}
          className="bg-yellow-100 hover:bg-yellow-200 rounded-lg p-2 transition-all animate-scale-in aspect-square"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex flex-col items-center justify-center gap-1 text-center h-full">
            <div className="bg-amber-100 rounded-full p-1.5">
              <Newspaper className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">신문/책</p>
              <p className="text-[9px] text-gray-600">기사, 책</p>
            </div>
          </div>
        </button>

        <button
          onClick={onSelectFile}
          className="bg-yellow-100 hover:bg-yellow-200 rounded-lg p-2 transition-all animate-scale-in aspect-square"
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex flex-col items-center justify-center gap-1 text-center h-full">
            <div className="bg-blue-100 rounded-full p-1.5">
              <Camera className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">사진 촬영</p>
              <p className="text-[9px] text-gray-600">직접 촬영</p>
            </div>
          </div>
        </button>
      </div>

      <div className="bg-yellow-100 rounded-lg p-3 text-center animate-fade-in-up mb-2">
        <div className="flex items-center justify-center gap-1.5 mb-1.5">
          <div className="bg-white rounded-md p-0.5">
            <MousePointerClick className="w-3.5 h-3.5 text-yellow-600" />
          </div>
          <h3 className="text-xs font-bold text-gray-900">
            원하는 부분만 읽기
          </h3>
        </div>
        <p className="text-gray-700 text-[10px] mb-2">
          사진에서 읽고 싶은 부분을 직접 선택할 수 있어요!
        </p>
        <button
          onClick={() => router.push("/region-ocr")}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-4 py-2 rounded-lg transition-all text-xs"
        >
          지금 시작하기
        </button>
      </div>
    </>
  );
}
