import os
import uuid
import json
from datetime import datetime, timezone
from typing import Dict

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import OCRHistory
from services.ocr_service import extract_text
from utils.image_processing import crop_image_region

router = APIRouter(tags=["OCR"])

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
RESULTS_DIR = os.getenv("RESULTS_DIR", "./results")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)


@router.post("/ocr")
async def process_ocr(
    file: UploadFile = File(...),
    language: str = "kor+eng",
    db: AsyncSession = Depends(get_db),
):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400, detail="이미지 파일만 업로드 가능합니다"
            )

        # 파일 읽기
        image_bytes = await file.read()

        # 파일 크기 체크 (10MB)
        if len(image_bytes) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400, detail="파일 크기는 10MB 이하여야 합니다"
            )

        task_id = str(uuid.uuid4())

        image_path = os.path.join(UPLOAD_DIR, f"{task_id}.jpg")
        with open(image_path, "wb") as f:
            f.write(image_bytes)

        result = extract_text(image_bytes, language)

        result_data = {
            "task_id": task_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "filename": file.filename,
            "language": language,
            **result,
        }

        result_path = os.path.join(RESULTS_DIR, f"{task_id}.json")
        with open(result_path, "w", encoding="utf-8") as f:
            json.dump(result_data, f, ensure_ascii=False, indent=2)

        ocr_record = OCRHistory(
            task_id=task_id,
            text=result["text"],
            word_count=result["word_count"],
            confidence=result["confidence"],
            created_at=datetime.now(timezone.utc),
        )
        db.add(ocr_record)
        await db.commit()
        await db.refresh(ocr_record)

        return JSONResponse(
            content={"success": True, "task_id": task_id, "data": result_data}
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"서버 오류: {str(e)}")


@router.post("/ocr/region")
async def process_region_ocr(
    file: UploadFile = File(...),
    x: int = Form(...),
    y: int = Form(...),
    width: int = Form(...),
    height: int = Form(...),
    language: str = Form("kor+eng"),
):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400, detail="이미지 파일만 업로드 가능합니다"
            )

        # 파일 읽기
        image_bytes = await file.read()

        # 파일 크기 체크 (10MB)
        if len(image_bytes) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400, detail="파일 크기는 10MB 이하여야 합니다"
            )

        cropped_image_bytes = crop_image_region(image_bytes, x, y, width, height)

        result = extract_text(cropped_image_bytes, language)

        return JSONResponse(
            content={
                "success": True,
                "data": {
                    "text": result["text"],
                    "confidence": result["confidence"],
                    "word_count": result["word_count"],
                    "region": {"x": x, "y": y, "width": width, "height": height},
                },
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"서버 오류: {str(e)}")


@router.get("/result/{task_id}")
async def get_result(task_id: str):
    try:
        result_path = os.path.join(RESULTS_DIR, f"{task_id}.json")

        if not os.path.exists(result_path):
            raise HTTPException(status_code=404, detail="결과를 찾을 수 없습니다")

        with open(result_path, "r", encoding="utf-8") as f:
            result = json.load(f)

        return JSONResponse(content={"success": True, "data": result})

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"서버 오류: {str(e)}")
