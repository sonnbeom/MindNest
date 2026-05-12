from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from app.config import settings


class KnowledgeRetriever:
    """ChromaDB에서 관련 청크를 검색하는 클래스."""

    def __init__(self):
        embeddings = HuggingFaceEmbeddings(model_name=settings.embedding_model)
        self._vectorstore = Chroma(
            persist_directory=settings.chroma_persist_directory,
            embedding_function=embeddings,
        )
        self._retriever = self._vectorstore.as_retriever(
            search_kwargs={"k": settings.retrieval_k}
        )

    def retrieve(self, query: str) -> str:
        """쿼리와 유사한 청크를 검색해 하나의 문자열로 반환."""
        docs = self._retriever.invoke(query)
        if not docs:
            return ""
        return "\n\n".join(doc.page_content for doc in docs)


# 앱 전체에서 단일 인스턴스 공유 (임베딩 모델 로딩 비용 절감)
knowledge_retriever = KnowledgeRetriever()
