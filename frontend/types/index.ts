export interface OCRResult {
  task_id?: string;
  text: string;
  confidence: number;
  word_count: number;
  words?: Array<{
    text: string;
    confidence: number;
  }>;
  timestamp?: string;
  filename?: string;
}

export interface HistoryItem {
  id: number;
  task_id: string;
  text: string;
  text_preview: string;
  confidence: number;
  word_count: number;
  created_at: string;
}

export interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
