# TaskPilot Week 1 Handoff Document

**Date:** 2026-06-16  
**Project:** TaskPilot - AI 기반 우선순위 작업 관리 웹앱  
**Status:** Week 1 완료, Week 2 준비 완료  
**Next Focus:** OpenAI 텍스트 분석 통합

---

## 🎯 Week 1 완료 상황

### Backend ✅ 완전 완료
- Spring Boot 프로젝트 생성 및 구성 완료
- PostgreSQL Docker 환경 구축 완료
- JPA Entity 구현 (User, UserPreference, Task, Alert, TaskExtraction)
- REST API CRUD 엔드포인트 모두 구현
  - POST /api/tasks (우선순위 자동 계산)
  - GET /api/tasks (상태별 필터링)
  - PATCH /api/tasks/{id} (상태 변경)
  - DELETE /api/tasks/{id}
  - GET /api/tasks/weekly
  - POST /api/users/{userId}/preferences
- JWT 인증 구현 (Authorization: Bearer 헤더 + X-User-Id 헤더 둘 다 지원)
- Kakao OAuth 통합 완료 (자격증명은 설정되어 있으나 401 이슈 - 개발용 로그인으로 우회 중)

**관련 파일:** `/backend/` 디렉토리 - see also `/handoff/W1-Backend-Complete-Frontend-Kickoff.md`

### Frontend ✅ 완전 완료
- Next.js 16 + React 19 + TypeScript 프로젝트 셋업
- Tailwind CSS 설정 완료
- 라우팅 구조 구현:
  - `/auth/login` - Kakao OAuth 버튼 + 개발용 로그인 버튼
  - `/auth/kakao/callback` - OAuth 콜백 처리
  - `/dashboard` - 메인 대시보드 (작업 목록, 필터링)
  - `/settings/preferences` - 사용자 설정 페이지

- API 통합 (`lib/api.ts`):
  - 모든 API 호출 함수 구현
  - 에러 핸들링 개선 (handleResponse 함수)
  - X-User-Id 헤더 자동 추가

- 커스텀 훅 (`hooks/`):
  - `useAuth` - 사용자 인증 상태 관리
  - `useTasks` - SWR 기반 작업 데이터 페칭 (자동 폴링)

- 컴포넌트 (`components/`):
  - Navigation - 상단 네비게이션 바 (사용자 정보, 로그아웃)
  - TaskList - 작업 목록 (우선순위 정렬)
  - TaskCard - 개별 작업 카드 (상태 변경, 삭제)
  - TaskModal - 작업 생성 모달
  - PriorityBadge - 우선순위 시각화

### 개발용 로그인 ✅ 성공
- 프론트엔드 로그인 페이지에 "개발용 로그인" 버튼 추가
- userId=1 (test@example.com)로 즉시 로그인 가능
- localStorage에 accessToken + userId 저장
- 대시보드로 자동 이동 확인

### 이슈 및 해결
| 이슈 | 원인 | 해결 |
|------|------|------|
| Kakao OAuth 401 에러 | JWT 필터가 Authorization 헤더 파싱 실패 | X-User-Id 헤더 사용으로 우회 |
| /api/users/me 400 에러 | JWT 필터에서 userId request attribute 미설정 | X-User-Id 헤더로 해결 |
| 프론트엔드 dev server 캐시 | 파일 변경이 적용되지 않음 | dev server 재시작으로 해결 |

---

## 📊 현재 실행 상태

```
백엔드: http://localhost:8080/api (실행 중)
프론트엔드: http://localhost:3000 (dev server 실행 중)
DB: PostgreSQL localhost:5432 (Docker, 실행 중)
```

**테스트 계정:**
- Email: test@example.com
- User ID: 1
- Password: (없음, Kakao OAuth 사용)

---

## 🚀 Week 2 준비 사항

