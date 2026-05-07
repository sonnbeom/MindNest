# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 제품 목적·세션 플로우·MVP 범위·버전 로드맵은 [Product.md](./Product.md) 참조.

---

## 서브 디렉토리 가이드

작업 위치에 따라 해당 CLAUDE.md를 함께 참조하세요.

| 디렉토리 | CLAUDE.md | 내용 |
|---------|-----------|------|
| `frontend/` | [frontend/CLAUDE.md](./frontend/CLAUDE.md) | React / Vite / Tailwind CSS, 컴포넌트 설계, 안티 패턴 |

---

## 세션 상태 머신

**6단계 고정 순서 — 이 순서를 기준으로 구현합니다.**

```
INTAKE → THOUGHT_SUMMARY → FACT_INTERPRETATION → COUNTER_EVIDENCE → CURRENT_ACTIONS → REFRAME
  1단계       2단계               3단계                 4단계               5단계          6단계
```

| 단계 | 이름 | 설명 | LLM 호출 |
|------|------|------|----------|
| 1 | INTAKE | 자유 서술 입력 | ❌ |
| 2 | THOUGHT_SUMMARY | 핵심 생각 2개 추출 및 표시 | ✅ 호출 1 (스트리밍) |
| 3 | FACT_INTERPRETATION | 사실 vs 해석 분리 표시 | ✅ 호출 1 결과 사용 |
| 4 | COUNTER_EVIDENCE | 반례 체크박스 선택 | ❌ (호출 1 결과 사용) |
| 5 | CURRENT_ACTIONS | 현재 행동 체크박스 선택 | ❌ (호출 1 결과 사용) |
| 6 | REFRAME | 재구성 문장 표시 및 수정 | ✅ 호출 2 (스트리밍) |

**전환 조건**
- 1→2: 텍스트 입력 완료 후 제출 버튼 클릭 (LLM 호출 1 시작)
- 2→3: 스트리밍 완료 후 사용자가 "다음" 클릭 (thought 선택 변경 가능)
- 3→4: 사용자가 "다음" 클릭
- 4→5: 사용자가 "다음" 클릭 (이 시점에 LLM 호출 2 백그라운드 시작)
- 5→6: 사용자가 "다음" 클릭 (호출 2 완료 여부 확인 후 진입)
- 6→끝: 저장 후 새 세션 시작 버튼

---

## LLM 호출 정책

LLM을 호출하는 시점과 호출하지 않는 시점을 명확히 구분합니다.

**호출하는 곳**

| 시점 | 용도 | 출력 형식 | 방식 |
|------|------|----------|------|
| INTAKE 제출 직후 | 생각 추출 + 사실/해석 분리 + 선택지 생성 | JSON | 스트리밍 |
| COUNTER_EVIDENCE "다음" 클릭 시 | 재구성 문장 생성 | 텍스트 | 스트리밍 (백그라운드) |

**호출하지 않는 곳**
- 체크박스 선택 및 상태 변경
- 선택지 렌더링 (호출 1 결과를 그대로 사용)
- 세션 저장 및 불러오기
- 면책 고지 렌더링

**호출 1 출력 형식 (JSON)**
```json
{
  "thoughts": ["핵심 생각 1", "핵심 생각 2"],
  "fact": "객관적으로 일어난 사실",
  "interpretation": "사실에 대한 주관적 해석",
  "counter_hints": ["반례 힌트 1", "반례 힌트 2", "반례 힌트 3"],
  "current_actions": ["현재 하고 있는 행동 1", "현재 하고 있는 행동 2"]
}
```

**호출 2 입력**
```
- 사실: {fact}
- 선택한 반례: {선택된 counter_hints}
- 현재 하고 있는 것: {선택된 current_actions}
```
> **프롬프트 파일 위치**: `mindnest-api/src/main/resources/prompts/intake_analysis.md`, `mindnest-api/src/main/resources/prompts/reframe_generation.md`
> LLM 호출 코드 작성 전 반드시 해당 프롬프트 파일을 읽고 SYSTEM / USER TEMPLATE을 그대로 사용할 것.
> 프롬프트 내용을 코드에 직접 하드코딩 금지 — 파일에서 읽어서 사용.
> 아카이브: `src/prompts/archive/distortion_analysis.md` (V2 인지 왜곡 재도입 시 참고)

