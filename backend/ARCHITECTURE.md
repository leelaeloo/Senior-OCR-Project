# Backend Architecture

## 디렉토리 구조

```
backend/
├── main.py                    # FastAPI 앱 초기화 및 라우터 등록
├── database.py                # DB 연결 및 세션 관리
├── models.py                  # SQLAlchemy ORM 모델
├── routes/                    # API 라우터 (엔드포인트 정의)
│   ├── ocr.py                 # OCR 관련 API
│   └── history.py             # 히스토리 관련 API
├── services/                  # 비즈니스 로직
│   └── ocr_service.py         # OCR 처리 서비스
└── utils/                     # 유틸리티 함수
    └── image_processing.py    # 이미지 전처리
```

## 계층 구조

```
┌─────────────────────┐
│   main.py           │  ← FastAPI 앱, 라우터 등록, CORS
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
┌─────────┐  ┌─────────┐
│ routes/ │  │database │  ← API 엔드포인트, DB 세션
└────┬────┘  └─────────┘
     │
     ▼
┌──────────┐
│services/ │  ← 비즈니스 로직 (OCR 처리)
└────┬─────┘
     │
     ▼
┌────────┐
│ utils/ │  ← 이미지 전처리, 헬퍼 함수
└────────┘
```

## 각 모듈 설명

### main.py
- FastAPI 앱 인스턴스 생성
- CORS 미들웨어 설정
- 라우터 등록 (`ocr.router`, `history.router`)
- 앱 시작/종료 이벤트 처리
- 헬스 체크 엔드포인트

**특징:**
- 간결함 (60줄 이하)
- 설정과 초기화만 담당
- 비즈니스 로직 없음

### routes/ocr.py
**엔드포인트:**
- `POST /api/ocr` - 전체 이미지 OCR
- `POST /api/ocr/region` - 영역 선택 OCR
- `GET /api/result/{task_id}` - OCR 결과 조회

**역할:**
- 요청 검증 (파일 타입, 크기)
- `services/ocr_service.py` 호출
- DB 저장 (전체 OCR만)
- 응답 반환

### routes/history.py
**엔드포인트:**
- `GET /api/history` - 히스토리 목록 조회
- `GET /api/history/{id}` - 히스토리 상세 조회
- `DELETE /api/history/{id}` - 히스토리 삭제

**역할:**
- DB 쿼리 실행
- 응답 데이터 포맷팅

### services/ocr_service.py
**함수:**
- `extract_text(image_bytes, lang)` - OCR 처리

**역할:**
- 이미지 전처리 호출
- Tesseract OCR 실행
- 결과 데이터 구성 (텍스트, 신뢰도, 단어 수)

**특징:**
- 순수 비즈니스 로직
- FastAPI 의존성 없음 (재사용 가능)

### utils/image_processing.py
**함수:**
- `preprocess_image(image_bytes)` - 이미지 전처리
- `crop_image_region(image_bytes, x, y, w, h)` - 이미지 크롭

**역할:**
- OpenCV 기반 이미지 처리
- 그레이스케일, 노이즈 제거, 이진화
- 영역 크롭 및 검증

**특징:**
- 순수 함수형 (side effect 최소)
- 독립적으로 테스트 가능

### database.py
- SQLAlchemy 비동기 엔진 설정
- 세션 팩토리 생성
- `get_db()` 의존성 함수
- `init_db()` 테이블 생성

### models.py
- `OCRHistory` 모델 정의
- 필드: id, task_id, text, confidence, word_count, created_at

## 의존성 흐름

```
routes → services → utils
  ↓
database
  ↓
models
```

**원칙:**
- 상위 레이어는 하위 레이어에 의존 ✅
- 하위 레이어는 상위 레이어에 의존 ❌
- 같은 레벨끼리 의존 가능 ✅

## 장점

### 1. 가독성
- main.py가 60줄로 간결
- 각 파일이 단일 책임 원칙(SRP) 준수
- 파일 이름만으로 역할 파악 가능

### 2. 유지보수성
- 기능 수정 시 해당 파일만 수정
- OCR 로직 변경 → `services/ocr_service.py`만 수정
- API 엔드포인트 추가 → `routes/` 에만 파일 추가

### 3. 테스트 용이성
- 각 모듈을 독립적으로 테스트 가능
- Mock 객체 주입이 쉬움
- 단위 테스트 작성 간편

### 4. 확장성
- 새로운 라우터 추가 시 `routes/` 에 파일 추가
- 새로운 서비스 추가 시 `services/` 에 파일 추가
- main.py 수정 최소화

### 5. 재사용성
- `services/`, `utils/`는 다른 프로젝트에서도 사용 가능
- FastAPI 의존성이 분리되어 있음

## 사용 예시

### 새로운 API 추가하기

1. **라우터 생성** (`routes/translation.py`)
```python
from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["Translation"])

@router.post("/translate")
async def translate_text(text: str):
    # 번역 로직
    pass
```

2. **main.py에 등록**
```python
from routes import ocr, history, translation

app.include_router(translation.router)
```

### 새로운 서비스 추가하기

1. **서비스 생성** (`services/translation_service.py`)
```python
def translate(text: str, target_lang: str) -> str:
    # 번역 로직
    pass
```

2. **라우터에서 사용**
```python
from services.translation_service import translate

@router.post("/translate")
async def translate_text(text: str):
    result = translate(text, "en")
    return {"result": result}
```

## 마이그레이션 가이드

### 기존 코드 → 리팩토링 코드

**Before (main.py - 400줄):**
```python
# main.py에 모든 코드
def preprocess_image(...): ...
def extract_text(...): ...
def crop_image_region(...): ...
@app.post("/api/ocr"): ...
@app.post("/api/ocr/region"): ...
@app.get("/api/history"): ...
```

**After (main.py - 60줄):**
```python
# main.py는 초기화만
from routes import ocr, history
app.include_router(ocr.router)
app.include_router(history.router)
```

## 추가 개선 사항 (Future)

1. **설정 분리** - `config.py` 추가
2. **예외 처리** - `exceptions.py` 추가
3. **DTO/Schema** - `schemas.py` 추가 (Pydantic 모델)
4. **로깅** - `logging_config.py` 추가
5. **의존성 주입** - `dependencies.py` 추가
