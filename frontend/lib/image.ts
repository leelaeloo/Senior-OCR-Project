import { MAX_IMAGE_SIZE, IMAGE_QUALITY } from "./config";

export const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_IMAGE_SIZE) {
            height = (height * MAX_IMAGE_SIZE) / width;
            width = MAX_IMAGE_SIZE;
          }
        } else {
          if (height > MAX_IMAGE_SIZE) {
            width = (width * MAX_IMAGE_SIZE) / height;
            height = MAX_IMAGE_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error("이미지 압축 실패"));
            }
          },
          "image/jpeg",
          IMAGE_QUALITY
        );
      };
      img.onerror = () => reject(new Error("이미지 로드 실패"));
    };
    reader.onerror = () => reject(new Error("파일 읽기 실패"));
  });
};
