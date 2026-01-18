#!/bin/bash
# ===========================================
# Senior-OCR-Project 백업 스크립트
# ===========================================
# 사용법: ./scripts/backup.sh
# Cron 예시: 0 3 * * * /home/ubuntu/Senior-OCR-Project/scripts/backup.sh

set -e

# 설정
PROJECT_DIR="${PROJECT_DIR:-$(dirname $(dirname $(realpath $0)))}"
BACKUP_DIR="${BACKUP_DIR:-$HOME/backups/senior-ocr}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# 색상 출력
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 백업 디렉토리 생성
mkdir -p "$BACKUP_DIR"

log_info "백업 시작: $TIMESTAMP"
log_info "프로젝트: $PROJECT_DIR"
log_info "백업 위치: $BACKUP_DIR"

# 1. SQLite DB 백업
DB_FILE="$PROJECT_DIR/backend/ocr_history.db"
if [ -f "$DB_FILE" ]; then
    cp "$DB_FILE" "$BACKUP_DIR/ocr_history_$TIMESTAMP.db"
    log_info "DB 백업 완료: ocr_history_$TIMESTAMP.db"
else
    log_warn "DB 파일 없음: $DB_FILE"
fi

# 2. 업로드 파일 백업 (선택적)
UPLOADS_DIR="$PROJECT_DIR/backend/uploads"
if [ -d "$UPLOADS_DIR" ] && [ "$(ls -A $UPLOADS_DIR 2>/dev/null)" ]; then
    tar -czf "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" -C "$PROJECT_DIR/backend" uploads
    log_info "업로드 파일 백업 완료: uploads_$TIMESTAMP.tar.gz"
else
    log_warn "업로드 디렉토리 비어있음"
fi

# 3. 결과 파일 백업 (선택적)
RESULTS_DIR="$PROJECT_DIR/backend/results"
if [ -d "$RESULTS_DIR" ] && [ "$(ls -A $RESULTS_DIR 2>/dev/null)" ]; then
    tar -czf "$BACKUP_DIR/results_$TIMESTAMP.tar.gz" -C "$PROJECT_DIR/backend" results
    log_info "결과 파일 백업 완료: results_$TIMESTAMP.tar.gz"
else
    log_warn "결과 디렉토리 비어있음"
fi

# 4. 오래된 백업 삭제
log_info "오래된 백업 정리 중 (${RETENTION_DAYS}일 이상)..."
find "$BACKUP_DIR" -name "*.db" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true

# 5. 백업 목록 출력
log_info "현재 백업 목록:"
ls -lh "$BACKUP_DIR" | tail -10

# 6. 디스크 사용량
BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
log_info "백업 디렉토리 크기: $BACKUP_SIZE"

log_info "백업 완료!"
