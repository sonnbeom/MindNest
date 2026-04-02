# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 제품 목적·세션 플로우·MVP 범위·도메인 지식은 [Product.md](./Product.md) 참조.

---

## 서브 디렉토리 가이드

작업 위치에 따라 해당 CLAUDE.md를 함께 참조하세요.

| 디렉토리 | CLAUDE.md | 내용 |
|---------|-----------|------|
| `frontend/` | [frontend/CLAUDE.md](./frontend/CLAUDE.md) | Next.js 16 / React 19 / Tailwind CSS 4, 컴포넌트 설계, 안티 패턴 |
| `mindnest-api/` | [mindnest-api/CLAUDE.md](./mindnest-api/CLAUDE.md) | Spring Boot 4 / Java 17, TDD, OOP 원칙, 패키지 구조 |

---

## 세션 상태 머신

**5단계 고정 순서 — 프론트엔드·백엔드 모두 이 순서를 기준으로 구현합니다.**

```
INTAKE → DISTORTION_ANALYSIS → REFRAME → CBT_DIALOGUE → CLOSE
  1단계        2단계               3단계       4단계         5단계
```

| 단계 | 이름 | 설명 | LLM 호출 |
|------|------|------|----------|
| 1 | INTAKE | SUD 슬라이더 + 자유 서술 입력 | ❌ |
| 2 | DISTORTION_ANALYSIS | 인지 왜곡 분석 | ✅ 1회 |
| 3 | REFRAME | 감정 이면 탐색, 긍정 가치 선택 | ❌ |
| 4 | CBT_DIALOGUE | 소크라테스식 5턴 대화 | ✅ 턴당 1회 |
| 5 | CLOSE | 세션 후 SUD 기록 + 요약 | ❌ |

**전환 조건**
- 1→2: 텍스트 입력 완료 후 사용자가 "분석 시작" 버튼 클릭
- 2→3: 사용자가 분석 확인 후 진행 선택
- 3→4: 사용자가 긍정 가치 선택 또는 직접 입력 완료
- 4→5: CBT 5턴 완료 또는 사용자가 수동 종료
- 5→끝: 새 세션 시작 버튼

---

## LLM 호출 정책

LLM을 호출하는 시점과 호출하지 않는 시점을 명확히 구분합니다.

**호출하는 곳**

| 시점 | 용도 | 출력 형식 |
|------|------|----------|
| 단계 2 진입 시 | 인지 왜곡 + 긍정 이면 분석 | JSON |
| CBT 턴마다 | 소크라테스식 다음 질문 생성 | 텍스트 50자 이내 |

**호출하지 않는 곳**
- 슬라이더 입력 및 감정 지수 저장
- 힌트 제공 (사전 정의 데이터셋에서 룩업)
- 세션 요약 카드 렌더링
- 감정 이력 차트
- 세션 데이터 저장/불러오기

> LLM 호출 구현 위치(`lib/llm.js`) 및 컴포넌트 분리 규칙은 [frontend/CLAUDE.md](./frontend/CLAUDE.md) 참조.

---

## 핵심 데이터 구조

**세션 상태 객체 (contextObj) — 프론트엔드·백엔드 간 공유 계약. 구조 임의 변경 금지.**

```json
{
  "sessionId": "string",
  "stage": "INTAKE | DISTORTION_ANALYSIS | REFRAME | CBT_DIALOGUE | CLOSE",
  "intakeSUD": 0,
  "closeSUD": null,
  "intakeText": "string",
  "distortions": [
    { "name": "string", "quote": "string", "explanation": "string" }
  ],
  "positives": [
    { "value": "string", "explanation": "string" }
  ],
  "selectedPositives": ["string"],
  "chatHistory": [
    { "role": "user | assistant", "content": "string" }
  ],
  "cbtTurn": 0,
  "createdAt": "ISO8601"
}
```

**힌트 데이터 구조 (`frontend/data/hints.json`)**
```json
[
  { "distortionType": "파국화", "hints": ["string", "string"] }
]
```
힌트는 LLM이 생성하지 않습니다. 사전 정의된 데이터에서 왜곡 유형 기준으로 룩업합니다.

**CBT 5턴** — `cbtTurn` 0→4 순서 고정, 건너뛰기 불가. 각 턴의 목적은 Product.md § 3 참조.

**SUD** — `intakeSUD` / `closeSUD` 모두 0~10 정수만 허용.

---

## 절대 금지 사항

레이어·언어와 무관하게 프로젝트 전체에 적용됩니다.

```
🚫 세션 단계 순서를 건너뛰거나 변경하는 코드
🚫 LLM을 호출해선 안 되는 시점에 LLM 호출
🚫 힌트를 LLM으로 생성하는 코드
🚫 진단명, 처방, 약물 관련 텍스트를 UI에 표시
🚫 사용자 상담 내용을 외부 서버로 전송 (DB 연동 전까지)
🚫 LLM 응답을 검증 없이 그대로 UI에 노출
🚫 contextObj 스키마 임의 변경
🚫 CBT Turn 순서 변경 또는 건너뛰기
```

---

## 면책 고지 (UI 필수 표시)

아래 문구는 앱 어딘가에 반드시 표시되어야 합니다. 삭제하거나 숨기는 코드 작성 금지.

```
본 앱은 전문 심리 치료를 대체하지 않습니다.
심각한 심리적 어려움이 있다면 전문가 상담을 받으세요.
```

---

## AI 아키텍처 로드맵

현재는 Phase 1입니다. 향후 단계가 들어올 자리를 미리 고려해서 코드를 짜세요.

```
Phase 1  프롬프트 엔지니어링   현재 진행 중
Phase 2  RAG                  frontend/lib/rag.js 예정 — 벡터 DB 검색 후 LLM 주입
Phase 3  Fine-tuning          llm.js의 model 파라미터 교체로 대응 예정
Phase 4  멀티 에이전트         frontend/lib/agents/ 디렉토리 예정
                               ├── analyzer.js
                               ├── counselor.js
                               ├── validator.js   ← 응답 품질 검증
                               └── summarizer.js
```

LLM 호출부는 최대한 모듈화하세요. 컴포넌트·컨트롤러와 LLM 로직이 결합된 코드는 작성하지 마세요.

---

## 미결 사항

결정 전까지 해당 부분 코드 작성을 보류하거나 TODO로 표시하세요.

```
TODO: DB 솔루션 확정 (사용자 계정, 세션 영구 저장)
TODO: RAG 벡터 DB 선택 (Pinecone vs Chroma)
TODO: Fine-tuning 데이터 수집 전략 확정
TODO: 위기 감지 로직 설계 (특정 키워드 감지 시 전문기관 안내)
TODO: 개인정보 처리방침 및 데이터 동의 UI
TODO: API 키 서버사이드 이전 (현재 클라이언트 노출 상태)
```
