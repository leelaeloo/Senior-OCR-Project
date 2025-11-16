FROM python:3.11-slim

# EasyOCR 및 OpenCV 의존성 설치
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 코드 복사
COPY . .

# 디렉토리 생성
RUN mkdir -p uploads results

EXPOSE 8000

# 프로덕션 모드로 실행 (reload 제거)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
