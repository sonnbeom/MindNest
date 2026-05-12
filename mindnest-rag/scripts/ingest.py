"""
지식 베이스 청크를 ChromaDB에 적재하는 스크립트.

사용법:
    python scripts/ingest.py

data/chunks/ 디렉토리의 모든 .md 파일을 읽어 VectorDB에 저장합니다.
"""
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import MarkdownTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from app.config import settings

CHUNKS_DIR = Path(__file__).parent.parent / "data" / "chunks"


def ingest():
    print(f"청크 디렉토리: {CHUNKS_DIR}")
    chunk_files = list(CHUNKS_DIR.glob("*.md"))
    if not chunk_files:
        print("청크 파일이 없습니다. data/chunks/ 에 .md 파일을 추가하세요.")
        return

    loader = DirectoryLoader(
        str(CHUNKS_DIR),
        glob="*.md",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8"},
    )
    docs = loader.load()
    print(f"로드된 문서: {len(docs)}개")

    # 마크다운 헤더 기준으로 분할 (청크가 이미 작게 설계되어 있으면 그대로 사용)
    splitter = MarkdownTextSplitter(chunk_size=500, chunk_overlap=50)
    splits = splitter.split_documents(docs)
    print(f"분할된 청크: {len(splits)}개")

    embeddings = HuggingFaceEmbeddings(model_name=settings.embedding_model)
    vectorstore = Chroma.from_documents(
        documents=splits,
        embedding=embeddings,
        persist_directory=settings.chroma_persist_directory,
    )
    print(f"VectorDB 저장 완료: {settings.chroma_persist_directory}")
    print(f"총 {vectorstore._collection.count()}개 벡터 저장됨")


if __name__ == "__main__":
    ingest()
