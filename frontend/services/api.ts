import axios from "axios";
import { API_URL } from "@/lib/config";
import { OCRResult, HistoryItem, APIResponse } from "@/types";

const client = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: false,
});

// OCR
export const ocrAPI = {
  // 이미지 OCR 처리
  processImage: async (file: File, language: string = "kor+eng") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    const response = await client.post<APIResponse<OCRResult>>(
      "/ocr",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // 영역 선택 OCR
  processRegion: async (
    file: File,
    x: number,
    y: number,
    width: number,
    height: number,
    language: string = "kor+eng"
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("x", x.toString());
    formData.append("y", y.toString());
    formData.append("width", width.toString());
    formData.append("height", height.toString());
    formData.append("language", language);

    const response = await client.post<APIResponse<OCRResult>>(
      "/ocr/region",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};

// 히스토리 API
export const historyAPI = {
  // 히스토리 목록 조회
  getList: async (limit: number = 50) => {
    const response = await client.get<APIResponse<HistoryItem[]>>(
      `/history?limit=${limit}`
    );
    return response.data;
  },

  // 히스토리 상세 조회
  getDetail: async (id: number) => {
    const response = await client.get<APIResponse<HistoryItem>>(
      `/history/${id}`
    );
    return response.data;
  },

  // 히스토리 삭제
  delete: async (id: number) => {
    const response = await client.delete<APIResponse<void>>(`/history/${id}`);
    return response.data;
  },
};
