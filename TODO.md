# MindNest TODO

> 세션 플로우: INTAKE → DISTORTION_ANALYSIS → REFRAME → CBT_DIALOGUE → CLOSE

---

## ✅ Done

### 인프라 / 공통
- [x] 프로젝트 초기 세팅 (CLAUDE.md, Product.md, 디렉토리 구조, CORS)
- [x] 세션 타입 정의 — `types/session.ts` (Stage, Distortion, Positive, ChatMessage, SessionContext, SessionAction)
- [x] 세션 상태 머신 — `useSessionState.ts` (useReducer + STAGE_ORDER 5단계 순서)
- [x] LLM 호출 모듈 분리 — `lib/llm.ts` (컴포넌트에서 직접 fetch 금지, Phase 2~4 교체 포인트)

### 홈 페이지
- [x] hero, features, how-it-works, disclaimer, brands-grid 섹션 UI

### 1단계 INTAKE
- [x] `IntakeStage.tsx` — SUD 슬라이더 (0~10) + 자유 서술 텍스트 입력
- [x] SessionHeader에 단계 표시

### 2단계 DISTORTION_ANALYSIS
- [x] `DistortionStage.tsx` — 분석 결과 카드 UI (왜곡명 뱃지, 인용 문장, 설명, 힌트 렌더링)
- [x] `hints.json` — 11개 인지 왜곡 유형별 힌트 데이터 (LLM 호출 없이 룩업)
- [x] 백엔드 `DistortionAnalysisController` — `POST /api/v1/analysis/distortion`
- [x] 백엔드 `DistortionAnalysisService` — Claude API 호출, JSON 파싱, 검증
- [x] 백엔드 도메인 — `DistortionType` enum, `CognitiveDistortion`, `PositiveValue`, `DistortionAnalysisResult`, `DistortionAnalysisResultValidator`
- [x] 백엔드 `SessionStage` enum + `SessionStageValidator`
- [x] 백엔드 테스트 3개 (`DistortionAnalysisResultValidatorTest`, `SessionStageValidatorTest`, `DistortionAnalysisServiceTest`)
- [x] 프롬프트 파일 — `distortion_analysis.md` (인지 왜곡 + 긍정 이면 동시 분석)
- [x] `llm.ts` — `analyzeDistortions()` 구현 (프론트 → 백엔드 연동 완료)

### 3단계 REFRAME
- [x] `ReframeStage.tsx` — 인지 왜곡별 긍정적 재구성 표 (예시 블록 + 입력창 + 제출 후 결과 뷰)
- [x] `reframeExamples.ts` — 왜곡 유형별 부정 사고 → 긍정 재구성 예시 데이터
- [x] `reframeQuestions.ts` — 왜곡 유형별 탐색 질문 데이터

### 5단계 CLOSE
- [x] `CloseStage.tsx` — intakeSUD vs closeSUD 비교, 발견한 인지 왜곡 목록, 내가 쓴 긍정 생각 요약, closeSUD 슬라이더

---

## 🔴 Todo

### [완료] CLAUDE.md CBT_DIALOGUE 스펙 수정
- [x] 4단계를 증거 조사(EvidenceStage)로 확정, CLAUDE.md 전면 수정
  - 세션 상태 머신 테이블 LLM 호출 ❌ 로 변경
  - 전환 조건 4→5: alternativeThought 1개 이상으로 변경
  - LLM 호출 정책에서 CBT 턴 항목 삭제, 증거 조사 비호출 항목 추가
  - contextObj 스키마: chatHistory/cbtTurn 제거, reframeEntries/evidenceEntries 추가, distortions에 reframeSuggestion 추가
  - 절대 금지 사항: "4단계 증거 조사에서 LLM 호출" 금지 추가

---

## 🔴 Todo

### STEP 1 — 미사용 코드 제거 ✅ 완료

- [x] `types/session.ts`: `ChatMessage`, `selectedPositives`, `chatHistory`, `cbtTurn`, `ADD_CHAT_MESSAGE`, `ADVANCE_CBT_TURN`, `SET_SELECTED_POSITIVES` 제거
- [x] `hooks/useSessionState.ts`: 위 항목 reducer 케이스 및 초기값 제거
- [x] `stages/CBTStage.tsx` 파일 삭제
- [x] `data/mockLLMResponses.ts` 파일 삭제
- [x] `DistortionStage.tsx` mock 주석 삭제
- [x] TypeScript 빌드 오류 없음 확인

### STEP 2 — LLM E2E 수동 검증
> 백엔드 `LLM_API_KEY=<실제키>` 설정 후 양쪽 서버 동시 실행

