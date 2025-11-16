"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Volume2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import axios, { AxiosError } from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined"
    ? `${window.location.origin}/api`
    : "http://localhost:8000/api");

const SPEECH_CONFIG = {
  rate: 0.8,
  pitch: 1.0,
  lang: "ko-KR",
} as const;

const HISTORY_LIMIT = 50;

interface HistoryItem {
  id: number;
  task_id: string;
  text: string;
  text_preview: string;
  confidence: number;
  word_count: number;
  created_at: string;
}

interface APIResponse<T> {
  success: boolean;
  data: T;
}

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get<APIResponse<HistoryItem[]>>(
        `${API_URL}/history?limit=${HISTORY_LIMIT}`,
        {
          withCredentials: false,
        }
      );

      if (response.data.success) {
        setHistory(response.data.data);
      } else {
        setError("서버 응답이 올바르지 않습니다.");
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ detail: string }>;
      const errorMessage =
        axiosError.response?.data?.detail ||
        "기록을 불러올 수 없습니다. 다시 시도해주세요.";

      console.error("기록 보기 오류:", axiosError);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 이벤트 핸들러
  const handleDeleteClick = (id: number) => {
    setDeleteConfirm(id);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/history/${id}`);
      // 삭제 후 목록에서 제거
      setHistory(history.filter((item) => item.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      const axiosError = err as AxiosError<{ detail: string }>;
      const errorMessage =
        axiosError.response?.data?.detail ||
        "삭제에 실패했습니다. 다시 시도해주세요.";
      setDeleteError(errorMessage);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
    setDeleteError(null);
  };

  const speak = (id: number, text: string) => {
    if (!("speechSynthesis" in window)) {
      setError(
        "현재 사용하시는 기기에서는 소리로 읽어주는 기능을 사용할 수 없어요."
      );
      return;
    }

    if (isSpeaking && speakingId === id) {
      // 같은 항목 클릭 시 중지
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingId(null);
    } else {
      // 다른 항목 클릭 시 새로 읽기
      speechSynthesis.cancel();

      // 줄바꿈을 짧은 멈춤으로 변환하여 자연스럽게 읽기
      const cleanedText = text.replace(/\n+/g, ". ");

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = SPEECH_CONFIG.lang;
      utterance.rate = SPEECH_CONFIG.rate;
      utterance.pitch = SPEECH_CONFIG.pitch;

      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingId(null);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setSpeakingId(null);
        setError("음성 재생 중 문제가 발생했습니다.");
      };

      speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      setSpeakingId(id);
    }
  };

  // 유틸리티 함수
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "오늘";
    if (days === 1) return "어제";
    if (days < 7) return `${days}일 전`;

    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 렌더링
  return (
    <PageLayout
      maxWidth="4xl"
      customButtons={[
        {
          label: "돌아가기",
          onClick: () => router.push("/"),
        },
      ]}
    >
      <div className="card md:bg-gray-100 rounded-3xl p-6">
        {/* 헤더 */}
        <div className="mb- pb-6 border-b border-gray-300">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
            기록 보기
          </h1>
          <p className="text-base md:text-lg text-gray-600 font-medium text-center">
            이전에 읽으셨던 내용들을 다시 볼 수 있어요!
          </p>
        </div>

        {/* 통계 섹션 */}
        {!isLoading && !error && history.length > 0 && (
          <div className="mb-6 bg-white rounded-2xl p-5 ">
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-700 mb-1">
                  {history.length}
                </div>
                <div className="text-sm md:text-base text-gray-700 font-medium">
                  읽은 문서
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-700 mb-1">
                  {history.reduce((sum, item) => sum + item.word_count, 0)}
                </div>
                <div className="text-sm md:text-base text-gray-700 font-medium">
                  읽은 글자
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-700 mb-1">
                  {Math.round(
                    history.reduce((sum, item) => sum + item.confidence, 0) /
                      history.length
                  )}
                  %
                </div>
                <div className="text-sm md:text-base text-gray-700 font-medium">
                  평균 정확도
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 로딩 */}
        {isLoading && (
          <div className="text-center py-12">
            <div
              className="inline-block animate-spin rounded-full
                h-12 w-12 border-b-4 border-black mb-4"
            ></div>
            <p className="text-gray-700 mt-4">기록 불러오는 중...</p>
          </div>
        )}

        {/* 에러 */}
        {error && !isLoading && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchHistory}
              className="mt-3 text-red-600 hover:text-red-800 font-medium underline"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 삭제 확인 모달 */}
        {deleteConfirm && (
          <div className="mb-4 bg-gray-100 border-l-4 border-gray-300 p-4 rounded">
            <p className="text-gray-900 font-medium mb-3">
              이 기록을 삭제하시겠습니까?
            </p>
            {deleteError && (
              <p className="text-red-600 text-sm mb-3">{deleteError}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleDeleteConfirm(deleteConfirm)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white
                    font-bold py-2 px-4 rounded-xl transition-all"
              >
                삭제
              </button>
              <button
                onClick={handleDeleteCancel}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900
                    font-bold py-2 px-4 rounded-xl transition-all"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* 기록 목록 */}
        {!isLoading && !error && (
          <>
            {history.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-700 text-lg mb-6">
                  아직 촬영 기록이 없습니다.
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="bg-black hover:bg-gray-800 text-white
                       font-bold px-6 py-6 rounded-xl transition-all mb-5 text-xl hover-scale-sm"
                >
                  첫 촬영 시작하기
                </button>
              </div>
            ) : (
              <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-5
                        hover:bg-gray-200 transition-all"
                  >
                    {/* 날짜 */}
                    <div className="text-lg text-gray-900 font-medium mb-3">
                      📅 {formatDate(item.created_at)}
                    </div>

                    {/* 텍스트 미리보기 - 줄바꿈 표시 */}
                    <p className="text-gray-900 mb-4 ocr-text line-clamp-3 text-base whitespace-pre-wrap">
                      {item.text_preview}
                    </p>

                    {/* 정보 */}
                    <div className="flex gap-4 text-base text-gray-900 mb-4">
                      <span className="font-medium">
                        글자 {item.word_count}개
                      </span>
                      <span className="font-medium">
                        정확도 {item.confidence}%
                      </span>
                    </div>

                    {/* 버튼들 */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => speak(item.id, item.text)}
                        disabled={deleteConfirm === item.id}
                        className={`
                            flex-1 py-3 rounded-3xl font-bold transition-all                             ${
                              isSpeaking && speakingId === item.id
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-black hover:bg-gray-800 text-white"
                            }
                            ${
                              deleteConfirm === item.id
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }
                          `}
                      >
                        <Volume2 className="w-5 h-5 inline mr-2" />
                        {isSpeaking && speakingId === item.id
                          ? "멈추기"
                          : "듣기"}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        disabled={deleteConfirm === item.id}
                        className={`
                            px-5 py-3 rounded-3xl bg-red-100 text-red-600
                            hover:bg-red-200 transition-all font-bold                             ${
                              deleteConfirm === item.id
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }
                          `}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
