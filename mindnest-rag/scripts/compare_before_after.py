"""
Before/After RAG 비교 스크립트.

Before: Claude API 직접 호출 (RAG 없음)
After:  FastAPI /rag/analyze 경유 (RAG 적용)

실행: python scripts/compare_before_after.py
결과: docs/before_after_examples.md 에 기록
"""
import json
import sys
from pathlib import Path
from datetime import datetime

import anthropic
import httpx
from dotenv import load_dotenv
import os

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
RAG_SERVER_URL = "http://localhost:8000"
MODEL = "claude-haiku-4-5-20251001"
PROMPTS_DIR = Path(__file__).parent.parent / "prompts"
DOCS_DIR = Path(__file__).parent.parent / "docs"

# 비교할 대표 입력 10개 — 직장/인간관계/자존감 각 상황 커버
INPUTS = [
    # 직장/성과 — 낙인 찍기
    {
        "id": "case_01",
        "category": "직장/성과 — 낙인 찍기",
        "text": "오늘 발표에서 말이 꼬였어. 나는 역시 안 되는 사람이야. 이런 것도 제대로 못 하다니.",
    },
    # 직장/성과 — 흑백논리
    {
        "id": "case_02",
        "category": "직장/성과 — 흑백논리",
        "text": "보고서 한 군데 틀렸어. 완벽하게 못 하면 하나마나지. 팀장한테 칭찬도 못 받았고.",
    },
    # 직장/성과 — 성급한 결론
    {
        "id": "case_03",
        "category": "직장/성과 — 성급한 결론",
        "text": "팀장이 오늘 내 의견을 또 무시했어. 어차피 내가 뭘 말해도 달라지는 게 없을 거야.",
    },
    # 인간관계 — 낙인 찍기
    {
        "id": "case_04",
        "category": "인간관계 — 낙인 찍기",
        "text": "친구가 연락을 안 해. 나는 원래 매력 없는 사람이라서 그런 것 같아. 항상 내가 먼저 연락해야 해.",
    },
    # 인간관계 — 지나친 일반화
    {
        "id": "case_05",
        "category": "인간관계 — 지나친 일반화",
        "text": "소개팅에서 또 거절당했어. 나는 사람들한테 항상 별로인가봐. 이번이 세 번째야.",
    },
    # 인간관계 — 성급한 결론
    {
        "id": "case_06",
        "category": "인간관계 — 성급한 결론",
        "text": "카톡 읽씹 당했어. 분명히 내가 뭔가 잘못 말했나봐. 나를 싫어하게 된 것 같아.",
    },
    # 자존감 — 낙인 찍기
    {
        "id": "case_07",
        "category": "자존감 — 낙인 찍기",
        "text": "다이어트 또 실패했어. 나는 의지가 없는 사람이야. 원래 이런 사람인 것 같아.",
    },
    # 자존감 — 긍정적인 면 무시하기
    {
        "id": "case_08",
        "category": "자존감 — 긍정적인 면 무시하기",
        "text": "주변 친구들은 다 잘 되는데 나만 제자리야. 내가 칭찬받아도 그냥 운이 좋았던 거지 실력이 아니야.",
    },
    # 자존감 — 흑백논리
    {
        "id": "case_09",
        "category": "자존감 — 흑백논리",
        "text": "목표했던 자격증 시험에서 1점 차이로 떨어졌어. 이 정도도 못 하면 나는 뭘 해도 안 되는 사람이야.",
    },
    # 자기 비난
    {
        "id": "case_10",
        "category": "자기 비난 — 가족",
        "text": "엄마랑 또 싸웠어. 내가 너무 예민하게 반응한 것 같아. 항상 내가 문제야.",
    },
]


def call_before(intake_text: str) -> dict:
    """RAG 없이 Claude 직접 호출."""
    system_prompt = (PROMPTS_DIR / "intake_system.txt").read_text(encoding="utf-8")
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    message = client.messages.create(
        model=MODEL,
        max_tokens=1024,
        system=system_prompt,
        messages=[{"role": "user", "content": f"[분석 대상 텍스트]\n{intake_text}"}],
    )
    raw = message.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw[raw.index("\n") + 1:] if "\n" in raw else raw[3:]
    if raw.endswith("```"):
        raw = raw[:raw.rfind("```")]
    return json.loads(raw.strip())


