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

### Phase 1 — FastAPI RAG 서버 기본 구조 ✅ 완료
- [x] FastAPI 프로젝트 세팅 (`mindnest-rag/`)
- [x] LangChain 설치 및 기본 RAG 파이프라인 구성
- [x] VectorDB 선택 및 연결 (ChromaDB)
- [x] 임베딩 모델 선택 — `paraphrase-multilingual-MiniLM-L12-v2` (FastEmbed, 한국어 지원)

### Phase 2 — 지식 베이스 데이터 제작 ✅ 완료
- [x] 인지 왜곡 × 상황 조합 청크 16개 제작 (`data/chunks/*.md`)
- [x] Synthetic 재구성 예시 데이터 생성 (`reframe_examples.md`)
- [x] ChromaDB 적재 완료 (`chroma_db/chroma.sqlite3` 존재)

### Phase 3 — Spring Boot 연동 ✅ 완료
- [x] Spring Boot → FastAPI HTTP 호출 구현 (`RagHttpClient.java`)
- [x] intake_analysis 호출 시 RAG 검색 결과 주입
- [x] reframe_generation 호출 시 RAG 검색 결과 주입
- [x] `RagConfig.java` 버그 수정 — `RestClient.Builder` 자동 주입 오류 → `RestClient.builder()` 직접 생성으로 변경

### Phase 4 — Before / After 비교 ✅ 완료
- [x] 대표 입력 10개 선정 (직장/인간관계/자존감/가족 상황)
- [x] Before: Claude 직접 호출 (RAG 없음)
- [x] After: FastAPI(RAG) → Claude 결과
- [x] `mindnest-rag/docs/before_after_examples.md` 기록 완료
- [x] 비교 스크립트 작성 (`scripts/compare_before_after.py`)

**Phase 4 결과 요약:**
- RAG 효과가 미미함 — counter_hints 표현 스타일이 달라지는 정도
- 원인 1: Claude가 CBT를 이미 학습하고 있어 RAG 없이도 기본 답변 생성 가능
- 원인 2: 청크당 표현 예시 4~6개로 임베딩 커버리지 부족
- 원인 3: 단순 1회 유사도 검색 — 구어체 입력에 취약
- → 리팩토링 필요 (상세 전략: `mindnest-rag/docs/refactoring_strategy.md`)

### Phase 5 — 면접 소재 정리
- [ ] 청킹 전략 선택 근거 문서화
- [ ] VectorDB 선택 비교 정리
- [ ] Before/After 예시 중 임팩트 큰 3개 추려서 발표용 준비
- [ ] 리팩토링 적용 후 개선 전/후 비교 추가

### Phase 6 — 검색 품질 리팩토링 (신규)
- [x] Step 1: 청크 표현 예시 20개로 확장 + ingest 재실행
- [x] Step 2: `MultiQueryRetriever` 적용 (한국어 커스텀 프롬프트 포함, claude-haiku 사용, 폴백 포함)
- [x] Step 3: Before/After 재측정 → `before_after_examples.md` 업데이트 완료 (2026-05-16)
- [ ] Step 4 (선택): Hybrid Search — BM25(kiwipiepy) + Vector, EnsembleRetriever

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

## 데이터 품질 한계 및 대안 전략

### 근본 문제

현재 RAG 지식 베이스는 **합성 데이터(Synthetic Data)** 로만 구성되어 있다.

- 원본: `cognitive_distortion.md` — CBT 이론 설명 텍스트
- 가공: 이론을 보고 "사용자가 이런 표현을 쓸 것 같다"고 추정해 직접 작성한 청크 16개
- 실제 상담 데이터 없음

**왜 실제 데이터를 쓸 수 없나:**
- 상담 세션 내용은 개인정보 + 의료정보 → 절대 공개되지 않음
- 한국어 CBT 말뭉치/데이터셋이 공개된 것이 거의 없음
- 이는 프로젝트 한계가 아니라 도메인 자체의 데이터 부재 문제

