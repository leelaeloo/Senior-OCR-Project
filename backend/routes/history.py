from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from database import get_db
from models import OCRHistory

router = APIRouter(tags=["History"])


@router.get("/history")
async def get_history(limit: int = 10, db: AsyncSession = Depends(get_db)):
    try:
        query = select(OCRHistory).order_by(desc(OCRHistory.created_at)).limit(limit)
        result = await db.execute(query)
        records = result.scalars().all()

        history = []
        for record in records:
            history.append(
                {
                    "id": record.id,
                    "task_id": record.task_id,
                    "text_preview": (
                        record.text[:100] + "..."
                        if len(record.text) > 100
                        else record.text
                    ),
                    "text": record.text,  # 전체 텍스트도 포함
                    "confidence": record.confidence,
                    "word_count": record.word_count,
                    "created_at": record.created_at.isoformat(),
                }
            )

        return JSONResponse(
            content={"success": True, "count": len(history), "data": history}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"서버 오류: {str(e)}")


@router.delete("/history/{record_id}")
async def delete_history(record_id: int, db: AsyncSession = Depends(get_db)):
    try:
        query = select(OCRHistory).where(OCRHistory.id == record_id)
        result = await db.execute(query)
        record = result.scalar_one_or_none()

        if not record:
            raise HTTPException(status_code=404, detail="기록을 찾을 수 없습니다")

        await db.delete(record)
        await db.commit()

        return JSONResponse(
            content={"success": True, "message": "기록이 삭제되었습니다"}
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"서버 오류: {str(e)}")


@router.get("/history/{record_id}")
async def get_history_detail(record_id: int, db: AsyncSession = Depends(get_db)):
    try:
        query = select(OCRHistory).where(OCRHistory.id == record_id)
        result = await db.execute(query)
        record = result.scalar_one_or_none()

        if not record:
            raise HTTPException(status_code=404, detail="기록을 찾을 수 없습니다")

        return JSONResponse(
            content={
                "success": True,
                "data": {
                    "id": record.id,
                    "task_id": record.task_id,
                    "text": record.text,
                    "confidence": record.confidence,
                    "word_count": record.word_count,
                    "created_at": record.created_at.isoformat(),
                },
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"서버 오류: {str(e)}")
