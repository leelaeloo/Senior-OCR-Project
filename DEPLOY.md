# 배포 가이드

> VM만 연결하면 바로 운영 가능한 배포 가이드

---

## 목차

1. [사전 준비](#1-사전-준비)
2. [VM 초기 설정](#2-vm-초기-설정)
3. [SSL 인증서 발급](#3-ssl-인증서-발급)
4. [서비스 배포](#4-서비스-배포)
5. [운영 가이드](#5-운영-가이드)
6. [트러블슈팅](#6-트러블슈팅)

---

## 1. 사전 준비

### 1.1 필요 사항

| 항목 | 요구사항 |
|------|----------|
| VM | Ubuntu 22.04+ |
| RAM | 4GB 이상 (OCR 모델용) |
| 디스크 | 20GB 이상 |
| 도메인 | DNS 설정 완료 |

### 1.2 포트 설정

| 포트 | 용도 |
|------|------|
| 22 | SSH |
| 80 | HTTP (HTTPS 리다이렉트) |
| 443 | HTTPS |

---

## 2. VM 초기 설정

### 2.1 패키지 업데이트

```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 Docker 설치

```bash
# Docker 설치
curl -fsSL https://get.docker.com | sh

# 현재 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER

# 재로그인 (또는 newgrp docker)
exit
```

### 2.3 Docker Compose 설치

```bash
sudo apt install docker-compose-plugin -y

# 버전 확인
docker compose version
```

### 2.4 프로젝트 클론

```bash
cd ~
git clone https://github.com/your-username/Senior-OCR-Project.git
cd Senior-OCR-Project
```

---

## 3. SSL 인증서 발급

### 3.1 Certbot 설치

```bash
sudo apt install certbot -y
```

### 3.2 인증서 발급 (최초 1회)

```bash
# 서비스 중지 (80포트 사용)
docker compose down 2>/dev/null || true

# 인증서 발급 (your-domain.com을 실제 도메인으로 변경)
sudo certbot certonly --standalone -d your-domain.com

# 결과 확인
sudo ls -la /etc/letsencrypt/live/your-domain.com/
```

### 3.3 인증서 자동 갱신 설정

```bash
# cron job 추가
(crontab -l 2>/dev/null; echo "0 0 1 * * certbot renew --quiet && docker compose -f ~/Senior-OCR-Project/docker-compose.yml restart nginx") | crontab -

# 확인
crontab -l
```

---

## 4. 서비스 배포

### 4.1 Nginx 설정 복사

```bash
cd ~/Senior-OCR-Project

# 프로덕션 Nginx 설정 적용
cp nginx/conf.d/default.conf.production nginx/conf.d/default.conf
```

### 4.2 서비스 시작

```bash
# 빌드 및 실행
docker compose up -d --build

# 상태 확인
docker compose ps
```

### 4.3 헬스체크

```bash
# Backend 확인
curl -s http://localhost:8000/health

# Frontend 확인
curl -s http://localhost:3000

# HTTPS 확인
curl -s https://your-domain.com
```

---

## 5. 운영 가이드

### 5.1 로그 확인

```bash
# 전체 로그
docker compose logs -f

# 서비스별 로그
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx
```

### 5.2 서비스 재시작

```bash
# 전체 재시작
docker compose restart

# 서비스별 재시작
docker compose restart backend
```

### 5.3 서비스 중지/시작

```bash
# 중지
docker compose down

# 시작
docker compose up -d
```

### 5.4 업데이트 배포

```bash
cd ~/Senior-OCR-Project

# 코드 업데이트
git pull origin main

# 재빌드 및 재시작
docker compose up -d --build
```

### 5.5 백업

```bash
# 수동 백업
./scripts/backup.sh

# 백업 파일 위치
ls -la ~/backups/senior-ocr/
```

### 5.6 디스크 정리

```bash
# Docker 캐시 정리 (이미지 제외)
docker system prune -f

# 오래된 백업 삭제 (7일 이상)
find ~/backups/senior-ocr -name "*.db" -mtime +7 -delete
```

---

## 6. 트러블슈팅

### 6.1 502 Bad Gateway

**원인:** Backend 또는 Frontend 컨테이너가 시작되지 않음

```bash
# 컨테이너 상태 확인
docker compose ps

# 로그 확인
docker compose logs backend
docker compose logs frontend

# 재시작
docker compose restart
```

### 6.2 SSL 인증서 오류

**원인:** 인증서 만료 또는 경로 오류

```bash
# 인증서 상태 확인
sudo certbot certificates

# 갱신
sudo certbot renew

# Nginx 재시작
docker compose restart nginx
```

### 6.3 파일 업로드 실패

**원인:** 업로드 디렉토리 권한 문제

```bash
# 권한 확인
ls -la backend/uploads/

# 권한 수정
chmod 755 backend/uploads backend/results
```

### 6.4 메모리 부족

**원인:** OCR 모델이 메모리를 많이 사용

```bash
# 메모리 확인
free -h

# Docker 메모리 사용량
docker stats --no-stream

# 불필요한 컨테이너 정리
docker system prune -f
```

### 6.5 컨테이너 빌드 실패

**원인:** Docker 캐시 손상

```bash
# 캐시 정리
docker builder prune -f

# 재빌드
docker compose build --no-cache
docker compose up -d
```

---

## 빠른 배포 체크리스트

```bash
# 1. Docker 설치 확인
docker --version && docker compose version

# 2. 프로젝트 클론
git clone https://github.com/your-username/Senior-OCR-Project.git
cd Senior-OCR-Project

# 3. SSL 인증서 발급
sudo certbot certonly --standalone -d your-domain.com

# 4. Nginx 설정 복사
cp nginx/conf.d/default.conf.production nginx/conf.d/default.conf

# 5. 서비스 시작
docker compose up -d --build

# 6. 확인
curl -s https://your-domain.com
```

---

## 연락처

문제 발생 시: [GitHub Issues](https://github.com/your-username/Senior-OCR-Project/issues)
