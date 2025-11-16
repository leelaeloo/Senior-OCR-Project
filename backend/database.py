from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
import os

# 데이터베이스 파일 경로
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./ocr_history.db")

# SQL 로깅 설정 (개발: True, 프로덕션: False)
DB_ECHO = os.getenv("DB_ECHO", "false").lower() in ("true", "1", "yes")

# 비동기 엔진 생성
engine = create_async_engine(
    DATABASE_URL,
    echo=DB_ECHO,  # SQL 쿼리 로깅
)

# 비동기 세션 팩토리
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Base 클래스 (모든 모델의 부모)
Base = declarative_base()


# 의존성: DB 세션 가져오기
async def get_db():
    """FastAPI 의존성으로 사용할 DB 세션"""
    async with async_session_maker() as session:
        yield session


# 테이블 생성
async def init_db():
    """앱 시작 시 테이블 생성"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
