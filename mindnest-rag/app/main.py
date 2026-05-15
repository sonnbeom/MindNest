from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import rag

app = FastAPI(title="MindNest RAG Server", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Spring Boot origin
    allow_methods=["POST"],
    allow_headers=["*"],
)

app.include_router(rag.router)


@app.get("/health")
def health():
    return {"status": "ok"}
