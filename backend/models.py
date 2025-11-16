from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime, timezone
from database import Base


class OCRHistory(Base):
    """OCR 처리 기록 테이블"""

    __tablename__ = "ocr_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    task_id = Column(String(36), unique=True, index=True, nullable=False)  # UUID
    text = Column(Text, nullable=False)  # OCR 결과 텍스트
    word_count = Column(Integer, nullable=False)  # 단어 수
    confidence = Column(Float, nullable=False)  # 정확도 (%)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)  # 생성 시간

    def __repr__(self):
        return f"<OCRHistory(id={self.id}, task_id={self.task_id}, created_at={self.created_at})>"
