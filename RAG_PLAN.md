# MindNest RAG/LangChain 개선 계획

> **목적**: 면접 대비용 RAG + LangChain 실전 경험 확보  
> **방향**: Top-down — 면접 예상 질문 기준으로 역산하여 프로젝트 구현

---

## 배경

- MindNest는 CBT(인지행동치료) 기반 심리 상담 보조 앱
- 현재 LLM 호출 2회 (intake_analysis, reframe_generation)
- 지식 베이스 없이 프롬프트 엔지니어링만으로 운영 중
- RAG/LangChain을 면접 소재로 만들기 위해 Python FastAPI 서버 추가

---

## 최종 아키텍처

```
React (프론트엔드)
    ↓
Spring Boot (메인 API — 세션 관리, 라우팅)
    ↓ HTTP 호출
FastAPI (RAG 서버 — LangChain + VectorDB)   ← 신규 추가
    ↓
Claude API (LLM)
```

**왜 두 서버로 나눴나?** (면접 답변 소재)  
→ LLM 파이프라인은 Python 생태계(LangChain, ChromaDB 등)가 압도적으로 성숙. 역할 분리로 각 서버가 잘하는 것에 집중.

---

## 구현 순서

### Phase 1 — FastAPI RAG 서버 기본 구조
- [ ] FastAPI 프로젝트 세팅 (`mindnest-rag/`)
- [ ] LangChain 설치 및 기본 RAG 파이프라인 구성
- [ ] VectorDB 선택 및 연결 (ChromaDB 우선)
- [ ] 임베딩 모델 선택 (한국어 지원 고려)

### Phase 2 — 지식 베이스 데이터 제작
- [ ] 인지 왜곡 × 상황 조합 청크 제작 (기존 `cognitive_distortion.md` 기반)
- [ ] Synthetic 재구성 예시 데이터 생성 (LLM으로 합성)
- [ ] 청크 VectorDB 적재

### Phase 3 — Spring Boot 연동
- [ ] Spring Boot → FastAPI HTTP 호출 구현
- [ ] intake_analysis 호출 시 RAG 검색 결과 주입
- [ ] reframe_generation 호출 시 RAG 검색 결과 주입

### Phase 4 — Before / After 비교
- [ ] 대표 입력 10개 선정 (직장/인간관계/자존감 각 상황)
- [ ] Before: 기존 Spring Boot → Claude 직접 호출 결과 저장
- [ ] After: Spring Boot → FastAPI(RAG) → Claude 결과 저장
- [ ] `mindnest-rag/docs/before_after_examples.md`에 비교 기록

### Phase 5 — 면접 소재 정리
- [ ] 청킹 전략 선택 근거 문서화
- [ ] VectorDB 선택 비교 정리
- [ ] Before/After 예시 중 임팩트 큰 3개 추려서 발표용 준비

---

## 지식 베이스 구성

### 데이터 종류

| 우선순위 | 데이터 | 활용 LLM 호출 | 제작 방법 |
|---------|--------|--------------|---------|
| 1 | 인지 왜곡 × 상황 케이스북 | 호출 1 (intake_analysis) | `cognitive_distortion.md` 확장 |
| 2 | 재구성 문장 예시 DB | 호출 2 (reframe_generation) | LLM Synthetic Data 생성 |

### 청크 설계 원칙

- 청크 단위: **인지 왜곡 유형 × 상황 카테고리** 조합
- 상황 카테고리: 직장/성과, 인간관계, 자존감, 가족
- 청크 내 포함: 관련 사용자 표현 예시 + 왜곡 패턴 + 반례 접근법

```markdown
# 청크 예시: 낙인 찍기 + 직장/성과 상황

관련 사용자 표현: "나는 무능한 사람이다", "나는 실패자야", "나 진짜 못하는 것 같아"
왜곡 유형: 낙인 찍기 (Labeling)
핵심 패턴: 실수 하나를 자아 전체로 확대
반례 접근: 실수와 실패자는 다름, 과거 성공 경험 탐색, 행동과 자아 분리
```

### 재구성 예시 — Synthetic Data 생성 방법

```
데이터가 없으므로 LLM에게 직접 생성 요청:
"직장 + 낙인 찍기 왜곡 상황의 CBT 기반 재구성 문장 예시 30개 만들어줘.
 형식: 입력 상황 | 재구성 문장"
```

---

## Before / After 비교 기준

동일 입력을 RAG 전/후로 각각 호출해 결과 비교.

| 측정 항목 | Before | After |
|----------|--------|-------|
| 인지 왜곡 인식 | 일반적 부정 사고로만 처리 | 왜곡 유형 명확히 인식 |
| counter_hints 구체성 | 막연한 반례 | 해당 왜곡에 특화된 반례 |
| 재구성 문장 품질 | 일반적 위로성 문장 | 왜곡 유형 맞춤 CBT 재구성 |

---

## 면접 예상 질문 & 답변 포인트

### 기초 (거의 확실히 나옴)

| 질문 | 답변 포인트 |
|------|-----------|
| RAG가 뭔지, 왜 fine-tuning 대신? | CBT 지식 업데이트 시 재학습 불필요, 지식베이스 교체만으로 가능 |
| 임베딩이 무엇인가요? | 텍스트 → 벡터 변환 → 유사 청크 검색 과정 |
| 벡터 DB가 어떻게 작동? | 코사인 유사도로 의미적으로 가까운 청크 검색 |
| 청킹 전략을 어떻게 결정? | 고정 크기 아닌 의미 단위(인지 왜곡 × 상황) 선택 이유 |

### 설계 판단 (실력 검증)

| 질문 | 답변 포인트 |
|------|-----------|
| 벡터 DB 어떤 거 왜 선택? | ChromaDB — 로컬 우선, 설정 간단, 프로토타이핑에 적합 |
| 청크 사이즈 왜 그 크기? | 심리 상담 도메인 특성상 맥락 유지 필요 |
| 검색 품질 어떻게 평가? | 실제 쿼리로 검색 결과 확인, Before/After 비교 |
| 임베딩 모델 왜 선택? | 한국어 지원 여부 + 비용 고려 |

### 심화 (AI 특화 포지션)

| 질문 | 현재 커버 여부 |
|------|-------------|
| Naive RAG vs Advanced RAG | 추후 Reranking 추가 시 답변 가능 |
| Hybrid Search | 추후 구현 시 |
| Hallucination 방지 | RAG 자체가 답변 근거를 제공하는 방식으로 설명 |

---

## 참고 파일

| 파일 | 역할 |
|------|------|
| `mindnest-api/src/main/resources/prompts/intake_analysis.md` | 호출 1 프롬프트 |
| `mindnest-api/src/main/resources/prompts/reframe_generation.md` | 호출 2 프롬프트 |
| `mindnest-api/cognitive_distortion.md` | 인지 왜곡 10가지 — 지식 베이스 원본 |

---

## 미결 사항

```
TODO: VectorDB 최종 선택 (ChromaDB vs FAISS)
TODO: 임베딩 모델 선택 (klue/roberta vs OpenAI text-embedding-3-small)
TODO: Spring Boot ↔ FastAPI 통신 방식 확정 (REST HTTP)
```
