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

router = APIRouter(tags=["OCR"], prefix="/api")

# 상수 정의
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
RESULTS_DIR = os.getenv("RESULTS_DIR", "./results")
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_CONTENT_TYPES = ("image/jpeg", "image/png", "image/jpg", "image/webp")

# 디렉토리 초기화
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)


def validate_image_file(file: UploadFile, image_bytes: bytes) -> None:
    """이미지 파일 유효성 검사"""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="이미지 파일만 업로드 가능합니다"
        )

    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"파일 크기는 {MAX_FILE_SIZE // (1024 * 1024)}MB 이하여야 합니다"
        )


async def save_ocr_result(
    task_id: str,
    result: Dict,
    file: UploadFile,
    language: str,
    db: AsyncSession,
) -> None:
    """OCR 결과를 파일과 데이터베이스에 저장"""
    # JSON 파일로 저장
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

    # 데이터베이스에 저장
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


@router.post("/ocr")
async def process_ocr(
    file: UploadFile = File(..., description="OCR을 수행할 이미지 파일"),
    language: str = "kor+eng",
    db: AsyncSession = Depends(get_db),
):
    try:
        # 파일 읽기 및 유효성 검사
        image_bytes = await file.read()
        validate_image_file(file, image_bytes)

        # 고유 ID 생성 및 파일 저장
        task_id = str(uuid.uuid4())
        image_path = os.path.join(UPLOAD_DIR, f"{task_id}.jpg")

        with open(image_path, "wb") as f:
            f.write(image_bytes)

        # OCR 수행
        result = extract_text(image_bytes, language)

        # 결과 저장
        await save_ocr_result(task_id, result, file, language, db)

        return JSONResponse(
            content={
                "success": True,
                "task_id": task_id,
                "data": {
                    **result,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                },
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"OCR 처리 중 오류가 발생했습니다: {str(e)}"
        )


@router.post("/ocr/region")
async def process_region_ocr(
    file: UploadFile = File(..., description="OCR을 수행할 이미지 파일"),
    x: int = Form(..., description="영역 X 좌표"),
    y: int = Form(..., description="영역 Y 좌표"),
    width: int = Form(..., description="영역 너비"),
    height: int = Form(..., description="영역 높이"),
    language: str = Form("kor+eng", description="OCR 언어"),
):
    try:
        # 파일 읽기 및 유효성 검사
        image_bytes = await file.read()
        validate_image_file(file, image_bytes)

        # 영역 크롭
        cropped_image_bytes = crop_image_region(image_bytes, x, y, width, height)

        # OCR 수행
        result = extract_text(cropped_image_bytes, language)

        return JSONResponse(
            content={
                "success": True,
                "data": {
                    **result,
                    "region": {
                        "x": x,
                        "y": y,
                        "width": width,
                        "height": height,
                    },
                },
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"영역 OCR 처리 중 오류가 발생했습니다: {str(e)}"
        )


@router.get("/result/{task_id}")
async def get_result(task_id: str):
    try:
        result_path = os.path.join(RESULTS_DIR, f"{task_id}.json")

        if not os.path.exists(result_path):
            raise HTTPException(
                status_code=404,
                detail="결과를 찾을 수 없습니다"
            )

        with open(result_path, "r", encoding="utf-8") as f:
            result = json.load(f)

        return JSONResponse(
            content={
                "success": True,
                "data": result,
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"결과 조회 중 오류가 발생했습니다: {str(e)}"
        )
