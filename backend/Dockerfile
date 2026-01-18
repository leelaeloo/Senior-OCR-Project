# 멀티 스테이지 빌드로 경량화
FROM python:3.11-slim AS builder

# 빌드 의존성 설치
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# 프로덕션 이미지
FROM python:3.11-slim

# 런타임 의존성만 설치 (빌드 도구 제외)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# 보안을 위해 non-root 사용자 먼저 생성
RUN useradd -m -u 1000 appuser

WORKDIR /app

# 빌더에서 설치된 패키지를 appuser 홈으로 복사
COPY --from=builder --chown=appuser:appuser /root/.local /home/appuser/.local
ENV PATH=/home/appuser/.local/bin:$PATH

# 애플리케이션 코드 복사
COPY --chown=appuser:appuser main.py database.py models.py ./
COPY --chown=appuser:appuser routes/ ./routes/
COPY --chown=appuser:appuser services/ ./services/
COPY --chown=appuser:appuser utils/ ./utils/

# 디렉토리 생성
RUN mkdir -p uploads results && chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

# 프로덕션 모드로 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
