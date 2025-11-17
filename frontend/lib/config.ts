export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined"
    ? `${window.location.origin}/api`
    : "http://localhost:8000");

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const IMAGE_COMPRESSION_THRESHOLD = 2 * 1024 * 1024; // 2MB
export const MAX_IMAGE_SIZE = 1920; // px
export const IMAGE_QUALITY = 0.85; // 85%
