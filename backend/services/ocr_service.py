"""OCR processing service"""

import easyocr
import numpy as np
from typing import Dict
from fastapi import HTTPException
from PIL import Image
import io

from utils.image_processing import preprocess_image

# EasyOCR Reader 초기화 (한 번만 로드)
# 한글과 영어 지원, GPU 사용 여부는 환경에 따라 자동 설정
reader = easyocr.Reader(['ko', 'en'], gpu=False)


def extract_text(image_bytes: bytes, lang: str = "kor+eng") -> Dict:
    """
    텍스트 추출 (EasyOCR 사용)

    Args:
        image_bytes: 이미지 바이트 데이터
        lang: OCR 언어 설정 (호환성을 위해 유지, 실제로는 Reader 초기화 시 설정됨)

    Returns:
        OCR 결과 딕셔너리
        {
            "text": 추출된 텍스트,
            "confidence": 평균 신뢰도,
            "word_count": 단어 개수,
            "words": 단어별 상세 정보
        }

    Raises:
        HTTPException: OCR 처리 실패 시
    """
    try:
        # 이미지 전처리
        processed_img = preprocess_image(image_bytes)

        # PIL Image를 numpy array로 변환 (EasyOCR이 numpy array를 받음)
        if isinstance(processed_img, Image.Image):
            img_array = np.array(processed_img)
        else:
            img_array = processed_img

        # EasyOCR 실행
        # 결과 형식: [([[x1,y1],[x2,y2],[x3,y3],[x4,y4]], text, confidence), ...]
        ocr_results = reader.readtext(img_array)

        # 텍스트 추출 및 정렬 (위에서 아래로, 왼쪽에서 오른쪽으로)
        sorted_results = sorted(ocr_results, key=lambda x: (x[0][0][1], x[0][0][0]))

        # 전체 텍스트 조합
        full_text = "\n".join([result[1] for result in sorted_results])

        # 신뢰도 계산
        confidences = [result[2] for result in sorted_results]
        avg_confidence = (
            float(sum(confidences) / len(confidences) * 100) if confidences else 0.0
        )

        # 단어 정보
        words = []
        for bbox, text, conf in sorted_results:
            words.append({
                "text": text,
                "confidence": round(float(conf * 100), 2),  # 0-100 범위로 변환
                "bbox": [[int(x), int(y)] for x, y in bbox]  # numpy array를 일반 list로 변환
            })

        return {
            "text": full_text.strip(),
            "confidence": round(avg_confidence, 2),
            "word_count": int(len(words)),
            "words": words,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR 처리 실패: {str(e)}")
