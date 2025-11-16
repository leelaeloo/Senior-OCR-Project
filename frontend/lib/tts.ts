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

  const cleanedText = text.replace(/\n+/g, ". ");

  const utterance = new SpeechSynthesisUtterance(cleanedText);
  utterance.lang = options?.lang || "ko-KR";
  utterance.rate = options?.rate || 0.8;
  utterance.pitch = options?.pitch || 1;
  utterance.onend = options?.onEnd || (() => {});
  utterance.onerror = options?.onError || (() => {});

  speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
  }
};

export const isSpeaking = () => {
  if ("speechSynthesis" in window) {
    return speechSynthesis.speaking;
  }
  return false;
};
