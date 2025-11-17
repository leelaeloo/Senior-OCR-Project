"use client";

// 기록 페이지
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
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingId(null);
    } else {
      speechSynthesis.cancel();

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

  return (
    <PageLayout
      maxWidth="4xl"
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
      <div className="card rounded-3xl p-6 md:p-8">
        <div className="mb-8 pb-6 border-b-2 border-gray-200">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            📚 기록 보기
          </h1>
          <p className="text-lg md:text-xl text-gray-600 text-center">
            이전에 읽으셨던 내용들을 다시 볼 수 있어요!
          </p>
        </div>

        {!isLoading && !error && history.length > 0 && (
          <div className="mb-8 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {history.length}
                </div>
                <div className="text-base md:text-lg text-gray-600">
                  읽은 문서
                </div>
              </div>
              <div className="hidden sm:block w-px h-16 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {history.reduce((sum, item) => sum + item.word_count, 0)}
                </div>
                <div className="text-base md:text-lg text-gray-600">
                  읽은 글자
                </div>
              </div>
              <div className="hidden sm:block w-px h-16 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {Math.round(
                    history.reduce((sum, item) => sum + item.confidence, 0) /
                      history.length
                  )}
                  %
                </div>
                <div className="text-base md:text-lg text-gray-600">
                  평균 정확도
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <div
              className="inline-block animate-spin rounded-full
                h-12 w-12 border-b-4 border-black mb-4"
            ></div>
            <p className="text-gray-700 mt-4">기록 불러오는 중...</p>
          </div>
        )}

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
              <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-2xl p-6
                        hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="text-lg md:text-xl text-gray-900 font-bold mb-4 flex items-center gap-2">
                      <span>📅</span> {formatDate(item.created_at)}
                    </div>

                    <p className="text-gray-700 mb-4 ocr-text line-clamp-3 text-base md:text-lg whitespace-pre-wrap leading-relaxed">
                      {item.text_preview}
                    </p>

                    <div className="flex gap-6 text-base md:text-lg text-gray-600 mb-5 pb-4 border-b border-gray-200">
                      <span>📝 {item.word_count}자</span>
                      <span>✅ {item.confidence}%</span>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => speak(item.id, item.text)}
                        disabled={deleteConfirm === item.id}
                        className={`
                            flex-1 py-4 rounded-xl font-bold text-base transition-all duration-300
                            shadow-sm hover:shadow-md
                            ${
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
                            px-5 py-4 rounded-xl bg-red-50 text-red-600 border border-red-200
                            hover:bg-red-100 transition-all duration-300 font-bold
                            ${
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