- [ ] 백엔드 실행 확인: `LLM_API_KEY` 환경변수 설정 → `./gradlew bootRun`
- [ ] 프론트 실행 확인: `npm run dev` (`.env.local`의 `NEXT_PUBLIC_API_URL=http://localhost:8080`)
- [ ] **전체 플로우 수동 테스트**: INTAKE → DISTORTION_ANALYSIS(LLM 호출) → REFRAME → CBT_DIALOGUE → CLOSE
- [ ] DISTORTION_ANALYSIS 단계에서 LLM 응답이 올바른 JSON 반환하는지 확인
- [ ] `feedback/distortion_analysis.jsonl`에 요청/응답 로그가 정상 기록되는지 확인
- [ ] 에러 케이스 확인: 짧은 텍스트, 특수문자, 왜곡이 명확하지 않은 입력

### STEP 3 — 프롬프트 품질 평가 및 개선
> STEP 2 에서 수집한 피드백 로그 기반

- [ ] `feedback/distortion_analysis.jsonl` 기록 분석 — 왜곡 유형 정확도, reframeSuggestion 품질 확인
- [ ] `distortion_analysis.md` 내 TODO: `positiveValues.json` 제약 도입 여부 결정 (LLM 자유 추출 vs 통제 목록)
- [ ] 프롬프트 개선 필요 시 `distortion_analysis.md` 수정 및 재테스트 (버전 업 기록)
- [ ] 모델 변경 검토: 현재 `claude-haiku-4-5-20251001` → 품질 불만족 시 sonnet으로 변경 (`application.yaml`)

### STEP 4 — 4단계 CBT_DIALOGUE (증거 조사) UX 완성
- [ ] `EvidenceStage.tsx` 전체 플로우 수동 검증: 각 왜곡별 3개 입력 필드 정상 동작 확인
- [ ] `canAdvance()` 조건 검증: `alternativeThought` 1개 이상 입력 시에만 다음 단계 버튼 활성화
- [ ] 필드 플레이스홀더 텍스트 UX 개선 (사용자가 쉽게 이해할 수 있도록)

### CLOSE 단계 보완
- [ ] CBT 대화 요약 추가: `CloseStage.tsx`에 `chatHistory`의 주요 AI 질문·사용자 답변 요약 섹션 추가
- [ ] 세션 완료 후 새 세션 시작 버튼 동작 확인 (`RESET` 액션 → INTAKE로 복귀)

### 코드 정리
- [ ] `DistortionStage.tsx` 상단 mock 관련 TODO 주석 삭제 (이미 실제 LLM 연동 완료)
- [ ] `CBTStage.tsx` 상단 mock 관련 TODO 주석 삭제 (실제 연동 후)
- [ ] `mockLLMResponses.ts` 실사용 여부 확인 후 미사용 시 삭제

---

## 🟡 보류 (결정 전 코드 작성 금지)

| 항목 | 보류 이유 |
|------|-----------|
| DB 솔루션 확정 | Supabase / PlanetScale / 자체 PostgreSQL 미결정. 세션 영구 저장, 사용자 계정 모두 블로킹 |
| RAG 벡터 DB | Pinecone vs Chroma 미결정. `frontend/lib/rag.js` 자리만 예약 |
| Fine-tuning 데이터 수집 | 수집 전략 미확정. Phase 3 전까지 `llm.ts`의 model 파라미터 교체로만 대응 |
| 위기 감지 로직 | 특정 키워드 감지 → 전문기관 안내 플로우 설계 미완 |
| 개인정보 처리방침 UI | 법률 검토 전 구현 보류 |
| API 키 서버사이드 이전 | 현재 `NEXT_PUBLIC_API_URL`만 노출. Claude API 키는 백엔드에 있어 직접 노출 없음. 구조 재검토 필요 |
| 멀티 에이전트 (Phase 4) | `frontend/lib/agents/` 디렉토리 예정 — analyzer, counselor, validator, summarizer |

---

## 메모

- **현재 브랜치**: `feature/2nd-track-ui-revise` — 커밋 후 머지
- **다음 브랜치 제안**: `feature/llm-verify` — STEP 1~4 전체
- **LLM 호출 정책 리마인더**: 힌트, 세션 요약 카드, SUD 저장에 LLM 호출 금지. 백엔드 호출은 반드시 `lib/llm.ts` 경유.
- **현재 모델**: `claude-haiku-4-5-20251001` (application.yaml), 온도 0.3, max_tokens 2000
- **피드백 로그 위치**: `mindnest-api/feedback/distortion_analysis.jsonl` (현재 16줄 누적)


#Trouble shooting
#TO-DO 
llm 응답속도 7s -> 개선 필요