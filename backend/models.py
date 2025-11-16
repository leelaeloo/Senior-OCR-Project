from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime, timezone
from database import Base


class OCRHistory(Base):
    __tablename__ = "ocr_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    task_id = Column(String(36), unique=True, index=True, nullable=False)
    text = Column(Text, nullable=False)
    word_count = Column(Integer, nullable=False)
    confidence = Column(Float, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    def __repr__(self):
        return f"<OCRHistory(id={self.id}, task_id={self.task_id}, created_at={self.created_at})>"