---

## 핵심 데이터 구조

**세션 상태 객체 — 구조 임의 변경 금지.**

```json
{
  "sessionId": "string",
  "stage": "INTAKE | THOUGHT_SUMMARY | FACT_INTERPRETATION | COUNTER_EVIDENCE | CURRENT_ACTIONS | REFRAME",
  "userInput": "string",

  "llm1Result": {
    "thoughts": ["string", "string"],
    "fact": "string",
    "interpretation": "string",
    "counter_hints": ["string", "string", "string"],
    "current_actions": ["string", "string"]
  },

  "selectedThoughtIndex": 0,
  "selectedCounters": ["string"],
  "customCounter": "string",
  "selectedActions": ["string"],
  "customAction": "string",

  "reframedText": "string",

  "isStreaming": false,
  "llm2Promise": null,

  "createdAt": "ISO8601"
}
```

---

## 스트리밍 구현 원칙

- 호출 1은 JSON이 완성되는 시점에 파싱 후 단계별 순차 렌더링
- 호출 2는 COUNTER_EVIDENCE "다음" 클릭 시 백그라운드에서 선행 시작
- 텍스트 출력은 반드시 `StreamingText` 컴포넌트를 통해 글자 단위(40ms/글자) 타이핑 애니메이션 적용
- 스트리밍 중 로딩 스피너 사용 금지. 커서 깜빡임(cursor blink)으로 대체

---

## 절대 금지 사항

```
🚫 세션 단계 순서를 건너뛰거나 변경하는 코드
🚫 LLM을 호출해선 안 되는 시점에 LLM 호출
🚫 스트리밍 없이 LLM 응답을 한 번에 표시하는 코드
🚫 사용자가 직접 처음부터 입력하게 강제하는 UI (AI가 채우고 사용자는 수정만)
🚫 진단명, 처방, 약물 관련 텍스트를 UI에 표시
🚫 LLM 응답을 검증 없이 그대로 UI에 노출
🚫 세션 상태 객체 스키마 임의 변경
🚫 사용자 상담 내용을 외부 서버로 전송 (DB 연동 전까지)
```

---

## 면책 고지 (UI 필수 표시)

아래 문구는 SessionHeader에 반드시 표시되어야 합니다. 삭제하거나 숨기는 코드 작성 금지.

```
본 앱은 전문 심리 치료를 대체하지 않습니다.
심각한 심리적 어려움이 있다면 전문가 상담을 받으세요.
```

---

## AI 아키텍처 로드맵

현재는 Phase 1입니다. 향후 단계가 들어올 자리를 미리 고려해서 코드를 짜세요.

```
Phase 1  프롬프트 엔지니어링   현재 진행 중
Phase 2  RAG                  src/lib/rag.js 예정 — 벡터 DB 검색 후 LLM 주입
Phase 3  Fine-tuning          모델 파라미터 교체로 대응 예정
Phase 4  멀티 에이전트         src/lib/agents/ 디렉토리 예정
                               ├── analyzer.js
                               ├── counselor.js
                               ├── validator.js
                               └── summarizer.js
```

LLM 호출부는 반드시 `useLLMStream` 훅으로 모듈화하세요. 컴포넌트와 LLM 로직이 결합된 코드는 작성하지 마세요.

---

## 미결 사항

결정 전까지 해당 부분 코드 작성을 보류하거나 TODO로 표시하세요.

```
TODO: DB 솔루션 확정 (세션 영구 저장 — 현재 로컬스토리지)
TODO: 백엔드 프록시 구성 (API 키 서버사이드 이전 — 현재 클라이언트 노출)
TODO: RAG 벡터 DB 선택 (Pinecone vs Chroma)
TODO: 위기 감지 로직 설계 (특정 키워드 감지 시 전문기관 안내)
TODO: 개인정보 처리방침 및 데이터 동의 UI
TODO: 사용자 계정 및 인증
```
