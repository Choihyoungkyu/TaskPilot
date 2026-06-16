# TaskPilot 프론트엔드 개발 핸드오프 문서

**Date:** 2026-06-16  
**Project:** TaskPilot - AI Agent 기반 우선순위 작업관리 웹앱  
**Next Focus:** Next.js 프론트엔드 개발 (Week 1)

---

## 🎯 프로젝트 개요

**TaskPilot**은 AI 기반의 우선순위 작업 관리 및 대시보드 형태의 웹앱이다.

### 핵심 기능
- 사용자 인증: Kakao OAuth 2.0 + JWT
- 작업 관리: CRUD, 우선순위 자동 계산
- 스마트 알림: Kakao Bot 알림 (구현 예정)
- 텍스트 분석: OpenAI GPT (구현 예정)

---

## ✅ 완료된 작업 (Week 1 - Backend)

### 1. 데이터베이스
- ✅ PostgreSQL 15 스키마 설계 (db-schema.sql)
  - users, user_preferences, tasks, alerts, task_extractions 테이블
  - 적절한 FK 관계와 인덱스 설정
- ✅ Docker Compose로 PostgreSQL 컨테이너 구성

### 2. Spring Boot 백엔드 (Java 17)
- ✅ 프로젝트 구조: src/main/java/com/taskpilot/{controllers,services,entities,repositories,dto,utils}
- ✅ JPA Entity 구현: User, UserPreference, Task, Alert, TaskExtraction
- ✅ REST API 엔드포인트 (모두 /api 프리픽스)
  
  **인증 관련:**
  - `POST /api/auth/kakao` - Kakao OAuth 로그인
  - `POST /api/auth/token?userId={id}` - 개발용 JWT 생성

  **사용자:**
  - `GET /api/users/me` - 현재 사용자 + 설정 조회
  - `POST /api/users/register` - 사용자 등록
  - `POST /api/users/{userId}/preferences` - 알림 설정 변경

  **작업:**
  - `POST /api/tasks` - 작업 생성 (우선순위 자동 계산)
  - `GET /api/tasks` - 작업 목록 (상태별, 우선순위 정렬)
  - `GET /api/tasks/{id}` - 단일 작업 조회
  - `PATCH /api/tasks/{id}` - 작업 수정
  - `DELETE /api/tasks/{id}` - 작업 삭제
  - `GET /api/tasks/weekly` - 주간 작업 조회

- ✅ 인증 지원: JWT (Authorization: Bearer) + X-User-Id 헤더 (하위호환)
- ✅ Kakao OAuth 구현 (자동 사용자 등록)
- ✅ 우선순위 계산 알고리즘
  - Formula: urgency (100 - days_until_deadline) + effort (hours/10 * 10) + complexity (HARD=3, MEDIUM=1.5, EASY=0)

### 3. 설정 & 보안
- ✅ .env 파일 + spring-dotenv로 환경변수 관리
- ✅ .gitignore: .env 파일 제외
- ✅ .env.example: 템플릿 (버전 관리용)
- ✅ application.yml: PostgreSQL, JWT, Kakao OAuth 설정

### 4. 테스트 & 문서
- ✅ Spring Boot 컴파일 & 실행 검증
- ✅ KAKAO_OAUTH_TEST.md: 상세 OAuth 테스트 가이드
- ✅ ENV_SETUP.md: 환경 설정 매뉴얼

---

## 🚀 백엔드 현재 상태

### 실행 방법
```bash
cd /Users/hyoungkyu/PJT/claude_code_pjt/TaskPilot/backend
mvn spring-boot:run
```

