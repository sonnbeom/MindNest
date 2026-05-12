from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    anthropic_api_key: str
    chroma_persist_directory: str = "./chroma_db"
    embedding_model: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    retrieval_k: int = 3

    model_config = {"env_file": ".env"}


settings = Settings()
