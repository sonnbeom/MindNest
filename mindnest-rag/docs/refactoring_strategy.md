# RAG 검색 품질 개선 — 리팩토링 전략

> **작성 배경**: Phase 4 Before/After 비교 결과 RAG 효과가 미미함을 확인.
> 원인을 분석하고 개선 전략을 수립한 문서.

---

## 현재 문제 진단

### 문제 1. RAG 효과 미미

Phase 4 비교 결과, Before(RAG 없음)와 After(RAG 적용) 간 품질 차이가 작음.

**근본 원인:**
Claude Sonnet/Haiku는 CBT 개념을 이미 학습하고 있음.
"낙인 찍기 왜곡의 반례는 행동과 자아를 분리하는 것" 같은 내용을 RAG로 주입해도
LLM이 이미 같은 수준의 답을 생성할 수 있는 상태.

→ RAG가 "LLM이 모르는 것"을 주입해야 효과가 나는데, 현재 청크 내용이 LLM의 기존 지식과 겹침.

### 문제 2. 임베딩 커버리지 부족

현재 청크당 "관련 사용자 표현 예시" 4~6개.

```
labeling_work.md: 6개
대부분 파일: 4~5개
```

사용자가 "또 망했어", "역시 난 안 되나봐" 같은 구어체나 간접 표현을 입력하면
청크 표현과 벡터 유사도가 낮아져 엉뚱한 청크가 검색될 수 있음.

### 문제 3. 단순 1회 유사도 검색

```python
self._retriever = self._vectorstore.as_retriever(search_kwargs={"k": 3})
```

사용자 입력 그대로 1회 검색. 표현 차이에 취약.

### 문제 4. 주석-코드 불일치 (마이너)

`retriever.py` 주석:
```python
# multilingual-e5-small: 한국어 포함 다국어 지원, ~117MB
```

실제 사용 모델 (`config.py`):
```python
embedding_model: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
```

→ 주석 수정 필요.

---

## 리팩토링 전략 후보

### 후보 1. 청크 표현 다양화 (Synthetic Data 확장)

**내용:** 현재 4~6개인 표현 예시를 LLM으로 20개로 확장 → ingest 재실행

**장점:**
- 임베딩 커버리지 직접 확대
- 구현 단순 (`.md` 파일 수정 + 스크립트 재실행)
- 다른 전략과 병행 가능한 기반 작업

**단점:**
- 단독으로는 면접 기술적 깊이 부족 ("그냥 데이터 더 넣은 거잖아요?" 반응 가능)
- LLM 생성 표현이 실제 사용자 표현과 다를 수 있음
- 문제 1(LLM이 이미 앎)은 해결 안 됨

**난이도:** 낮음  
**면접 가치:** 낮음 (단독 시) / 중간 (다른 전략과 결합 시)  
**결정:** ✅ 기반 작업으로 실행

---

### 후보 2. MultiQueryRetriever (Query Expansion)

**내용:** 사용자 쿼리를 LLM이 3개 변형으로 확장 → 각각 검색 → 중복 제거 → 상위 k개 반환

**장점:**
- `langchain` 패키지에 `MultiQueryRetriever`가 이미 내장 → 추가 설치 불필요
- `pipeline.py` 수정 없이 `retriever.py`만 교체
- "쿼리 표현 다양성 문제를 LLM으로 해결" — 명확한 문제-해결 스토리
- 짧은 구어체 입력("또 망했어")에 특히 효과적

**단점:**
- 쿼리 변형 생성을 위한 LLM 추가 호출 → 응답 지연 + 비용 증가
- 기본 프롬프트가 영어 → 한국어 심리 상담 맥락 커스텀 프롬프트 필수
- ChromaDB에 16개 벡터뿐이라 중복 제거 후 실제 다양성이 제한됨

**구현 포인트:**
```python
from langchain.retrievers.multi_query import MultiQueryRetriever

# 한국어 커스텀 프롬프트 필요
# 기본: "Generate 3 versions of the question"
# 변경: "심리 상담 맥락에서 아래 문장을 3가지 다른 표현으로 재작성하세요"
```

**난이도:** 중간  
**면접 가치:** 높음  
**결정:** ✅ 핵심 전략으로 실행

---

### 후보 3. k값 튜닝 (k=3 → k=5)

**내용:** `config.py`의 `retrieval_k` 값 변경

**장점:**
- 1줄 수정

**단점:**
- 16개 청크 중 5개 반환 = 전체의 31% → 관련 없는 청크가 섞여 LLM 컨텍스트 오염
- "낙인 찍기×직장" 검색 시 "흑백논리×자존감" 같은 유사하지만 다른 청크가 함께 검색될 수 있음
- 면접 소재 가치 없음

**난이도:** 낮음  
**면접 가치:** 없음  
**결정:** ❌ 제외

