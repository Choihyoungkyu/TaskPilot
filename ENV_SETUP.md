# 환경 설정 가이드

## 🔧 빠른 시작

### 1. .env 파일 설정

```bash
# .env.example을 기반으로 .env 파일 생성
cp .env.example .env
```

### 2. .env 파일 수정

`.env` 파일을 열고 다음 값들을 수정하세요:

```env
# Kakao OAuth (https://developers.kakao.com에서 획득)
KAKAO_CLIENT_ID=your_actual_client_id
KAKAO_CLIENT_SECRET=your_actual_client_secret

# JWT (본인 서버에 맞게 변경 권장)
JWT_SECRET=your-secure-256-bit-secret-key

# OpenAI (선택사항, 나중에 설정)
OPENAI_API_KEY=sk-your-key
```

### 3. Spring Boot 실행

```bash
cd backend

# Maven이 자동으로 .env 파일을 로드합니다
mvn spring-boot:run
```

### 4. 환경 변수 확인

Spring Boot 시작 시 로그에서 다음과 같이 확인할 수 있습니다:

```
kakao:
  client-id: your_actual_client_id
  redirect-uri: http://localhost:3000/auth/kakao/callback
```

---

## 📋 환경 변수 설명

| 변수 | 설명 | 기본값 | 필수 |
|------|------|--------|------|
| `KAKAO_CLIENT_ID` | Kakao OAuth 클라이언트 ID | - | ✅ |
| `KAKAO_CLIENT_SECRET` | Kakao OAuth 클라이언트 시크릿 | - | ✅ |
| `KAKAO_REDIRECT_URI` | Kakao OAuth 리다이렉트 URI | `http://localhost:3000/auth/kakao/callback` | ✅ |
| `JWT_SECRET` | JWT 서명 비밀키 (256비트 이상) | 기본값 | ❌ |
| `JWT_EXPIRATION` | JWT 만료 시간 (ms) | 86400000 (24h) | ❌ |
| `DB_HOST` | 데이터베이스 호스트 | `localhost` | ❌ |
| `DB_PORT` | 데이터베이스 포트 | `5432` | ❌ |
| `DB_NAME` | 데이터베이스 이름 | `taskpilot` | ❌ |
| `DB_USER` | 데이터베이스 사용자 | `admin` | ❌ |
| `DB_PASSWORD` | 데이터베이스 비밀번호 | `admin` | ❌ |
| `SERVER_PORT` | Spring Boot 포트 | `8080` | ❌ |
| `FRONTEND_PORT` | Next.js 포트 | `3000` | ❌ |
| `OPENAI_API_KEY` | OpenAI API 키 | - | ❌ (미구현) |
| `KAKAO_BOT_WEBHOOK_URL` | Kakao Bot Webhook | - | ❌ (미구현) |

---

## 🔐 보안 주의사항

### 프로덕션 환경

**절대로 `.env` 파일을 GitHub에 커밋하지 마세요!**

`.gitignore`에 이미 설정되어 있습니다:
```
.env
.env.local
.env.*.local
```

### 비밀키 관리

1. **개발 환경**: `.env` 파일 사용
2. **스테이징/프로덕션**: 환경 변수 또는 시크릿 관리 서비스 사용
   - AWS Secrets Manager
   - Azure Key Vault
   - HashiCorp Vault
   - GitHub Actions Secrets

---

## 🚀 환경별 설정

### 로컬 개발

```bash
# .env 파일에 임시 키 사용
cp .env.example .env
# .env 파일 수정하여 테스트 키 입력

mvn spring-boot:run
```

### Docker 컨테이너

```bash
docker run \
  -e KAKAO_CLIENT_ID=xxx \
  -e KAKAO_CLIENT_SECRET=yyy \
  -e DB_HOST=postgres \
  taskpilot-backend:latest
```

### GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
env:
  KAKAO_CLIENT_ID: ${{ secrets.KAKAO_CLIENT_ID }}
  KAKAO_CLIENT_SECRET: ${{ secrets.KAKAO_CLIENT_SECRET }}
```

---

## ✅ 검증 체크리스트

- [ ] `.env.example` 존재
- [ ] `.env` 파일 생성 (`.env.example`에서 복사)
- [ ] `.gitignore`에 `.env` 추가
- [ ] 모든 필수 변수 채움 (✅ 표시)
- [ ] Spring Boot 시작 시 올바른 값이 로드됨
- [ ] API 테스트 성공
  ```bash
  curl -X GET http://localhost:8080/api/users/me \
    -H "X-User-Id: 1"
  ```

---

## 🆘 문제 해결

### 1. "KAKAO_CLIENT_ID is not set" 에러

**원인**: `.env` 파일이 로드되지 않음

**해결책**:
```bash
# .env 파일 생성 확인
ls -la .env

# Spring Boot 종료 후 재시작
mvn clean spring-boot:run
```

### 2. 환경 변수가 적용되지 않음

**원인**: `.env` 파일이 잘못된 위치에 있음

**해결책**:
```bash
# 프로젝트 루트 확인
pwd
# /Users/.../TaskPilot 여야 함

# 위치 이동
cd /Users/.../TaskPilot

# .env 파일 생성
echo "KAKAO_CLIENT_ID=..." > .env
```

### 3. 기본값 대신 환경 변수 사용

application.yml에서 이미 기본값을 설정했으므로, `.env`에서 특정 값을 설정하면 기본값을 덮어씁니다:

```yaml
# application.yml
kakao:
  client-id: ${KAKAO_CLIENT_ID:default-value}
  #           ↑ .env에 KAKAO_CLIENT_ID가 있으면 사용
  #           ↑ 없으면 default-value 사용
```
