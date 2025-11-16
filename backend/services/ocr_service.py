import easyocr
import numpy as np
from typing import Dict
from fastapi import HTTPException
from PIL import Image
import io

from utils.image_processing import preprocess_image

reader = easyocr.Reader(['ko', 'en'], gpu=False)


def extract_text(image_bytes: bytes, lang: str = "kor+eng") -> Dict:
    try:
        processed_img = preprocess_image(image_bytes)

        if isinstance(processed_img, Image.Image):
            img_array = np.array(processed_img)
        else:
            img_array = processed_img

        ocr_results = reader.readtext(img_array)

        sorted_results = sorted(ocr_results, key=lambda x: (x[0][0][1], x[0][0][0]))

        full_text = "\n".join([result[1] for result in sorted_results])

        confidences = [result[2] for result in sorted_results]
        avg_confidence = (
            float(sum(confidences) / len(confidences) * 100) if confidences else 0.0
        )

        words = []
        for bbox, text, conf in sorted_results:
            words.append({
                "text": text,
                "confidence": round(float(conf * 100), 2),
                "bbox": [[int(x), int(y)] for x, y in bbox]
            })

        return {
            "text": full_text.strip(),
            "confidence": round(avg_confidence, 2),
            "word_count": int(len(words)),
            "words": words,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR 처리 실패: {str(e)}")
