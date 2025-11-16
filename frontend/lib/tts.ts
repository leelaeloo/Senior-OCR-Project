/**
 * Text-to-Speech 유틸리티
 */

/**
 * 텍스트를 음성으로 읽기
 * @param text 읽을 텍스트
 * @param options TTS 옵션
 */
export const speak = (
  text: string,
  options?: {
    lang?: string;
    rate?: number;
    pitch?: number;
    onEnd?: () => void;
    onError?: () => void;
  }
) => {
  if (!("speechSynthesis" in window)) {
    alert("현재 사용하시는 기기에서는 음성 읽기 기능을 사용할 수 없어요.");
    return;
  }

  // 줄바꿈을 짧은 멈춤으로 변환
  const cleanedText = text.replace(/\n+/g, ". ");

  const utterance = new SpeechSynthesisUtterance(cleanedText);
  utterance.lang = options?.lang || "ko-KR";
  utterance.rate = options?.rate || 0.8; // 천천히
  utterance.pitch = options?.pitch || 1;
  utterance.onend = options?.onEnd || (() => {});
  utterance.onerror = options?.onError || (() => {});

  speechSynthesis.speak(utterance);
};

/**
 * 음성 읽기 중지
 */
export const stopSpeaking = () => {
  if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
  }
};

/**
 * 음성 읽기 중인지 확인
 */
export const isSpeaking = () => {
  if ("speechSynthesis" in window) {
    return speechSynthesis.speaking;
  }
  return false;
};
