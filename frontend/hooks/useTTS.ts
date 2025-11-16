/**
 * Text-to-Speech 커스텀 훅
 */

import { useState } from "react";
import { speak as ttsSpeak, stopSpeaking } from "@/lib/tts";

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      ttsSpeak(text, {
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
      setIsSpeaking(true);
    }
  };

  const stop = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  return {
    isSpeaking,
    speak,
    stop,
  };
}
