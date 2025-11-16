# 로컬 개발 가이드

## 로컬에서 실행하기 (Docker 없이 - 권장)

### 1. 백엔드 실행

```bash
cd backend

# 가상환경 생성 및 활성화
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 서버 실행
python main.py
```

백엔드 서버: http://localhost:8000

### 2. 프론트엔드 실행 (새 터미널)

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

프론트엔드 서버: http://localhost:3000

## 환경 변수

### frontend/.env (로컬 개발용)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### frontend/.env.production (배포용 - VM)
```
NEXT_PUBLIC_API_URL=https://goodboy.kakaolab.cloud/api
```

## 배포

로컬에서 `git push`하면:
1. GitHub Actions가 자동 실행
2. 카카오 VM에 SSH 접속
3. 코드 업데이트 및 Docker Compose로 재배포

배포는 `docker-compose.yml` 파일 사용 (Nginx, 백엔드, 프론트엔드 모두 컨테이너로 실행)
