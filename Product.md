# Product.md — 마음 상담소

> 프로젝트의 목적, 플로우, 기능 범위를 정의하는 문서입니다.
> 코드 작성 전 이 문서를 읽고 제품의 의도를 이해하세요.

---

## 1. 제품 정의

**무엇인가**
CBT(인지행동치료) 기반 셀프 심리 상담 웹 앱.
사용자가 생각을 입력하면 AI가 자동으로 정리·분리·재구성을 도와준다.
입력은 최소화하고, AI가 먼저 채워준 뒤 사용자는 고르거나 수정만 한다.

**무엇이 아닌가**
- 단순 AI 챗봇
- 전문 심리 치료 서비스
- 진단 또는 처방 도구

**핵심 설계 원칙**
- 사용자가 쓰는 양을 최소화한다. 체크하거나 수정만 한다.
- AI가 먼저 채워주고, 사용자는 고른다.
- 심리적으로 취약한 순간에도 완주할 수 있을 만큼 가볍게 설계한다.
- LLM은 2회만 호출한다. 나머지는 정적 UI로 처리한다.

---

## 2. 상담 플로우

**6단계 고정 순서**

```
1. INTAKE
   사용자가 현재 생각을 자유 서술로 입력
   → 제출 즉시 LLM 호출 1 시작 (스트리밍)

2. THOUGHT_SUMMARY — 생각 정리
   LLM이 핵심 생각 2개를 추출하여 타이핑되듯 표시
   → thoughts[0]: 자동 선택
   → thoughts[1]: 미선택 (사용자가 바꿀 수 있음)
   → 사용자는 선택 상태를 변경만 할 수 있음 (최소 1개 선택 유지)
   → 스트리밍 완료 후 "다음" 버튼으로 전환 (thought 선택 변경 가능)

3. FACT_INTERPRETATION — 사실 vs 해석 분리
   LLM이 사실과 해석을 분리하여 자동으로 채워줌
   → 사실(fact): teal 계열 카드로 표시
   → 해석(interpretation): purple 계열 카드로 표시
   → 사용자는 클릭하여 수정만 가능

4. COUNTER_EVIDENCE — 시야 넓히기
   LLM이 생성한 반례 힌트를 체크박스로 표시
   → 처음 2개 자동 체크
   → 사용자는 체크하거나 해제만 함
   → "직접 입력" 옵션 제공 (선택 사항)
   → "다음" 버튼 클릭 시 LLM 호출 2 백그라운드 시작

5. CURRENT_ACTIONS — 현재 행동 인식
   LLM이 생성한 현재 행동 선택지를 체크박스로 표시
   → 기본 체크 상태
   → "기타 입력" 옵션 제공 (선택 사항)
   → LLM 호출 2가 이미 백그라운드에서 진행 중

6. REFRAME — 재구성
   LLM이 생성한 재구성 문장을 타이핑되듯 표시
   → 스트리밍 완료 후 textarea로 전환 (수정 가능)
   → 새로 쓰게 하지 않음. 수정만 가능.
   → "저장하기" 버튼으로 세션 완료
```

---

## 3. LLM 호출 명세

### 호출 1 — INTAKE 제출 직후

**목적**: 핵심 생각 추출 + 사실/해석 분리 + 체크박스 선택지 생성을 한 번에

**모델**: `claude-haiku-4-5-20251001` (현재 운영 중)

**호출 경로**: React → Spring Boot(`/api/v1/analysis/intake`) → FastAPI RAG 서버(`/rag/analyze`) → Claude API  
RAG 서버에서 관련 인지 왜곡 지식 베이스 검색 후 프롬프트에 주입하여 호출

**출력 형식 (JSON)**:
```json
{
  "thoughts": ["핵심 생각 1", "핵심 생각 2"],
  "fact": "객관적으로 일어난 사실",
  "interpretation": "사실에 대한 주관적 해석",
  "counter_hints": ["반례 힌트 1", "반례 힌트 2", "반례 힌트 3"],
  "current_actions": ["현재 하고 있는 행동 1", "현재 하고 있는 행동 2"]
}
```

**처리 방식**:
- 스트리밍으로 수신
- JSON 완성 시점에 파싱 후 THOUGHT_SUMMARY부터 순차 렌더링
- thoughts 텍스트는 글자 단위로 타이핑 애니메이션 적용

---

### 호출 2 — COUNTER_EVIDENCE "다음" 버튼 클릭 시 백그라운드 시작

**목적**: 선택된 반례 + 현재 행동을 바탕으로 재구성 문장 생성

**모델**: `claude-haiku-4-5-20251001` (현재 운영 중)

**호출 경로**: Spring Boot(`/api/v1/reframe/generate`) → FastAPI RAG 서버(`/rag/reframe`) → Claude API  
재구성 문장 스타일 예시를 RAG로 검색하여 주입

**입력**:
```
- 사실: {fact}
- 선택한 반례: {선택된 counter_hints}
- 현재 하고 있는 것: {선택된 current_actions}
```

**처리 방식**:
- 스트리밍으로 수신
- REFRAME 단계 진입 시 글자 단위로 타이핑 애니메이션 적용
- 완성 후 textarea로 전환 (수정 가능 상태)

---

## 4. UI 컴포넌트 구조

