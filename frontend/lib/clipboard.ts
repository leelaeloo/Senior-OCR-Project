export const copyToClipboard = async (text: string): Promise<void> => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      alert("복사되었습니다!");
      return;
    } catch (err) {
    }
  }

  fallbackCopy(text);
};

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