**결과적 약점:**
- 청크의 "관련 사용자 표현 예시"가 실제 발화 다양성을 충분히 커버하지 못할 수 있음
- 사용자가 예측하지 못한 표현을 쓰면 엉뚱한 청크가 검색될 수 있음

---

### 대안 전략 — 데이터 없이 검색 품질을 높이는 방법

실제 데이터를 구할 수 없으므로, **파이프라인을 개선**해 데이터 한계를 보완한다.

#### 전략 1. 청크 표현 다양화 (우선순위 높음, 난이도 낮음)

**문제:** 현재 청크당 사용자 표현 예시가 5~6개뿐 → 임베딩 커버리지 좁음  
**해결:** LLM으로 표현 예시를 청크당 20~30개로 확장 후 ingest 재실행

```
작업 위치: data/chunks/*.md
방법:
  1. 각 청크의 "관련 사용자 표현 예시" 섹션을 Claude로 확장
     프롬프트: "{왜곡유형} + {상황}에서 실제 사용자가 쓸 법한 표현 20개 추가 생성"
  2. 기존 표현과 합쳐서 청크 파일 업데이트
  3. chroma_db/ 삭제 후 scripts/ingest.py 재실행
주의: chroma_db/ 삭제 시 기존 벡터 전부 사라짐 — ingest.py 재실행 필수
```

#### 전략 2. Query Expansion — 쿼리 확장 (우선순위 중간, 난이도 중간)

**문제:** 사용자 입력이 청크 표현과 표면적으로 달라서 관련 청크가 검색 안 될 수 있음  
**해결:** 검색 전에 LLM이 사용자 입력을 다양한 표현으로 확장 → 확장된 쿼리로 검색

```
작업 위치: app/services/retriever.py
방법:
  1. retrieve(query) 내부에서 먼저 LLM 호출
     "다음 텍스트와 같은 의미의 표현 3가지를 생성하세요: {query}"
  2. 원본 쿼리 + 확장 쿼리 3개 = 총 4개 쿼리로 각각 검색
  3. 검색 결과 합쳐서 중복 제거 후 상위 k개 반환
효과: 청크 표현 커버리지가 좁아도 다양한 각도로 검색해 보완
주의: LLM 호출이 1회 추가되어 응답 지연 발생 — 캐싱 고려
```

#### 전략 3. Hybrid Search — 키워드 + 벡터 검색 병행 (우선순위 낮음, 난이도 높음)

**문제:** 벡터 검색만으로는 "낙인", "실패자" 같은 핵심 키워드가 포함된 청크를 못 잡을 수 있음  
**해결:** BM25(키워드 검색) + 벡터 검색 결과를 합산해 순위 결정

```
작업 위치: app/services/retriever.py
방법:
  1. langchain_community의 BM25Retriever 추가
  2. EnsembleRetriever로 BM25 + Chroma 결과 가중 합산
     (예: BM25 0.4 + 벡터 0.6)
  3. 합산 점수 기준 상위 k개 반환
효과: 의미 검색 실패 시 키워드로 보완, 둘 다 잡히면 더 높은 점수
```

---

### 리팩토링 체크리스트

최종 리팩토링 시 아래 순서로 진행한다.

- [x] **전략 1**: 각 청크 표현 예시 LLM으로 확장 → ingest.py 재실행
- [x] **전략 2**: `app/services/retriever.py`에 MultiQueryRetriever 적용 (한국어 프롬프트 + 폴백)
- [x] Before/After 비교 재실행 — 전략 적용 전/후 검색 결과 품질 비교
- [x] `docs/before_after_examples.md` 업데이트
- [ ] (선택) **전략 3**: Hybrid Search — 전략 1·2로 충분하면 스킵

---

## 미결 사항

```
TODO: VectorDB 최종 선택 (ChromaDB vs FAISS)
TODO: 임베딩 모델 선택 (klue/roberta vs OpenAI text-embedding-3-small)
TODO: Spring Boot ↔ FastAPI 통신 방식 확정 (REST HTTP)
```