def call_after(intake_text: str) -> dict:
    """FastAPI RAG 서버 경유 호출."""
    response = httpx.post(
        f"{RAG_SERVER_URL}/rag/analyze",
        json={"intake_text": intake_text},
        timeout=60,
    )
    response.raise_for_status()
    raw = response.json()["result"]
    return json.loads(raw)


def compare_counter_hints(before: list, after: list) -> str:
    b = " / ".join(before)
    a = " / ".join(after)
    return f"Before: `{b}`\nAfter:  `{a}`"


def run():
    print(f"비교 시작 — {len(INPUTS)}개 입력\n")
    results = []

    for i, case in enumerate(INPUTS, 1):
        print(f"[{i}/{len(INPUTS)}] {case['id']} — {case['category']}")
        try:
            before = call_before(case["text"])
            print(f"  Before 완료")
        except Exception as e:
            print(f"  Before 실패: {e}")
            before = None

        try:
            after = call_after(case["text"])
            print(f"  After  완료")
        except Exception as e:
            print(f"  After  실패: {e}")
            after = None

        results.append({"case": case, "before": before, "after": after})

    write_report(results)
    print(f"\n완료 → {DOCS_DIR / 'before_after_examples.md'}")


def write_report(results):
    lines = [
        "# Before / After 비교 예시",
        "",
        f"> 생성일: {datetime.now().strftime('%Y-%m-%d %H:%M')}  ",
        "> RAG 적용 전/후 동일 입력에 대한 LLM 응답 품질 비교  ",
        "> 측정 기준: counter_hints 구체성 / fact 정확도 / interpretation 정확도",
        "",
        "---",
        "",
        "## 비교 기준",
        "",
        "| 항목 | Before (RAG 없음) | After (RAG 적용) |",
        "|------|-------------------|-----------------|",
        "| 인지 왜곡 인식 | 일반적인 부정적 사고로 처리 | 특정 왜곡 유형에 맞는 분석 |",
        "| counter_hints | 막연한 반례 | 해당 왜곡·상황에 특화된 반례 |",
        "| 재구성 문장 | 일반적인 위로성 문장 | 왜곡 유형 맞춤 CBT 재구성 |",
        "",
        "---",
        "",
    ]

    for r in results:
        case = r["case"]
        before = r["before"]
        after = r["after"]

        lines += [
            f"## {case['id']} — {case['category']}",
            "",
            "**입력:**",
            f"> {case['text']}",
            "",
        ]

        if before:
            lines += [
                "**Before (RAG 없음):**",
                "```json",
                json.dumps(before, ensure_ascii=False, indent=2),
                "```",
                "",
            ]
        else:
            lines += ["**Before:** 호출 실패", ""]

        if after:
            lines += [
                "**After (RAG 적용):**",
                "```json",
                json.dumps(after, ensure_ascii=False, indent=2),
                "```",
                "",
            ]
        else:
            lines += ["**After:** 호출 실패", ""]

        if before and after:
            b_hints = before.get("counter_hints", [])
            a_hints = after.get("counter_hints", [])
            diff_lines = ["**차이점:**", ""]
            diff_lines.append(f"- **counter_hints Before:** {' / '.join(b_hints)}")
            diff_lines.append(f"- **counter_hints After:**  {' / '.join(a_hints)}")

            b_fact = before.get("fact", "")
            a_fact = after.get("fact", "")
            if b_fact != a_fact:
                diff_lines.append(f"- **fact Before:** {b_fact}")
                diff_lines.append(f"- **fact After:**  {a_fact}")

            lines += diff_lines + [""]

        lines += ["---", ""]

    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    (DOCS_DIR / "before_after_examples.md").write_text(
        "\n".join(lines), encoding="utf-8"
    )


if __name__ == "__main__":
    run()
