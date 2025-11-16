"""
시니어 친화 OCR API - Main Application

구조:
- routes/: API 라우터들
- services/: 비즈니스 로직
- utils/: 유틸리티 함수들
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routes import ocr, history


# 앱 lifespan 관리 (startup/shutdown 이벤트 대체)
@asynccontextmanager
async def lifespan(app: FastAPI):
    """앱 시작 시 초기화 및 종료 시 정리"""
    # Startup
    await init_db()
    print("✅ 데이터베이스 초기화 완료")
    yield
    # Shutdown (필요 시 여기에 정리 코드 추가)
    print("👋 애플리케이션 종료")


# FastAPI 앱 생성
app = FastAPI(
    title="시니어 친화 OCR API",
    description="간단하고 쉬운 OCR 서비스",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 출처 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(ocr.router)
app.include_router(history.router)


# 헬스 체크
@app.get("/")
async def root():
    """API 헬스 체크"""
    return {
        "status": "ok",
        "message": "시니어 친화 OCR API 실행 중",
        "version": "1.0.0",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
