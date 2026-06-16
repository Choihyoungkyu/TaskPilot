# Kakao OAuth 테스트 가이드

## ✅ 백엔드 준비 상태

- ✅ Spring Boot 실행 중 (포트 8080)
- ✅ Kakao OAuth 설정 로드 완료
- ✅ JWT 토큰 생성 가능
- ✅ `/api/auth/kakao` 엔드포인트 준비 완료

### 현재 설정값
```
KAKAO_CLIENT_ID: 652b7060b3d0a090bfc49391a0f13e10
KAKAO_CLIENT_SECRET: ZQe6py6OCJNTtP2wmBgVXTSiQcTMceSJ
KAKAO_REDIRECT_URI: http://localhost:3000/auth/kakao/callback
```

---

## 🔐 실제 Kakao OAuth 테스트

### 방법 1: 브라우저에서 수동 테스트 (권장)

#### Step 1: Kakao 인증 URL 생성

아래 URL을 웹 브라우저 주소창에 복사 & 붙여넣기:

```
https://kauth.kakao.com/oauth/authorize?client_id=652b7060b3d0a090bfc49391a0f13e10&redirect_uri=http://localhost:3000/auth/kakao/callback&response_type=code
```

#### Step 2: Kakao 로그인

1. Kakao 계정으로 로그인
   - 계정이 없으면 회원가입
2. "허용" 버튼 클릭하여 권한 동의

#### Step 3: Authorization Code 복사

로그인 후 브라우저 주소창:
```
http://localhost:3000/auth/kakao/callback?code=XXXXXXXXXXXXX&state=xxxxx
```

**`code=` 뒤의 값을 복사**

#### Step 4: 백엔드 API 호출

터미널에서 아래 명령 실행 (code 값 붙여넣기):

```bash
curl -X POST http://localhost:8080/api/auth/kakao \
  -H "Content-Type: application/json" \
  -d '{"code":"XXXXXXXXXXXXX"}'
```

#### Step 5: 응답 확인

성공 응답:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": 1,
    "email": "your-email@kakao.com",
    "name": "Your Name"
  }
}
```

---

### 방법 2: 자동화 테스트 스크립트

```bash
/tmp/kakao_oauth_test.sh
```

이 스크립트는 다음을 자동으로 처리합니다:
1. Kakao 인증 URL 생성
2. 사용자 입력으로 code 값 받기
3. 백엔드 API 호출
4. JWT 토큰 추출
5. 토큰으로 보호된 API 테스트

---

## 🧪 JWT 토큰으로 보호된 API 테스트

### 1. JWT 토큰 얻기 (개발용)

```bash
curl -X POST "http://localhost:8080/api/auth/token?userId=1"
```

응답:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "userId": 1,
  "email": "test@example.com"
}
```

### 2. JWT 토큰으로 API 호출

```bash
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

### 3. 태스크 API 테스트

```bash
# 태스크 목록 조회
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."

# 태스크 생성
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "OAuth Test Task",
    "dueDate": "2026-06-20T10:00:00",
    "difficulty": "MEDIUM"
  }'
```

---

## 🔄 OAuth 플로우 다이어그램

```
┌──────────────────────────────────────────────────────────────┐
│                      User (Browser)                          │
│                                                              │
│  1. Kakao 인증 URL 접속                                      │
│     ↓                                                        │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│                    Kakao Server                              │
│                                                              │
│  2. 로그인 & 권한 동의                                       │
│     ↓                                                        │
│  3. Authorization Code 반환                                  │
│     (Redirect: http://localhost:3000/...?code=XXXXX)        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│                  Backend (Spring Boot)                       │
│                                                              │
│  4. POST /api/auth/kakao                                     │
│     - Authorization Code 수신                                │
│     ↓                                                        │
│  5. Kakao에 토큰 요청                                        │
│     (client_id, client_secret, code)                        │
│     ↓                                                        │
│  6. 사용자 정보 조회                                         │
│     (Access Token으로)                                       │
│     ↓                                                        │
│  7. DB에 사용자 저장/조회                                    │
│     ↓                                                        │
│  8. JWT 토큰 생성                                            │
│     ↓                                                        │
│  9. 클라이언트에 JWT 반환                                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│              Frontend (Next.js) / Client                     │
│                                                              │
│  10. JWT 토큰 저장 (localStorage)                            │
│      ↓                                                       │
│  11. 이후 모든 요청에 JWT 포함                               │
│      Authorization: Bearer <JWT>                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚨 트러블슈팅

### Q1: "KAKAO_CLIENT_ID is not set" 에러

**원인**: .env 파일이 로드되지 않음

**해결책**:
```bash
# 1. .env 파일 확인
ls -la .env

# 2. Spring Boot 종료
pkill -f "java -jar"

# 3. Spring Boot 재시작
cd backend
mvn spring-boot:run
```

### Q2: Kakao 로그인 후 "code=..." 값이 없음

**원인**: Redirect URI가 등록되지 않았음

**해결책**:
1. [Kakao Developers](https://developers.kakao.com) 접속
2. 앱 설정 > 사용자 관리 > Redirect URI
3. `http://localhost:3000/auth/kakao/callback` 등록

### Q3: `/api/auth/kakao` 응답이 500 에러

**원인**: 
- Kakao API 호출 실패
- 잘못된 authorization code

**해결책**:
```bash
# 1. Spring Boot 로그 확인
tail -50 /tmp/spring.log

# 2. Kakao 자격증명 재확인
cat .env | grep KAKAO

# 3. 새로운 authorization code 받기
```

---

## 📝 테스트 체크리스트

- [ ] Spring Boot 실행 중 (`ps aux | grep java`)
- [ ] JWT 토큰 생성 가능 (`curl /api/auth/token?userId=1`)
- [ ] Kakao 인증 URL 접속 가능
- [ ] Kakao 로그인 완료 & code 값 획득
- [ ] POST /api/auth/kakao 성공
- [ ] JWT 토큰 응답 확인
- [ ] 토큰으로 보호된 API 호출 가능
- [ ] 새 사용자 자동 생성 확인 (DB)

---

## 📚 참고 문서

- [Kakao OAuth Documentation](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)
- [JWT 구현 가이드](../JWT_IMPLEMENTATION.md)
- [환경 설정 가이드](./ENV_SETUP.md)
