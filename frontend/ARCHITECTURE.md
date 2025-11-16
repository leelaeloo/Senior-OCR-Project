# Frontend Architecture

## 디렉토리 구조

```
frontend/
├── app/                       # Next.js 앱 라우터
│   ├── page.tsx               # 메인 페이지 (간결화됨)
│   ├── layout.tsx             # 루트 레이아웃
│   ├── globals.css            # 전역 스타일
│   ├── history/               # 히스토리 페이지
│   │   └── page.tsx
│   └── region-ocr/            # 영역 선택 OCR 페이지
│       └── page.tsx
├── components/                # 재사용 가능한 UI 컴포넌트
│   ├── Header.tsx             # 헤더
│   ├── LoadingSpinner.tsx     # 로딩 스피너
│   ├── OCRResultCard.tsx      # OCR 결과 카드
│   └── DocumentTypeGrid.tsx   # 문서 타입 선택 그리드
├── hooks/                     # 커스텀 훅
│   ├── useOCR.ts              # OCR 처리 훅
│   └── useTTS.ts              # TTS 훅
├── lib/                       # 유틸리티 함수
│   ├── config.ts              # 앱 설정
│   ├── image.ts               # 이미지 처리
│   ├── tts.ts                 # Text-to-Speech
│   ├── clipboard.ts           # 클립보드
│   └── date.ts                # 날짜 포맷팅
├── services/                  # API 클라이언트
│   └── api.ts                 # axios 기반 API 호출
├── types/                     # TypeScript 타입 정의
│   └── index.ts               # 공통 타입
└── public/                    # 정적 파일
    ├── manifest.json          # PWA 설정
    └── *.png                  # 아이콘
```

## 계층 구조

```
┌─────────────────────────┐
│   app/page.tsx          │  ← 페이지 (훅과 컴포넌트 조합)
└───────────┬─────────────┘
            │
    ┌───────┴────────┐
    ▼                ▼
┌─────────┐    ┌──────────┐
│ hooks/  │    │components│  ← 비즈니스 로직 / UI
└────┬────┘    └──────────┘
     │
     ▼
┌──────────┐
│services/ │  ← API 호출
└────┬─────┘
     │
     ▼
┌────────┐
│  lib/  │  ← 순수 유틸리티
└────────┘
```

## 각 모듈 설명

### app/page.tsx (240줄 → 간결화)

**Before:** 600줄의 거대한 파일
**After:** 240줄로 축소

**역할:**

- 페이지 레이아웃만 담당
- 훅과 컴포넌트 조합
- 이벤트 핸들러만 정의

**개선 사항:**

- TTS 로직 → `hooks/useTTS.ts`
- OCR 로직 → `hooks/useOCR.ts`
- UI 컴포넌트 → `components/`
- 유틸리티 → `lib/`

### components/ (재사용 가능한 UI)

**Header.tsx**

- 앱 헤더
- 로고, 히스토리 버튼
- Props: `showHistory`, `onLogoClick`

**LoadingSpinner.tsx**

- 로딩 표시
- Props: `message`, `submessage`

**OCRResultCard.tsx**

- OCR 결과 카드
- 텍스트, 신뢰도, 단어 수 표시
- TTS, 복사, 다시 찍기 버튼
- Props: `result`, `isSpeaking`, `onSpeak`, `onReset`, `onCopy`

**DocumentTypeGrid.tsx**

- 문서 타입 선택 UI
- 약봉투, 일반문서, 신문/책, 사진촬영
- 영역 선택 OCR 버튼
- Props: `onSelectFile`

### hooks/ (커스텀 훅)

**useOCR.ts**

```typescript
{
  isProcessing: boolean;
  result: OCRResult | null;
  error: string | null;
  processImage: (file: File) => Promise<void>;
  reset: () => void;
  setError: (error: string | null) => void;
}
```

**역할:**

- 이미지 압축
- API 호출
- 에러 처리
- 상태 관리

**useTTS.ts**

```typescript
{
  isSpeaking: boolean;
  speak: (text: string) => void;
  stop: () => void;
}
```

**역할:**

