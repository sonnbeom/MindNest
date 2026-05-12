from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.pipeline import analyze_intake, generate_reframe

router = APIRouter(prefix="/rag", tags=["rag"])


class AnalyzeRequest(BaseModel):
    intake_text: str


class ReframeRequest(BaseModel):
    selected_thought: str
    fact: str
    selected_counters: list[str]
    selected_actions: list[str]


class AnalyzeResponse(BaseModel):
    result: str  # JSON 문자열 (intake_analysis 출력 스키마 그대로)


class ReframeResponse(BaseModel):
    result: str  # plain text 재구성 문장


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    try:
        result = analyze_intake(request.intake_text)
        return AnalyzeResponse(result=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/reframe", response_model=ReframeResponse)
def reframe(request: ReframeRequest):
    try:
        result = generate_reframe(
            request.selected_thought,
            request.fact,
            request.selected_counters,
            request.selected_actions,
        )
        return ReframeResponse(result=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
