# TaskPilot 아키텍처 의사결정 문서

**작성일:** 2026-06-16  
**상태:** 확정  
**기간:** 30일 (1명)

---

## 📋 의사결정 요약

| # | 주제 | 선택 | 근거 |
|----|------|------|------|
| Q1 | AI 우선순위 | C) 하이브리드 (규칙 + 학습) | 30일 안에 구현 가능하면서도 개인화 달성 |
| Q2 | 난이도 결정 | C) 하이브리드 (AI 추론 + 사용자 수정) | 자동화 편의 + 사용자 제어 권한 |
| Q3 | 텍스트 분석 | A) OpenAI GPT API | 정확한 추출이 생명, 비용은 월 $5-10 수준 |
| Q4 | 온보딩 | C) 프로그레시브 (최소 3개 + 지속 학습) | UX 좋음, 데이터 자동 수집 |
| Q5 | 카카오톡 알림 | C) Webhook + 봇 | 30일 심사 불필요, 무료, 빠른 구현 |
| Q6 | 우선순위 점수 | B) 마감일 + 소요시간 | 구현 간단하면서도 현실적 |
| Q7 | 학습 메커니즘 | B) 완료/스킵 패턴 | 실제 개인화 효과 눈에 띔 |
| Q8 | 대시보드 UI | B) 주간 뷰만 | 현실적인 범위 (30일 타이트) |
| Q9 | 온보딩 질문 | C) 하이브리드 (업무타입 + 선호도) | 구현 간단하면서도 개인화 좋음 |
| Q10 | 실시간 업데이트 | B) 주기적 폴링 (5-10초) | WebSocket 복잡도 회피, 체감 좋음 |
| Q11 | 학습 업데이트 | B) 일일 배치 (매일 자정) | 안정적, 구현 간단, 반응성 좋음 |
| Q12 | 인증 방식 | B) OAuth (카카오톡 로그인) | 사용자 경험 최고, 알림과 통일 |
| Q13 | 프론트엔드 상태관리 | B) SWR | 캐싱, 자동 폴링, Next.js 완벽 지원 |

---

## 🔧 아키텍처 개요

### Frontend (Next.js 16 + React 19 + TypeScript)
```
페이지 구조:
- /login          → 카카오 OAuth
- /onboarding     → 초기 3개 질문 (업무타입, 선호도, 난이도)
- /dashboard      → 메인 화면 (오늘의 To-do + 주간 뷰 + 통계)
- /settings       → 사용자 설정 (선호도 조정)

상태 관리:
- SWR로 /api/tasks 5-10초마다 자동 폴링
- 캐싱으로 불필요한 API 호출 제거

UI 라이브러리:
- Tailwind CSS 또는 CSS Modules (반응형)
```

### Backend (Spring Boot 3.x + PostgreSQL)
```
API 엔드포인트:
POST   /api/auth/login              → 카카오 OAuth 로그인
GET    /api/users/me                → 현재 사용자 정보
POST   /api/tasks                   → 일정 생성
GET    /api/tasks                   → 우선순위 기반 To-do 리스트
PATCH  /api/tasks/{id}              → 일정 수정 (난이도, 상태)
DELETE /api/tasks/{id}              → 일정 삭제
GET    /api/tasks/weekly            → 주간 일정
POST   /api/onboarding              → 온보딩 데이터 저장

핵심 로직:
1. 텍스트 분석: OpenAI GPT API로 제목, 마감일, 소요시간, 난이도 추출
2. 우선순위 점수:
   score = (100 - days_until_deadline) 
         + (estimated_hours / 10) 
         + (difficulty_level * 3)
         + user_weight_adjustment (학습 가중치)
3. 일일 배치 (자정):
   - 어제 완료/스킵 데이터 분석
   - 사용자 선호도 가중치 조정
   - 다음날부터 적용

카카오톡 알림:
- 난이도별 마감 N일 전에 Webhook으로 봇에 메시지 전송
- 쉬움: 1일 전
- 중간: 2일 전
- 어려움: 3-4일 전
```

### Database (PostgreSQL)
```
주요 테이블:
- users              (사용자)
- user_preferences   (온보딩 3개 질문 + 학습 가중치)
- tasks              (일정, 우선순위 점수)
- alerts             (카카오톡 알림 로그)
- task_extractions   (텍스트 분석 결과)
```

### 외부 서비스
```
1. OpenAI GPT API
   - 텍스트 분석: gpt-4o-mini
   - 비용: 월 $5-10

2. 카카오 OAuth
   - 로그인 서비스
   - 비용: 무료

3. 카카오 봇 (Webhook)
   - 알림 전송
   - 비용: 무료
```

---

## 📅 개발 일정 (30일)

### Week 1 (Day 1-7)
```
Backend:
- [ ] Spring Boot 프로젝트 생성
- [ ] Entity 클래스 (User, UserPreference, Task, Alert)
- [ ] Repository 구현
- [ ] 기본 CRUD API (POST /tasks, GET /tasks, PATCH /tasks/{id})
- [ ] JWT 인증 (카카오 OAuth 통합)

Frontend:
- [ ] Next.js 프로젝트 셋업
- [ ] 라우팅 구조 생성
- [ ] SWR 설치 및 기본 설정

Database:
- [ ] PostgreSQL Docker 실행
- [ ] db-schema.sql 실행
```

