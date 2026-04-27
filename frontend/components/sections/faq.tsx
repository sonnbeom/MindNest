"use client";

import { useState } from "react";

const faqs = [
  {
    question: "CBT 상담은 일반 상담과 어떻게 다른가요?",
    answer:
      "일반 상담이 감정을 표현하고 공감받는 데 초점을 맞춘다면, CBT는 감정의 원인이 되는 생각 패턴을 직접 파악하고 바꾸는 실습 중심 접근입니다. 구체적인 기술을 배우기 때문에 세션이 끝난 후에도 스스로 적용할 수 있습니다.",
  },
  {
    question: "어떤 문제에 도움이 되나요?",
    answer:
      "불안, 우울, 번아웃, 낮은 자존감, 완벽주의, 대인관계 어려움 등 다양한 심리적 어려움에 효과적입니다. 전문 치료와 병행하셔도 좋습니다.",
  },
  {
    question: "인지 왜곡이 정확하게 분석되나요?",
    answer:
      "AI가 Beck의 공식 인지 왜곡 11가지 기준으로 분석하지만, 완벽하지 않을 수 있습니다. 분석 결과는 스스로 생각을 돌아보는 참고 자료로 활용하시고, 전문가 진단을 대체하지 않습니다.",
  },
  {
    question: "데이터는 어디에 저장되나요?",
    answer:
      "현재 버전에서는 상담 내용이 외부 서버로 저장되지 않습니다. 세션 데이터는 브라우저 메모리에만 존재하며, 페이지를 닫으면 삭제됩니다. 개인정보 걱정 없이 사용하실 수 있습니다.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="px-6 py-20" style={{ background: "var(--background)" }}>
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div
            className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4"
            style={{ background: "var(--primary-light)", color: "#92700a" }}
          >
            FAQ
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "var(--text)", fontFamily: "var(--font-serif, serif)" }}
          >
            자주 묻는 질문
          </h2>
        </div>

        {/* 아코디언 */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border overflow-hidden"
              style={{
                background: "#ffffff",
                borderColor: openIndex === i ? "var(--primary-mid)" : "var(--border)",
                borderRadius: "var(--radius-card)",
                boxShadow: openIndex === i ? "0 4px 20px rgba(245,200,0,0.12)" : "var(--shadow-card)",
              }}
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-medium"
                style={{ color: "var(--text)" }}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-sm sm:text-base">{faq.question}</span>
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: openIndex === i ? "var(--primary)" : "var(--primary-light)",
                    color: "#92700a",
                    transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  +
                </span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <div className="pt-0 pb-1 border-t" style={{ borderColor: "var(--border)" }} />
                  <p className="text-sm leading-relaxed pt-4" style={{ color: "var(--muted)" }}>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