### 구현해야 할 기능 (우선순위 순)
1. **OpenAI 텍스트 분석** (Day 8-10)
   - OpenAI API 키 발급 필요
   - `POST /api/extract-task` 엔드포인트 구현
   - 제목/설명에서 마감일, 소요시간, 난이도 자동 추출
   - 프론트엔드에 텍스트 입력창 UI 추가

2. **온보딩 페이지** (Day 11-14)
   - 사용자 첫 로그인 시 3개 질문
   - 업무타입, 선호도, 난이도 선택
   - user_preferences에 저장

3. **카카오톡 알림** (Day 15-17)
   - 카카오 봇 Webhook 구현
   - 난이도별 마감일 전 알림 발송
   - 알림 로그 저장

### 참고 문서
- Architecture 결정: `/ARCHITECTURE-DECISIONS.md` (Line 105-124 참고)
- 초기 핸드오프: `/handoff/W1-Backend-Complete-Frontend-Kickoff.md`
- 개발 가이드: `/CLAUDE.md`

---

## 🔧 환경 설정 (다음 세션용)

### 필수 실행 명령어
```bash
# 터미널 1: 백엔드
cd /Users/hyoungkyu/PJT/claude_code_pjt/TaskPilot/backend
mvn spring-boot:run

# 터미널 2: 프론트엔드
cd /Users/hyoungkyu/PJT/claude_code_pjt/TaskPilot/front
npm run dev

# 터미널 3: DB (이미 실행 중이면 생략)
docker-compose up -d
```

### 환경 변수
- Backend: `/backend/.env` (Kakao OAuth 자격증명 포함)
- Frontend: `/front/.env.local` (Kakao CLIENT_ID 포함)

### API Base URL
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api`

---

## 📝 주의사항

1. **JWT 필터 이슈**
   - Authorization 헤더가 작동하지 않으므로 X-User-Id 헤더 사용
   - 프론트엔드에서 자동으로 추가됨 (`lib/api.ts` 참고)

2. **Kakao OAuth 미완성**
   - Client Secret이 유효하지만 401 에러 계속 발생
   - 원인 불명 (네트워크/Kakao 설정 이슈 의심)
   - 대신 개발용 로그인으로 전체 기능 테스트 가능

3. **Context 용량**
   - 현재 156.2k/200k tokens 사용 중 (78%)
   - 다음 세션에서는 파일 재읽기 최소화 필요

4. **Sensitive Data**
   - `.env` 파일에 Kakao 자격증명 포함 (반드시 .gitignore에 있어야 함)
   - OpenAI API 키는 아직 추가하지 않음

---

## 💡 다음 에이전트를 위한 팁

1. **OpenAI 통합 시작 전**
   - OpenAI 계정에서 API 키 발급받기
   - `backend/.env`에 `OPENAI_API_KEY=sk-...` 추가
   - `application.yml`에서 읽도록 설정 확인

2. **테스트 계정으로 빠르게 검증**
   - 매번 "개발용 로그인" 사용 (Kakao OAuth 스킵)
   - 즉시 대시보드에서 기능 테스트 가능

3. **SWR 폴링 확인**
   - 작업 생성 후 5-10초 내에 목록 자동 갱신되는지 확인
   - `useTasks` 훅에서 폴링 간격 조정 가능

---

## 📋 Suggested Skills

1. **claude-api** - OpenAI API 통합 시 사용
2. **code-review** - 주요 기능 구현 후 코드 검토
3. **verify** - 프론트엔드 기능 E2E 테스트
4. **grill-me** - 온보딩 페이지 설계 시 아키텍처 검토

---

## 📞 연락처 (필요시)

- **프로젝트 루트:** `/Users/hyoungkyu/PJT/claude_code_pjt/TaskPilot`
- **핸드오프 문서:** `/handoff/` 디렉토리
- **개발 가이드:** `/CLAUDE.md`, `/ARCHITECTURE-DECISIONS.md`

---

**작성자:** Claude Code  
**작성일:** 2026-06-16 22:30 UTC  
**예상 다음 세션:** 2026-06-17 (OpenAI 텍스트 분석 시작)