### Week 1-2 (Day 8-10)
```
Frontend:
- [ ] 카카오 로그인 UI (버튼)
- [ ] 기본 대시보드 레이아웃 (오늘의 To-do + 주간 뷰)
- [ ] To-do 리스트 컴포넌트

Backend:
- [ ] 카카오 OAuth 통합 완료
- [ ] API 인증 미들웨어
```

### Week 2 (Day 11-14)
```
Backend:
- [ ] OpenAI API 통합 (텍스트 분석)
- [ ] 우선순위 점수 계산 로직
- [ ] POST /api/extract-task 엔드포인트

Frontend:
- [ ] 텍스트 입력창 UI
- [ ] SWR로 /api/tasks 폴링 (5초 간격)
- [ ] To-do 리스트 실시간 업데이트
```

### Week 2-3 (Day 15-17)
```
Backend:
- [ ] 온보딩 3개 질문 엔드포인트
- [ ] 점수 알고리즘에 사용자 가중치 반영
- [ ] 테스트 (CRUD API)

Frontend:
- [ ] 온보딩 페이지 (3개 선택지)
- [ ] 대시보드에 통계 추가 (완료율, 평균 시간)
```

### Week 3 (Day 18-21)
```
Backend:
- [ ] 카카오 봇 Webhook 구현
- [ ] 알림 스케줄 로직 (난이도별 타이밍)
- [ ] Spring Scheduler로 일일 배치 구현
- [ ] 학습 가중치 업데이트 로직

Frontend:
- [ ] 난이도 선택 UI (각 Task마다)
- [ ] 설정 페이지 (선호도 수정)
```

### Week 3-4 (Day 22-24)
```
Frontend:
- [ ] 반응형 CSS 최적화 (모바일 320px+)
- [ ] 주간 뷰 UI (7일 타임라인)
- [ ] 온보딩 플로우 정리

Backend:
- [ ] 학습 가중치 계산 검증
- [ ] 카카오 알림 테스트
```

### Week 4 (Day 25-30)
```
전체:
- [ ] E2E 테스트 (텍스트 입력 → 우선순위 정렬 → 알림)
- [ ] 버그 수정
- [ ] 성능 최적화 (API 응답 시간)
- [ ] 배포 준비 (Vercel for Frontend, AWS/GCP for Backend)
- [ ] 문서 작성
- [ ] 최종 데모 준비
```

---

## 🚨 주의사항

### 리스크 및 완화 방안

1. **Spring Boot 첫 경험**
   - 리스크: 서버 구축 곡선 가파름
   - 완화: Spring Boot 튜토리얼 선행, 복잡한 기능은 v2.0으로 미룰 것

2. **OpenAI API 비용**
   - 리스크: 예상 이상으로 비용 발생
   - 완화: 개발 중 테스트 횟수 제한, 프로덕션은 rate limiting 설정

3. **카카오 봇 Webhook 신뢰성**
   - 리스크: 봇이 메시지를 못 받을 수 있음
   - 완화: 알림 로그 저장, 실패 시 재시도 로직

4. **30일 타이트한 일정**
   - 리스크: 기능 부족, 버그로 끝날 수 있음
   - 완화: MVP는 작게 (주간 뷰만), 우선순위 명확히 (텍스트 입력 > 우선순위 정렬 > 알림)

---

## 🎯 성공 기준 (데모 체크리스트)

- [ ] 텍스트 입력 → 자동 일정 등록 및 DB 저장
- [ ] AI가 우선순위 점수 계산 → To-do 리스트에 정렬되어 표시
- [ ] 우선순위가 실제 마감일/소요시간 기반으로 변경 확인
- [ ] 카카오톡으로 최소 1회 이상 알림 수신 확인
- [ ] 모바일에서 대시보드 반응형 UI 확인 (터치 가능)
- [ ] 온보딩 후 사용자 선호도가 우선순위에 영향 주는 것 확인 (정성적)

---

## 📚 v2.0 로드맵

- 반복 일정 지원
- 팀 공유 기능
- Slack/Gmail 채널 통합
- 고급 통계 및 시간 추적
- WebSocket 실시간 알림 (폴링 → WebSocket 업그레이드)
- 네이티브 모바일 앱

---

## 🔗 참고 자료

- **Spring Boot JWT 인증:** https://spring.io/blog/2015/02/03/spring-security-testing-part-iii-csrf-protection/
- **Next.js SWR:** https://swr.vercel.app/
- **OpenAI API:** https://platform.openai.com/docs/api-reference
- **카카오 OAuth:** https://developers.kakao.com/docs/latest/ko/kakaologin/common
- **카카오톡 메시지 API:** https://developers.kakao.com/docs/latest/ko/message/rest-api
