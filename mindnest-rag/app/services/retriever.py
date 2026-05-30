import logging
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from langchain_chroma import Chroma
from langchain_anthropic import ChatAnthropic
from langchain.retrievers.multi_query import MultiQueryRetriever
from langchain_core.prompts import PromptTemplate
from app.config import settings

logger = logging.getLogger(__name__)

# 한국어 CBT 도메인에 맞춘 쿼리 확장 프롬프트
# 사용자의 구어체 입력을 다양한 표현으로 확장해 검색 커버리지를 높임
KOREAN_MULTI_QUERY_PROMPT = PromptTemplate(
    input_variables=["question"],
    template="""당신은 인지행동치료(CBT) 심리 상담 보조 AI입니다.
사용자의 입력을 벡터 데이터베이스에서 검색하기 위해 다양한 표현으로 변환하려 합니다.

다음 사용자 입력과 동일한 심리적 상황이나 인지 왜곡을 표현하는 다른 방식의 문장을 3개 생성하세요.
- 구어체, 문어체 혼합
- 다양한 인지 왜곡 유형 키워드 포함 (예: 흑백논리, 낙인 찍기, 과잉일반화 등)
- 직장/인간관계/자존감/가족 상황 맥락 유지

원본 입력: {question}

확장된 쿼리 3개를 각 줄에 하나씩 출력하세요. 번호나 추가 설명 없이 쿼리만 작성하세요.""",
)


class KnowledgeRetriever:
    """ChromaDB에서 관련 청크를 검색하는 클래스.

    MultiQueryRetriever를 통해 사용자 입력을 여러 표현으로 확장 후 검색하여
    구어체 입력과 청크 표현 간 어휘 불일치를 보완한다.
    """

    def __init__(self):
        embeddings = FastEmbedEmbeddings(
            model_name=settings.embedding_model
        )
        self._vectorstore = Chroma(
            persist_directory=settings.chroma_persist_directory,
            embedding_function=embeddings,
        )

        llm = ChatAnthropic(
            model="claude-haiku-4-5-20251001",
            api_key=settings.anthropic_api_key,
            temperature=0.3,
            max_tokens=256,
        )

        base_retriever = self._vectorstore.as_retriever(
            search_kwargs={"k": settings.retrieval_k}
        )

        self._retriever = MultiQueryRetriever.from_llm(
            retriever=base_retriever,
            llm=llm,
            prompt=KOREAN_MULTI_QUERY_PROMPT,
            include_original=True,  # 원본 쿼리도 검색에 포함
        )

    def retrieve(self, query: str) -> str:
        """쿼리와 유사한 청크를 검색해 하나의 문자열로 반환.

        MultiQueryRetriever가 내부적으로 쿼리를 3개 확장 + 원본 포함(총 4개)으로
        검색한 뒤 중복을 제거해 반환한다.
        """
        try:
            docs = self._retriever.invoke(query)
        except Exception as e:
            logger.warning("MultiQueryRetriever 실패, 단순 벡터 검색으로 폴백: %s", e)
            docs = self._vectorstore.as_retriever(
                search_kwargs={"k": settings.retrieval_k}
            ).invoke(query)

        if not docs:
            return ""
        return "\n\n".join(doc.page_content for doc in docs)


# 앱 전체에서 단일 인스턴스 공유 (임베딩 모델 로딩 비용 절감)
knowledge_retriever = KnowledgeRetriever()
