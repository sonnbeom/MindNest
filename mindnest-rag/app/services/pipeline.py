from pathlib import Path
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from app.config import settings
from app.services.retriever import knowledge_retriever

PROMPTS_DIR = Path(__file__).parent.parent.parent / "prompts"

llm = ChatAnthropic(
    model="claude-sonnet-4-6",
    api_key=settings.anthropic_api_key,
    max_tokens=1024,
)


def _load_prompt(filename: str) -> str:
    return (PROMPTS_DIR / filename).read_text(encoding="utf-8")


def _build_context_section(context: str) -> str:
    if not context:
        return ""
    return f"\n\n[관련 인지 왜곡 지식 — 아래 내용을 참고하여 분석하세요]\n{context}"


def _strip_code_fences(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = text[text.index("\n") + 1:] if "\n" in text else text[3:]
    if text.endswith("```"):
        text = text[: text.rfind("```")]
    return text.strip()


def analyze_intake(intake_text: str) -> str:
    """
    호출 1: 사용자 입력 → RAG 검색 → intake 분석 JSON 반환.
    LangChain LCEL 체인 사용.
    """
    system_base = _load_prompt("intake_system.txt")

    prompt = ChatPromptTemplate.from_messages([
        ("system", "{system}"),
        ("human", "[분석 대상 텍스트]\n{intake_text}"),
    ])

    chain = (
        RunnablePassthrough.assign(
            system=lambda x: system_base + _build_context_section(
                knowledge_retriever.retrieve(x["intake_text"])
            )
        )
        | prompt
        | llm
        | StrOutputParser()
    )

    return _strip_code_fences(chain.invoke({"intake_text": intake_text}))


def generate_reframe(
    selected_thought: str,
    fact: str,
    selected_counters: list[str],
    selected_actions: list[str],
) -> str:
    """
    호출 2: 선택된 반례/행동 → RAG 검색 → 재구성 문장 반환.
    LangChain LCEL 체인 사용.
    """
    system_base = _load_prompt("reframe_system.txt")
    query = f"{selected_thought} {fact}"

    reframe_examples = knowledge_retriever.retrieve(query)
    system = system_base
    if reframe_examples:
        system += f"\n\n[참고 재구성 예시 — 아래 스타일을 참고하세요]\n{reframe_examples}"

    user_content = (
        f"[선택한 생각]\n{selected_thought}\n\n"
        f"[사실]\n{fact}\n\n"
        f"[선택한 반례]\n{', '.join(selected_counters)}\n\n"
        f"[선택한 현재 행동]\n{', '.join(selected_actions)}\n\n"
        "[지시]\n위 내용을 바탕으로 재구성 문장을 plain text로만 출력하세요."
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", system),
        ("human", user_content),
    ])

    chain = prompt | llm | StrOutputParser()
    return chain.invoke({})
