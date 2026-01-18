import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routes import ocr, history

# CORS 허용 도메인 설정
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "https://goodboy.kakaolab.cloud,https://www.goodboy.kakaolab.cloud,http://localhost:3000"
).split(",")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    print("✅ 데이터베이스 초기화 완료")
    yield
    print("👋 애플리케이션 종료")


app = FastAPI(
    title="시니어 친화 OCR API",
    description="간단하고 쉬운 OCR 서비스",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ocr.router)
app.include_router(history.router)


@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": "시니어 친화 OCR API 실행 중",
        "version": "1.0.0",
    }


@app.get("/health")
async def health_check():
    """헬스체크 엔드포인트 (Docker/로드밸런서용)"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
