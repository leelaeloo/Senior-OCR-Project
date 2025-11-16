"""Image processing utilities for OCR"""

import cv2
import numpy as np
from fastapi import HTTPException


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    이미지 전처리 (EasyOCR 최적화)

    EasyOCR은 딥러닝 기반이므로 컬러 이미지를 유지하고
    최소한의 전처리만 수행하여 원본에 가까운 이미지를 사용합니다.

    Args:
        image_bytes: 원본 이미지 바이트

    Returns:
        전처리된 이미지 (RGB 컬러, 가벼운 노이즈 제거)
    """
    # 바이트를 OpenCV 이미지로 변환 (컬러)
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # 가벼운 노이즈 제거 (컬러 이미지용)
    # h 값을 낮춰서 가볍게 처리 (10 -> 5)
    denoised = cv2.fastNlMeansDenoisingColored(img, None, 5, 5, 7, 21)

    # BGR을 RGB로 변환 (EasyOCR은 RGB를 기대함)
    rgb_img = cv2.cvtColor(denoised, cv2.COLOR_BGR2RGB)

    return rgb_img


def crop_image_region(
    image_bytes: bytes, x: int, y: int, width: int, height: int
) -> bytes:
    """
    이미지에서 특정 영역을 크롭

    Args:
        image_bytes: 원본 이미지 바이트
        x: 시작 X 좌표
        y: 시작 Y 좌표
        width: 영역 너비
        height: 영역 높이

    Returns:
        크롭된 이미지 바이트

    Raises:
        HTTPException: 이미지 크롭 실패 시
    """
    try:
        # 바이트를 OpenCV 이미지로 변환
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # 이미지 크기 확인
        img_height, img_width = img.shape[:2]

        # 좌표 유효성 검사 및 보정
        x = max(0, min(x, img_width - 1))
        y = max(0, min(y, img_height - 1))
        width = max(1, min(width, img_width - x))
        height = max(1, min(height, img_height - y))

        # 영역 크롭
        cropped = img[y : y + height, x : x + width]

        # 크롭된 이미지를 바이트로 변환
        _, buffer = cv2.imencode(".jpg", cropped)
        return buffer.tobytes()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"이미지 크롭 실패: {str(e)}")