- Web Speech API 래핑
- 음성 재생 상태 관리

### lib/ (유틸리티)

**config.ts**

- API URL 설정
- 이미지 압축 설정
- 상수 정의

**image.ts**

- `compressImage(file)` - 이미지 압축
- Canvas API 활용
- 최대 크기, 품질 조절

**tts.ts**

- `speak(text, options)` - 음성 재생
- `stopSpeaking()` - 음성 중지
- `isSpeaking()` - 재생 상태 확인

**clipboard.ts**

- `copyToClipboard(text)` - 클립보드 복사
- HTTPS/HTTP fallback 처리

**date.ts**

- `formatRelativeDate()` - "오늘", "어제" 등
- `formatAbsoluteDate()` - "2024-01-15 14:30"

### services/ (API 클라이언트)

**api.ts**

```typescript
// OCR API
ocrAPI.processImage(file, language);
ocrAPI.processRegion(file, x, y, width, height, language);

// 히스토리 API
historyAPI.getList(limit);
historyAPI.getDetail(id);
historyAPI.delete(id);
```

**특징:**

- axios 기반
- TypeScript 타입 안정성
- 통일된 에러 처리

### types/ (타입 정의)

```typescript
OCRResult - OCR 결과
HistoryItem - 히스토리 항목
Region - 영역 좌표
APIResponse<T> - API 응답
```

## 의존성 흐름

```
app/page.tsx
  ↓
hooks/ → services/ → lib/
  ↓         ↓
types/    types/
```

**원칙:**

- 페이지는 훅과 컴포넌트만 사용
- 훅은 서비스와 라이브러리 사용
- 서비스는 라이브러리 사용
- 하위 모듈은 상위 모듈에 의존 ❌

## 개선 효과

### 1. 가독성 ⬆️

**Before:**

- page.tsx: 600줄 (모든 코드가 한 파일에)

**After:**

- page.tsx: 240줄 (페이지 로직만)
- hooks/: 2개 파일 (~100줄)
- components/: 4개 파일 (~300줄)
- lib/: 5개 파일 (~200줄)
- services/: 1개 파일 (~100줄)

### 2. 재사용성 ⬆️

- `useOCR` - region-ocr에서도 사용 가능
- `useTTS` - history에서도 사용 가능
- `components/` - 다른 페이지에서 재사용

### 3. 테스트 용이성 ⬆️

- 각 모듈 독립적 테스트
- Mock 객체 주입 쉬움
- 단위 테스트 작성 간편

### 4. 유지보수성 ⬆️

- 기능별로 파일이 분리됨
- TTS 수정 → `lib/tts.ts`만
- API 변경 → `services/api.ts`만

### 5. 타입 안정성 ⬆️

- 중앙 집중식 타입 정의
- IDE 자동완성 지원
- 컴파일 타임 오류 감지

## 사용 예시

### 커스텀 훅 사용

```tsx
function MyPage() {
  const { isProcessing, result, processImage } = useOCR();
  const { isSpeaking, speak } = useTTS();

  return (
    <button onClick={() => speak(result?.text)}>
      {isSpeaking ? "중지" : "읽기"}
    </button>
  );
}
```

### API 호출

```tsx
import { ocrAPI } from "@/services/api";

const result = await ocrAPI.processImage(file);
```

### 유틸리티 사용

```tsx
import { compressImage } from "@/lib/image";
import { copyToClipboard } from "@/lib/clipboard";

const compressed = await compressImage(file);
await copyToClipboard("텍스트");
```

## Path Alias

`@/` = 프로젝트 루트

```tsx
import Header from "@/components/Header";
import { useOCR } from "@/hooks/useOCR";
import { ocrAPI } from "@/services/api";
import { OCRResult } from "@/types";
```

## 추가 개선 사항 (Future)

1. **컴포넌트 스토리북** - UI 문서화
2. **유닛 테스트** - Jest + React Testing Library
3. **E2E 테스트** - Playwright
4. **성능 최적화** - React.memo, useMemo
5. **에러 바운더리** - 전역 에러 처리
6. **국제화** - i18n 지원
