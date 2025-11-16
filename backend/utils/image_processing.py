import cv2
import numpy as np
from fastapi import HTTPException


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    denoised = cv2.fastNlMeansDenoisingColored(img, None, 5, 5, 7, 21)

    rgb_img = cv2.cvtColor(denoised, cv2.COLOR_BGR2RGB)

    return rgb_img


def crop_image_region(
    image_bytes: bytes, x: int, y: int, width: int, height: int
) -> bytes:
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        img_height, img_width = img.shape[:2]

        x = max(0, min(x, img_width - 1))
        y = max(0, min(y, img_height - 1))
        width = max(1, min(width, img_width - x))
        height = max(1, min(height, img_height - y))

        cropped = img[y : y + height, x : x + width]

        _, buffer = cv2.imencode(".jpg", cropped)
        return buffer.tobytes()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"이미지 크롭 실패: {str(e)}")