### 서비스 상태
- **Spring Boot:** 포트 8080 (http://localhost:8080/api)
- **PostgreSQL:** 포트 5432 (localhost, admin/admin)
- **Database:** taskpilot (스키마: taskpilot)

### 환경 설정 (production 전 변경 필수)
```
JWT_SECRET=your-super-secret-key-that-must-be-at-least-256-bits-long-for-hs256-algorithm-security-requirement
JWT_EXPIRATION=86400000 (24시간)
KAKAO_CLIENT_ID=[set in .env]
KAKAO_CLIENT_SECRET=[set in .env]
KAKAO_REDIRECT_URI=http://localhost:3000/auth/kakao/callback
```

### API 테스트
```bash
# 개발용 JWT 토큰 생성
curl -X POST "http://localhost:8080/api/auth/token?userId=1"

# JWT로 보호된 API 호출
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## 📋 다음 단계: 프론트엔드 (Week 1)

### 1. 프로젝트 초기화
```bash
cd /Users/hyoungkyu/PJT/claude_code_pjt/TaskPilot
npx create-next-app@latest front --typescript --tailwind
# or use existing /front directory if already set up
```

### 2. 핵심 구현 사항

#### 2.1 인증 페이지 & OAuth 흐름
- `pages/auth/login.tsx` - Kakao 로그인 버튼
- `pages/auth/kakao/callback.tsx` - OAuth 콜백 페이지
  - URL에서 code 파라미터 추출
  - POST /api/auth/kakao 호출
  - JWT 토큰 localStorage에 저장
  - 대시보드로 리다이렉트

#### 2.2 대시보드 페이지
- `pages/dashboard/index.tsx` - 메인 대시보드
  - 우선순위 정렬된 작업 목록
  - 작업 상태 필터 (TODO, IN_PROGRESS, COMPLETED)
  - 주간 작업 뷰

#### 2.3 작업 관리 컴포넌트
- `components/TaskList.tsx` - 작업 목록 표시
- `components/TaskCard.tsx` - 개별 작업 카드
- `components/TaskForm.tsx` - 작업 생성/수정 폼
- `components/PriorityBadge.tsx` - 우선순위 시각화

#### 2.4 데이터 페칭 (SWR)
```typescript
// lib/api.ts - API 호출 함수
// - getTasks()
// - createTask()
// - updateTask()
// - deleteTask()
// - getWeeklyTasks()
// - getCurrentUser()

// hooks/useAuth.ts - 인증 상태 관리
// hooks/useTasks.ts - 작업 데이터 관리 (SWR)
```

#### 2.5 설정 페이지
- `pages/settings/preferences.tsx`
  - 알림 설정 (리드타임: 1시간, 24시간 전)
  - 선호 난이도 설정
  - 타임존 설정 (기본: Asia/Seoul)

### 3. 기술 스택
- **Framework:** Next.js 16 (App Router 또는 Pages Router)
- **React:** 19.x
- **TypeScript:** 최신
- **Styling:** Tailwind CSS
- **Data Fetching:** SWR (캐싱, 폴링)
- **State Management:** React Context + hooks
- **HTTP Client:** fetch API (또는 axios)

### 4. 주요 고려사항
- JWT 토큰 만료 처리 (자동 갱신 또는 재로그인)
- API 요청 시 Authorization 헤더 자동 추가
- 에러 처리 (4xx, 5xx 응답)
- 로딩 상태 표시
- 반응형 디자인 (모바일 우선)

---

## 📁 프로젝트 구조

```
TaskPilot/
├── backend/                    # Spring Boot 백엔드 (완료)
│   ├── src/main/java/com/taskpilot/
│   │   ├── controllers/        # REST API
│   │   ├── services/           # 비즈니스 로직
│   │   ├── entities/           # JPA Entity
│   │   ├── repositories/       # Data Access
│   │   ├── dto/                # Request/Response
│   │   └── utils/              # 유틸리티
│   ├── pom.xml
│   └── application.yml
│
├── front/                      # Next.js 프론트엔드 (이번 주)
│   ├── pages/
│   │   ├── auth/              # 인증 페이지
│   │   ├── dashboard/         # 대시보드
│   │   └── settings/          # 설정
│   ├── components/            # React 컴포넌트
│   ├── lib/                   # 유틸리티 함수
│   ├── hooks/                 # 커스텀 훅
│   ├── styles/                # CSS/Tailwind
│   ├── package.json
│   └── tsconfig.json
│
├── db-schema.sql              # 데이터베이스 스키마
├── docker-compose.yml         # PostgreSQL 컨테이너
├── .env                       # 환경 설정 (로컬)
├── .env.example               # 환경 설정 템플릿
├── CLAUDE.md                  # 개발 가이드라인
├── ARCHITECTURE-DECISIONS.md  # 아키텍처 결정
└── KAKAO_OAUTH_TEST.md        # OAuth 테스트 가이드
```

---

## 🔑 필수 문서 참고

1. **CLAUDE.md** - 코딩 가이드라인 (절대 지키기!)
   - Think Before Coding
   - Simplicity First
   - Surgical Changes
   - Goal-Driven Execution

2. **ARCHITECTURE-DECISIONS.md** - 기술 선택 이유

3. **KAKAO_OAUTH_TEST.md** - OAuth 통합 방법

4. **ENV_SETUP.md** - 환경 설정 가이드

---

## 🔍 기존 API 문서

### 요청 예제

#### 1. Kakao OAuth 로그인
```bash
POST /api/auth/kakao
Content-Type: application/json

{
  "code": "XXXXXXXXXXXXXX"  # Kakao에서 받은 authorization code
}
```

**응답:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": 1,
    "email": "user@kakao.com",
    "name": "User Name"
  }
}
```

#### 2. 작업 생성
```bash
POST /api/tasks
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "프론트엔드 개발",
  "description": "Next.js로 대시보드 페이지 구현",
  "dueDate": "2026-06-23T17:00:00",
  "estimatedDurationMinutes": 480,
  "difficulty": "MEDIUM"
}
```

**응답:**
```json
{
  "id": 1,
  "userId": 1,
  "title": "프론트엔드 개발",
  "dueDate": "2026-06-23T17:00:00",
  "difficulty": "MEDIUM",
  "priorityScore": 145.5,
  "status": "TODO",
  "createdAt": "2026-06-16T10:00:00",
  "updatedAt": "2026-06-16T10:00:00"
}
```

#### 3. 작업 목록 조회
```bash
GET /api/tasks?status=TODO
Authorization: Bearer <JWT_TOKEN>
```

---

## ⚠️ 주의사항

1. **JWT 토큰:** 24시간 만료 - 갱신 로직 필요
2. **Kakao OAuth:** Redirect URI가 정확히 `http://localhost:3000/auth/kakao/callback`이어야 함
3. **API 호출:** 모든 요청에 Authorization 헤더 포함
4. **.env 파일:** 절대 GitHub에 커밋하지 말 것
5. **CLAUDE.md 준수:** 과도한 추상화 금지, 요청한 것만 구현

---

## 💡 권장 진행 순서

1. Next.js 프로젝트 초기화
2. OAuth 콜백 페이지 구현 (가장 중요)
3. 기본 레이아웃 + 네비게이션
4. 작업 목록 및 필터링
5. 작업 생성/수정/삭제 폼
6. 대시보드 우선순위 정렬 적용
7. 사용자 설정 페이지
8. 에러 처리 및 로딩 상태

---

## 📞 문제 해결

### Backend 실행 안 될 때
```bash
# 1. 포트 8080 확인
lsof -i :8080

# 2. 프로세스 종료
kill -9 <PID>

# 3. Maven 캐시 정리
cd backend && mvn clean

# 4. 재실행
mvn spring-boot:run
```

### PostgreSQL 연결 안 될 때
```bash
# Docker 컨테이너 확인
docker ps

# 컨테이너 시작
docker-compose up -d

# 데이터베이스 확인
psql -h localhost -U admin -d taskpilot
```

---

## 📝 제안되는 스킬

- **spec-writer**: 프론트엔드 상세 요구사항 정리
- **grill-me**: 구현 전 아키텍처 결정 검토
- **code-review**: 컴포넌트 품질 검토
- **deep-research**: 복잡한 SWR/React 패턴 조사
- **verify**: 구현된 기능 테스트 검증

---

**작성일:** 2026-06-16  
**담당자:** Claude Code  
**다음 진행:** Next.js 프론트엔드 개발 시작
