/**
 * 클립보드 유틸리티
 */

/**
 * 텍스트를 클립보드에 복사
 * @param text 복사할 텍스트
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  // HTTPS 환경에서는 navigator.clipboard 사용
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      alert("복사되었습니다!");
      return;
    } catch (err) {
      // fallback으로 전환
    }
  }

  // HTTP 환경에서는 fallback 방식 사용
  fallbackCopy(text);
};

/**
 * Fallback 복사 방식 (구형 브라우저/HTTP)
 * @param text 복사할 텍스트
 */
const fallbackCopy = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
    alert("복사되었습니다!");
  } catch (err) {
    alert("복사에 실패했습니다. 직접 선택해서 복사해주세요.");
  }

  document.body.removeChild(textArea);
};