---

### 후보 4. Hybrid Search (BM25 + Vector)

**내용:** 키워드 검색(BM25) + 벡터 검색(ChromaDB)을 RRF(Reciprocal Rank Fusion)로 합산

```
BM25 가중치 0.3 + Vector 가중치 0.7 = EnsembleRetriever
```

**장점:**
- 의미 검색이 실패할 때 키워드로 보완 (예: "낙인 찍기"라는 단어가 직접 입력된 경우)
- `langchain_community`에 `BM25Retriever`, `EnsembleRetriever` 이미 존재
- 면접에서 "Naive RAG → Query Expansion → Hybrid Search" 단계적 발전 스토리 완성

**단점:**
- BM25 한국어 기본 처리가 공백 분리 수준 → 형태소 분석기 없이는 품질 낮음
- 한국어 형태소 분석기 필요: `kiwipiepy` (순수 Python, JDK 불필요, `pip install kiwipiepy`로 설치)
- 구현 복잡도 증가

**구현 포인트:**
```python
from langchain_community.retrievers import BM25Retriever
from langchain.retrievers import EnsembleRetriever
from kiwipiepy import Kiwi

kiwi = Kiwi()

def korean_tokenizer(text: str) -> list[str]:
    return [token.form for token in kiwi.tokenize(text)]

bm25 = BM25Retriever.from_documents(docs, preprocess_func=korean_tokenizer)
ensemble = EnsembleRetriever(
    retrievers=[bm25, chroma_retriever],
    weights=[0.3, 0.7]
)
```

**난이도:** 높음  
**면접 가치:** 매우 높음  
**결정:** ✅ 선택 (Phase 2 이후 시간 허락 시)

---

### 후보 5. Reranking (Cross-encoder)

**내용:** k=10으로 넓게 검색 → Cross-encoder로 재순위 → 상위 3개 반환

**장점:**
- "넓게 검색 → 정밀 재순위" — 현업 RAG의 검증된 패턴
- 면접 개념 가치 높음

**단점:**
- 현재 ChromaDB에 16개 벡터뿐 → k=10이면 전체의 62.5% 검색 → Reranker 작동 조건 불충족
- `sentence-transformers` 추가 설치 필요
- 한국어 Cross-encoder 모델 품질 불균일

→ 데이터가 수백 개 이상일 때 도입할 기법. 현 규모에서 구현하면 "효과 없는 기법을 적용했다"는 평가 가능.

**난이도:** 높음  
**면접 가치:** 개념 설명 수준  
**결정:** ❌ 제외 (개념으로만 언급)

---

## 전략 비교 요약

| 전략 | 난이도 | 실제 효과 | 면접 가치 | 결정 |
|------|--------|-----------|-----------|------|
| 청크 표현 다양화 | 낮음 | 중간 | 낮음(단독) | ✅ 기반 |
| MultiQueryRetriever | 중간 | 중간-높음 | 높음 | ✅ 핵심 |
| k값 튜닝 | 낮음 | 낮음/역효과 | 없음 | ❌ |
| Hybrid Search (BM25+Vector) | 높음 | 높음 | 매우 높음 | ✅ 선택 |
| Reranking | 높음 | 낮음(소규모) | 개념만 | ❌ |

---

## 최종 실행 계획

```
Step 1. 청크 표현 다양화
  → data/chunks/*.md 표현 예시 20개로 확장 (LLM 생성)
  → chroma_db/ 삭제 후 scripts/ingest.py 재실행

Step 2. MultiQueryRetriever 적용
  → app/services/retriever.py 수정
  → 한국어 커스텀 프롬프트 작성
  → app/config.py에 검색 전략 설정 추가

Step 3. Before/After 재측정
  → scripts/compare_before_after.py 재실행
  → docs/before_after_examples.md 업데이트

Step 4. (선택) Hybrid Search 적용
  → requirements.txt에 kiwipiepy 추가
  → app/services/retriever.py에 EnsembleRetriever 추가
```

---

## 면접 답변 스토리라인

> "초기에 Naive RAG를 구현했는데 Before/After 비교에서 효과가 미미했습니다.
> 원인 분석을 해보니 두 가지였습니다.
> 첫째, 청크당 표현 예시가 4~6개로 적어 임베딩 커버리지가 부족했고,
> 둘째, 단순 1회 유사도 검색이라 사용자의 구어체 표현이 청크 표현과 달라지면
> 잘못된 청크가 검색됐습니다.
> 이를 해결하기 위해 Synthetic Data로 표현 예시를 20개로 확장하고,
> LangChain MultiQueryRetriever로 쿼리를 3개 변형으로 확장해 검색하는 방식을 도입했습니다.
> 기본 프롬프트가 영어라 한국어 심리 상담 도메인에 맞게 커스터마이징했습니다."
