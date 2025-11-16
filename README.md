# 읽어드림 - 시니어 친화 OCR PWA

> 어르신들을 위한 문서 읽어주기 앱

**🌐 데모:** [https://goodboy.kakaolab.cloud](https://goodboy.kakaolab.cloud)

---

## Preview

### PC 웹 메인 화면

<img src="./screenshots/main.png" width="500">

### PC 웹 가이드 화면

<img src="./screenshots/guide.png" width="500">

### PWA 앱 설치 화면

- 수정 중

> **모바일 홈 화면에 추가하여 네이티브 앱처럼 사용 가능합니다.**

## 기술 스택

| 구분              | 기술                                                                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend**      | Next.js 14.1, React 18.2, TypeScript, Tailwind CSS, Axios                                                                                                                      |
| **Backend**       | FastAPI 0.109, Python 3.11, SQLAlchemy, SQLite (aiosqlite)                                                                                                                     |
| **OCR**           | Tesseract OCR, pytesseract, OpenCV, Pillow                                                                                                                                     |
| **TTS**           | Web Speech API                                                                                                                                                                 |
| **PWA**           | manifest.json, Service Worker 지원                                                                                                                                             |
| **배포**          | Docker, Docker Compose, Nginx, Docker Hub                                                                                                                                      |
| **도메인**        | goodboy.kakaolab.cloud (HTTPS)                                                                                                                                                 |
| **Docker 이미지** | [leelaeloo/senior-ocr-frontend](https://hub.docker.com/r/leelaeloo/senior-ocr-frontend), [leelaeloo/senior-ocr-backend](https://hub.docker.com/r/leelaeloo/senior-ocr-backend) |

---