```
TherapySession (공통 래퍼)
├── SessionHeader       # 단계 번호, 단계명, 진행률 바, 면책 고지
├── (단계별 컴포넌트)
│   ├── IntakeStage           # INTAKE: 자유 서술 textarea + 제출 버튼
│   ├── ThoughtSummaryStage   # THOUGHT_SUMMARY: 핵심 생각 체크박스 2개
│   ├── FactInterpretationStage # FACT_INTERPRETATION: 사실/해석 카드 (수정 가능)
│   ├── CounterEvidenceStage  # COUNTER_EVIDENCE: 반례 체크박스 리스트
│   ├── CurrentActionsStage   # CURRENT_ACTIONS: 현재 행동 체크박스 리스트
│   └── ReframeStage          # REFRAME: 재구성 문장 스트리밍 → textarea
└── SessionFooter       # 다음 단계 버튼, 진행 불가 안내 메시지
```

**공통 컴포넌트**
- `StreamingText` — 글자 단위 타이핑 애니메이션 (40ms/글자)
- `useLLMStream` — Anthropic SSE 스트리밍 훅 (호출 1, 2 공통)

**단계별 레이블 (SessionHeader 표시)**

| 단계 | 번호 | 레이블 |
|------|------|--------|
| INTAKE | 1 | 생각 입력 |
| THOUGHT_SUMMARY | 2 | 생각 정리 |
| FACT_INTERPRETATION | 3 | 사실과 해석 |
| COUNTER_EVIDENCE | 4 | 시야 넓히기 |
| CURRENT_ACTIONS | 5 | 지금 나는 |
| REFRAME | 6 | 다시 보기 |

---

## 5. 전역 상태 구조

```javascript
const initialState = {
  step: 'INTAKE',               // 현재 단계
  userInput: '',                // INTAKE 입력값

  llm1Result: {
    thoughts: [],               // 핵심 생각 최대 2개
    fact: '',                   // 사실
    interpretation: '',         // 해석
    counter_hints: [],          // 반례 힌트 선택지
    current_actions: [],        // 현재 행동 선택지
  },

  selectedThoughtIndex: 0,      // 선택된 생각 인덱스
  selectedCounters: [],         // 선택된 반례 (인덱스 배열 + 직접입력)
  selectedActions: [],          // 선택된 행동 (인덱스 배열 + 기타입력)

  reframedText: '',             // 재구성 문장 (편집 가능)
  isStreaming: false,           // 스트리밍 진행 중 여부
  llm2Promise: null,            // 호출 2 백그라운드 Promise 참조
};
```

---

## 6. 스트리밍 UX 원칙

- **글자가 흘러나오는 것 자체가 UX다.** 완성된 텍스트가 툭 나오는 것보다 타이핑되듯 나오는 게 "AI가 나를 읽고 있다"는 느낌을 준다.
- **기다림을 없앤다.** 호출 2는 사용자가 Step 4~5 체크박스를 고르는 동안(10~30초) 백그라운드에서 완료된다. REFRAME 진입 시 바로 스트리밍 시작.
- **로딩 스피너를 최소화한다.** 스트리밍 중엔 커서 깜빡임만으로 진행 중임을 표현한다.

---

## 7. 디렉토리 구조

```
src/
├── components/
│   ├── IntakeStage.jsx
│   ├── ThoughtSummaryStage.jsx
│   ├── FactInterpretationStage.jsx
│   ├── CounterEvidenceStage.jsx
│   ├── CurrentActionsStage.jsx
│   ├── ReframeStage.jsx
│   ├── SessionHeader.jsx
│   ├── SessionFooter.jsx
│   └── StreamingText.jsx
├── hooks/
│   ├── useLLMStream.js         # Anthropic SSE 스트리밍 훅
│   └── useTypingEffect.js      # 글자 단위 타이핑 애니메이션
├── prompts/
│   ├── prompt1.js              # 호출 1 시스템 프롬프트
│   └── prompt2.js              # 호출 2 시스템 프롬프트
├── App.jsx                     # 단계 라우팅 + 전역 상태
└── main.jsx
```

---

## 8. MVP 범위 (V1)

**포함**
- 6단계 상담 플로우
- LLM 호출 1: 생각 추출 + 사실/해석 분리 + 선택지 생성 (스트리밍)
- LLM 호출 2: 재구성 문장 생성 (스트리밍, 백그라운드 선행 호출)
- 글자 단위 타이핑 애니메이션
- 세션 완료 후 로컬스토리지 저장

**미포함 → V2**
- 상담 기록 히스토리 뷰
- 캘린더 기반 세션 타임라인

**미포함 → V3+**
- SUD(주관적 고통 지수) 측정 및 시계열 차트
- SUD 기반 추가 기능 (점수에 따른 분기 처리 등)

**미포함 → Post-MVP**
- 사용자 계정 및 서버 저장
- 인지 왜곡 유형 분류 및 학습
- 소크라테스식 LLM 대화
- 위기 감지 및 전문가 연결
- 행동 활성화, 노출 치료, 마음챙김 컴포넌트

---

## 9. 환경변수

LLM 호출은 Spring Boot 백엔드(`mindnest-api`)가 담당합니다. API 키는 서버사이드에서만 관리합니다.

```
# mindnest-api/.env
LLM_API_KEY=your_anthropic_api_key_here

# mindnest-rag/.env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

> ⚠️ API 키를 프론트엔드 코드나 클라이언트 번들에 포함하지 마세요.  
> Spring Boot는 `LLM_API_KEY`, FastAPI RAG 서버는 `ANTHROPIC_API_KEY` 환경변수명을 각각 사용합니다.

---

## 10. 면책 고지

앱 내 SessionHeader에 반드시 표시.

```
본 앱은 전문 심리 치료를 대체하지 않습니다.
심각한 심리적 어려움이 있다면 전문가 상담을 받으세요.
```
